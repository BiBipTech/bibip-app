import { Alert, Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDrawerBiBipHomeStackCompositeProps } from "../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import gql from "../../utils/gql/gql";
import { ListCarsResult } from "./Home.type";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import CarMap from "../../components/views/Map/CarMap/CarMap";
import { LatLng } from "react-native-maps";
import UserContext from "../../utils/context/UserContext";
import { fetchDocumentStatuses } from "../Menu/Profile/Profile.action";
import { warn } from "../../utils/api/alert";
// import Landing from "../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import { Car } from "../../models";
import BiBipCarInformationBox from "../../components/views/InformationBox/BiBipCarInformationBox/BiBipCarInformationBox";
import { checkDocuments } from "./Home.action";
import { awsGet, awsPost } from "../../utils/aws/api";
import { TRIP_API } from "@env";

const Home: FC<AppDrawerBiBipHomeStackCompositeProps<"BiBipHome">> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<
    (Car & { _version: number }) | null | undefined
  >(null);

  const [documents, setDocuments] = useState({
    id: "",
    photo: "",
    license: "",
  });
  const bottomSheetRef = useRef<BottomSheet>(null);

  const userContext = useContext(UserContext);

  const {
    isLoading: isCarsLoading,
    isFetching: isCarsFetching,
    error,
    data: cars,
  } = useQuery("getCars", () =>
    gql<ListCarsResult>({
      query: queries.listCars,
      variables: {
        filter: {
          inUse: {
            eq: false,
          },
        },
      },
    })
      .then((res) => {
        return res.data?.listCars.items;
      })
      .catch((e) => {})
  );

  const { refetch: refetchDocuments } = useQuery({
    queryKey: "documents",
    queryFn: () =>
      fetchDocumentStatuses(userContext.user!).then((val) => {
        setDocuments(val);

        if (
          val.id === "false" ||
          val.license === "false" ||
          val.photo === "false"
        ) {
          warn(
            "Eksik belgeler!",
            "Yüklemediğin belgeler var, lütfen sürüşe başlayabilmek için profil ekranından bu belgeleri ekle!",
            () => {
              // @ts-ignore
              navigation.navigate("AppStack", { screen: "Profile" });
            },
            "Profil'e git"
          );
        }
      }),
    enabled: !!userContext.user,
  });

  const { refetch: refetchReservationStatus, data: reservedCarData } = useQuery(
    {
      queryKey: "didReserveCar",
      queryFn: async () => {
        const result = await awsGet(
          `${TRIP_API}/reservation-status/${userContext.user?.getUsername()}`,
          userContext.token!
        );
        const data = result.data as {
          carId: string | null;
          reservedCar: boolean;
          tripStarted: number | undefined;
        };
        return data;
      },
      enabled: !!userContext.token,
    }
  );

  const { refetch: startReservation, data: isReservationStarted } = useQuery({
    queryKey: "startReservation",
    queryFn: async () => {
      const res = await awsPost(
        `${TRIP_API}/startReservation`,
        {
          username: userContext.user?.getUsername()!,
          carId: selectedCar?.id!,
        },
        userContext.token!
      );
      setSelectedCar(null);

      return res.data as string;
    },
    onError: (err) => {},
    enabled: false,
  });

  useEffect(() => {
    if (!reservedCarData) return;

    if (reservedCarData.reservedCar === true) {
      const timeout = setTimeout(() => {
        navigation.navigate("Reserve", {
          carId: reservedCarData.carId!,
          tripStarted: reservedCarData.tripStarted!,
        });
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [reservedCarData]);

  useEffect(() => {
    const timeOutId = setTimeout(
      () => bottomSheetRef.current?.snapToIndex(1),
      500
    );

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);

  useEffect(() => {
    const reservationStatus = async () => {
      if (isReservationStarted === "Reserved!") {
        const res = await refetchReservationStatus();

        if (res.data?.reservedCar === true) {
          navigation.navigate("Reserve", {
            carId: res.data.carId!,
            tripStarted: res.data.tripStarted!,
          });
        }
      }
    };

    reservationStatus();
  }, [isReservationStarted]);

  const modalPosition = useSharedValue(0);
  const carInfoBoxShown = useSharedValue(false);

  const windowHeight = Dimensions.get("window").height;

  const modalLowerBound = windowHeight * 0.96;
  const modalUpperBound = windowHeight * 0.6;

  const informationBoxAnimation = useAnimatedStyle(() => {
    if (carInfoBoxShown.value)
      return {
        transform: [
          {
            translateY: withTiming(0),
          },
        ],
      };
    else
      return {
        transform: [
          {
            translateY: withTiming(-400),
          },
        ],
      };
  }, [carInfoBoxShown]);

  const drawerButtonAnimation = useAnimatedStyle(() => {
    if (carInfoBoxShown.value)
      return {
        transform: [
          {
            translateY: withTiming(200),
          },
        ],
      };

    return {
      transform: [
        {
          translateY: withTiming(0),
        },
      ],
    };
  }, [carInfoBoxShown]);

  const qrButtonAnimation = useAnimatedStyle(() => {
    const value =
      (modalPosition.value - modalUpperBound) /
      (modalLowerBound - modalUpperBound);

    return {
      // transform: [
      //   {
      //     translateX: (1 - value) * 200,
      //   },
      // ],
      zIndex: -1,
    };
  }, [modalPosition]);

  const isSpinnerVisible = isLoading || isCarsLoading;

  const onScanQr = () => {
    const documentsValid = checkDocuments(documents, refetchDocuments);
    if (!documentsValid) return;
    navigation.navigate("QRModal", {
      location: location!,
    });
  };

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isSpinnerVisible} />
        {/* <Landing
          navigate={navigation.navigate}
          hideInfoBox={() => {
            setSelectedCar(null);
            carInfoBoxShown.value = false;
          }}
          modalPosition={modalPosition}
          bottomSheetRef={bottomSheetRef}
        /> */}
        {cars ? (
          <CarMap
            onMapPress={() => {
              bottomSheetRef.current?.snapToIndex(0);

              carInfoBoxShown.value = false;
              setSelectedCar(null);
            }}
            setLocation={setLocation}
            cars={cars}
            onCarSelect={(car: Car & { _version: number }) => {
              setSelectedCar(car);
              carInfoBoxShown.value = true;
              bottomSheetRef.current?.snapToIndex(0);
            }}
          />
        ) : (
          <Spinner visible />
        )}
        {selectedCar && (
          <Animated.View
            className={"absolute top-14 w-full px-4"}
            style={informationBoxAnimation}
          >
            <BiBipCarInformationBox
              selectedCar={selectedCar}
              onScanQr={onScanQr}
              onReserve={async () => {
                Alert.alert(
                  "Rezervasyon",
                  `Rezervasyon yapmak istediğinize emin misiniz?\n\nFiyat: 0.99₺/dk`,
                  [
                    {
                      text: "İptal",
                      style: "destructive",
                      onPress: () => console.log("Cancel Pressed"),
                    },
                    {
                      text: "Evet",
                      style: "default",
                      onPress: async () => {
                        startReservation();
                        // refetchReservationStatus();
                      },
                    },
                  ]
                );
              }}
              currentLocation={location}
            />
          </Animated.View>
        )}
        <Animated.View
          className={`absolute left-7 top-16`}
          style={drawerButtonAnimation}
        >
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </Animated.View>
        <View className={`absolute right-7 top-16`}>
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              // @ts-ignore
              navigation.navigate("Test");
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </View>
        <Animated.View
          className="absolute right-8 bottom-24"
          style={qrButtonAnimation}
        >
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={onScanQr}
          >
            <Ionicons name="qr-code-outline" color="white" size={48} />
          </BiBipIconButton>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
};

export default Home;
