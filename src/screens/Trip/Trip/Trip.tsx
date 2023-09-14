import { StackScreenProps } from "@react-navigation/stack";
import {
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiBipTripStackParamList } from "../../../../Router";
import CarMap from "../../../components/views/Map/CarMap/CarMap";
import TripInfo from "../../../components/views/TripInfo/TripInfo";
import TripNotification from "../../../components/views/TripNotification/TripNotification";
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { getCarId } from "./Trip.action";
import UserContext from "../../../utils/context/UserContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import MarkerIcon from "../../../../assets/marker-icon.svg";
import { Camera, MapView, UserLocation } from "@rnmapbox/maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";

type NavigatorProps = StackScreenProps<BiBipTripStackParamList, "Trip">;

interface TripProps extends NavigatorProps {}

const Trip: FunctionComponent<TripProps> = memo(({ navigation }) => {
  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);

  const [status, requestPermission] = Location.useForegroundPermissions();

  const camera = useRef<Camera>(null);
  const userLocation = useRef<UserLocation>(null);

  const {
    data,
    isLoading: isCarLoading,
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

  const onPauseTrip = () => {};

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

  return (
    <View className="w-full h-full flex-col flex justify-between">
      <Spinner visible={isLoading} />
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
          <UserLocation visible ref={userLocation} />
        </MapView>
      </View>
      <SafeAreaView className="mx-8">
        <TripNotification />
      </SafeAreaView>
      <View className="h-1/4 mb-12">
        <View className="w-full h-12 flex flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={() => {
              camera.current?.setCamera({
                centerCoordinate: userLocation.current?.state.coordinates ?? [
                  0, 0,
                ],
                zoomLevel: 16,
                animationDuration: 500,
              });
            }}
            className="mb-4 flex flex-col items-center justify-center w-12 h-12 bg-white rounded-md"
          >
            <MaterialCommunityIcons
              name="navigation-variant-outline"
              size={40}
              color={useTailwindColor("bg-bibip-green-500")}
            />
          </TouchableOpacity>
        </View>
        <TripInfo onEndTrip={onEndTrip} onPauseTrip={onPauseTrip} />
      </View>
    </View>
  );
});

export default Trip;
