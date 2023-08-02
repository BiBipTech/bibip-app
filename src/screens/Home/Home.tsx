import { Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  AppDrawerBiBipHomeStackCompositeProps,
  AppSignedInStackParamList,
} from "../../../Router";
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
import { findCarFromLocation } from "./Home.action";
import Landing from "../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import MarkerIcon from "../../../assets/marker-icon.svg";
import { Motion } from "@legendapp/motion";
import ChargeStationInformationBox from "../../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import BeefullInformationBox, {
  BeefullStation,
} from "../../components/views/InformationBox/BeefullInformationBox/BeefullInformationBox";

const Home: FC<AppDrawerBiBipHomeStackCompositeProps<"BiBipHome">> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);

  const [documents, setDocuments] = useState({
    id: "",
    photo: "",
    license: "",
  });
  const [value, setValue] = useState(0);

  const [carInfo, setCarInfo] = useState(0);
  const [beefullInfo, setBeefullInfo] = useState(0);

  const [selectedBeefullStation, setSelectedBeefullStation] =
    useState<BeefullStation | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const userContext = useContext(UserContext);

  const {
    isLoading: isCarsLoading,
    isFetching: isCarsFetching,
    error,
    data: cars,
  } = useQuery("getCars", () =>
    gql<ListCarsResult>({ query: queries.listCars }).then((res) => {
      return res.data?.listCars.items;
    })
  );

  const {} = useQuery({
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
  const windowHeight = Dimensions.get("window").height;

  const modalLowerBound = windowHeight * 0.96;
  const modalUpperBound = windowHeight * 0.6;

  const animated = useAnimatedStyle(() => {
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
          hideInfoBox={() => {
            setCarInfo(0);
            setBeefullInfo(0);
          }}
          handle={(i) => {}}
          navigate={navigation.navigate}
          modalPosition={modalPosition}
          bottomSheetRef={bottomSheetRef}
        />
        {cars ? (
          <CarMap
            setBeefullInfo={setBeefullInfo}
            setCarInfo={setCarInfo}
            onMapPress={() => {
              setValue(0);
              bottomSheetRef.current?.collapse();
              setBeefullInfo(0);
              setCarInfo(0);
            }}
            onMarkerSelect={() => {
              setValue(1);
              bottomSheetRef.current?.collapse();
            }}
            setLocation={setLocation}
            cars={cars}
            setSelectedBeefullStation={setSelectedBeefullStation}
          />
        ) : (
          <Spinner visible />
        )}
        <Motion.View
          className={"absolute top-10 w-full px-4"}
          animate={{
            y: beefullInfo === 1 ? 0 : -250,
            opacity: beefullInfo === 1 ? 1 : 0,
          }}
          transition={{
            duration: 250,
            speed: 1,
          }}
        >
          <BeefullInformationBox
            selectedBeefullStation={
              selectedBeefullStation ?? {
                name: "",
                address: "",
                distance: "0",
                duration: "0",
              }
            }
          />
        </Motion.View>
        <Motion.View
          className={`absolute left-7 top-16`}
          animate={{
            y: beefullInfo === 1 ? 250 : 0,
          }}
          transition={{
            duration: 250,
          }}
        >
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </Motion.View>
        {/* 
        <View className={`absolute right-12 top-16`}>
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              // @ts-ignore
              navigation.navigate("AppStack", { screen: "Test" });
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </View> */}

        <Animated.View className="absolute right-8 bottom-24" style={animated}>
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={async () => {
              // promiseWithLoader(
              //   setIsLoading,
              //   startTrip(
              //     "+905379440278",
              //     "4876ccd3-d404-4cfb-a1c9-c7d69fd23a11",
              //     {
              //       latitude: location?.latitude!,
              //       longitude: location?.longitude!,
              //     },
              //     userContext.token!
              //   ).then((val) => {
              //     userContext.setIsInTrip(true);
              //   })
              // );
              // if (
              //   documents.id === "" ||
              //   documents.license === "" ||
              //   documents.photo === ""
              // ) {
              //   warn(
              //     "Hay aksi!",
              //     "Bir şeyler yanlış gitti! Lütfen tekrar dene!",
              //     () => {},
              //     "Tamam"
              //   );
              //   return;
              // }
              // if (
              //   documents.id !== "true" ||
              //   documents.license !== "true" ||
              //   documents.photo !== "true"
              // ) {
              //   warn(
              //     "Eksik belgeler!",
              //     "Eksik veya onaylanmamış belgen var. Eğer hepsini yüklediysen daha sonra tekrar dene!",
              //     () => {},
              //     "Tamam"
              //   );
              //   return;
              // }
              // navigation.navigate("QRModal", {
              //   location: location!,
              // });
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
