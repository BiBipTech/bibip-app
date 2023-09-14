import { Dimensions, Text, View } from "react-native";
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
import CarMap from "../../components/views/Map/CarMap/CarMap";
import { LatLng } from "react-native-maps";
import UserContext from "../../utils/context/UserContext";
import { fetchDocumentStatuses } from "../Menu/Profile/Profile.action";
import { warn } from "../../utils/api/alert";
import Landing from "../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import { promiseWithLoader } from "../../utils/aws/api";
import { startTrip } from "../QRModal/QRModal.action";
import { Car } from "../../models";
import BiBipCarInformationBox from "../../components/views/InformationBox/BiBipCarInformationBox/BiBipCarInformationBox";

const Home: FC<AppDrawerBiBipHomeStackCompositeProps<"BiBipHome">> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null | undefined>(null);

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
    gql<ListCarsResult>({ query: queries.listCars })
      .then((res) => {
        console.log(res);

        return res.data?.listCars.items;
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      })
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

  useEffect(() => {
    const timeOutId = setTimeout(
      () => bottomSheetRef.current?.snapToIndex(1),
      500
    );

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);

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
            translateY: withTiming(250),
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
      transform: [
        {
          translateX: (1 - value) * 200,
        },
      ],
      zIndex: -1,
    };
  }, [modalPosition]);

  const isSpinnerVisible = isLoading || isCarsLoading;

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isSpinnerVisible} />
        <Landing
          navigate={navigation.navigate}
          modalPosition={modalPosition}
          bottomSheetRef={bottomSheetRef}
        />
        {cars ? (
          <CarMap
            onMapPress={() => {
              bottomSheetRef.current?.snapToIndex(0);

              carInfoBoxShown.value = false;
            }}
            setLocation={setLocation}
            cars={cars}
            onCarSelect={(car: Car) => {
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
            className={"absolute top-12 w-full px-4"}
            style={informationBoxAnimation}
          >
            <BiBipCarInformationBox selectedCar={selectedCar} />
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
            onPress={async () => {
              if (
                documents.id === "" ||
                documents.license === "" ||
                documents.photo === ""
              ) {
                warn(
                  "Hay aksi!",
                  "Bir şeyler yanlış gitti! Lütfen tekrar dene!",
                  () => {},
                  "Tamam"
                );
                refetchDocuments();
                return;
              }
              if (
                documents.id !== "true" ||
                documents.license !== "true" ||
                documents.photo !== "true"
              ) {
                warn(
                  "Eksik belgeler!",
                  "Eksik veya onaylanmamış belgen var. Eğer hepsini yüklediysen daha sonra tekrar dene!",
                  () => {},
                  "Tamam"
                );
                return;
              }
              navigation.navigate("QRModal", {
                location: location!,
              });
            }}
          >
            <Ionicons name="qr-code-outline" color="white" size={48} />
          </BiBipIconButton>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
};

export default Home;
