import { StackScreenProps } from "@react-navigation/stack";
import {
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiBipTripStackParamList } from "../../../../Router";
import TripInfo from "../../../components/views/TripInfo/TripInfo";
import TripNotification from "../../../components/views/TripNotification/TripNotification";
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { getCarId } from "./Trip.action";
import UserContext from "../../../utils/context/UserContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Camera, MapView, UserLocation } from "@rnmapbox/maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useMqtt from "../../../utils/hooks/useMqtt";

type NavigatorProps = StackScreenProps<BiBipTripStackParamList, "Trip">;

interface TripProps extends NavigatorProps {}

const Trip: FunctionComponent<TripProps> = memo(({ navigation }) => {
  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [helpModalShown, setHelpModalShown] = useState(true);
  const [followUser, setFollowUser] = useState(false);

  const userContext = useContext(UserContext);

  const [status, requestPermission] = Location.useForegroundPermissions();

  const camera = useRef<Camera>(null);
  const userLocation = useRef<UserLocation>(null);

  const isActiveDot = useSharedValue([1, 0, 0, 0]);

  const { lockCar, unlockCar } = useMqtt();
  const {
    data,
    isLoading: isCarLoading,
    isFetched: isCarFetched,
    refetch: refetchCarId,
  } = useQuery({
    queryKey: "carId",
    queryFn: () =>
      getCarId(userContext.user?.getUsername()!, userContext.token!)
        .then((val) => {
          return val.data;
        })
        .catch((e) => {
          userContext.updateToken();

          return "";
        }),
    enabled: !!userContext.token,
  });

  const {} = useQuery({
    queryKey: "unlockCar",
    queryFn: async () => await unlockCar(data.carId!),
    onError: (err) => console.log(JSON.stringify(err)),
    onSuccess: (val) => console.log(val),
    enabled: !!userContext.token && isCarFetched,
  });

  const onEndTrip = async () => {
    if (!data.carId) {
      userContext.updateToken();
      refetchCarId();
      return alert("Tekrar deneyin!");
    }
    navigation.navigate("TripEnd", {
      carId: data.carId,
      waypoints: waypoints,
    });
  };

  useEffect(() => {
    if (status) {
      if (status.status !== "granted") {
        requestPermission();
      }
    }

    const interval = setInterval(async () => {
      const location = await Location.getCurrentPositionAsync();

      waypoints.push({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const focusToUser = setTimeout(() => {
      camera.current?.setCamera({
        centerCoordinate: userLocation.current?.state.coordinates ?? [0, 0],
        zoomLevel: 16,
        animationDuration: 500,
      });
    }, 1000);

    return () => {
      clearTimeout(focusToUser);
    };
  }, []);

  useEffect(() => {
    console.log("currentImagechanged", currentImage);

    isActiveDot.value.forEach((_, index) => {
      if (index === currentImage) {
        isActiveDot.value[index] = 1;
      } else {
        isActiveDot.value[index] = 0;
      }
    });
    console.log(isActiveDot.value);
  }, [currentImage]);

  const images = [
    require("../../../../assets/handbrake-info.png"),
    require("../../../../assets/brake-info.png"),
    require("../../../../assets/gas-info.png"),
    require("../../../../assets/all-info.png"),
  ];

  const imageViews = images.map((image, index) => {
    return (
      <Animated.View
        key={index}
        className="rounded-full border border-bibip-green-500 h-2 aspect-square"
        style={useAnimatedStyle(() => {
          const isActive = currentImage === index;

          return {
            backgroundColor: withTiming(isActive ? "#23a65e" : "white"),
          };
        }, [isActiveDot, currentImage])}
      />
    );
  });
  return (
    <View className="w-full h-full flex-col flex justify-between">
      <Spinner visible={isLoading} />
      {helpModalShown && (
        <BlurView
          className="w-screen bottom-4 h-screen absolute px-4 bg-white/10 justify-center flex flex-col"
          style={{
            zIndex: 10,
          }}
        >
          <View className="w-full bg-white py-4 flex flex-col justify-center px-4 rounded-3xl">
            <Image
              source={images[currentImage]}
              width={100}
              height={100}
              style={{
                resizeMode: "contain",
                alignSelf: "center",
                width: "100%",
                height: 450,
                margin: 0,
              }}
            />
            <View className="w-full flex flex-row justify-between">
              {currentImage !== 0 ? (
                <TouchableOpacity
                  className="aspect-square rounded-full flex flex-col items-center justify-center h-12 bg-bibip-green-500"
                  onPress={() => {
                    setCurrentImage((prev) => prev - 1);
                  }}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    color={"white"}
                    size={36}
                  />
                </TouchableOpacity>
              ) : (
                <View className="h-12 bg-transparent aspect-square" />
              )}
              <View
                className="flex flex-row items-center justify-center flex-1"
                style={{
                  columnGap: 2,
                }}
              >
                {imageViews}
              </View>
              {currentImage === images.length - 1 ? (
                <TouchableOpacity
                  className="aspect-square rounded-full flex flex-col items-center justify-center h-12 bg-bibip-green-500"
                  onPress={() => {
                    setHelpModalShown(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    color={"white"}
                    size={36}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="aspect-square rounded-full flex flex-col items-center justify-center h-12 bg-bibip-green-500"
                  onPress={() => {
                    setCurrentImage((prev) => prev + 1);
                  }}
                >
                  <MaterialCommunityIcons
                    name="arrow-right"
                    color={"white"}
                    size={36}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      )}
      <View
        className="absolute"
        style={{
          zIndex: -5,
          height: "100%",
          width: "100%",
        }}
      >
        <MapView
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Camera ref={camera} />
          <UserLocation
            visible
            ref={userLocation}
            onUpdate={(e) => {
              if (followUser) {
                camera.current?.setCamera({
                  centerCoordinate: [e.coords.longitude, e.coords.latitude],
                  zoomLevel: 16,
                  animationDuration: 500,
                });
              }
            }}
          />
        </MapView>
      </View>
      <SafeAreaView className="mx-8">
        <TripNotification />
      </SafeAreaView>
      <View className="h-1/5 mb-12">
        <View
          className={`w-full h-12 
        flex flex-row justify-between
        items-center px-4`}
        >
          <TouchableOpacity
            onPress={() => {
              setFollowUser((prev) => !prev);

              camera.current?.setCamera({
                centerCoordinate: userLocation.current?.state.coordinates ?? [
                  0, 0,
                ],
                zoomLevel: 16,
                animationDuration: 500,
              });
            }}
            className={`mb-4 flex flex-col items-center justify-center 
            w-12 h-12 bg-white rounded-md
            ${followUser ? "shadow-md" : ""}`}
          >
            <MaterialCommunityIcons
              name="navigation-variant-outline"
              size={40}
              color={useTailwindColor("bg-bibip-green-500")}
            />
          </TouchableOpacity>
        </View>
        <TripInfo
          onEndTrip={onEndTrip}
          onLockCar={async () => {
            if (!data.carId) {
              userContext.updateToken();
              refetchCarId();
              return alert("Tekrar deneyin!");
            }

            lockCar(data.carId!);
            await new Promise((resolve) => setTimeout(resolve, 100));
            lockCar(data.carId!);
          }}
          onUnlockCar={async () => {
            if (!data.carId) {
              userContext.updateToken();
              refetchCarId();
              return alert("Tekrar deneyin!");
            }

            unlockCar(data.carId!);
          }}
        />
      </View>
    </View>
  );
});

export default Trip;
