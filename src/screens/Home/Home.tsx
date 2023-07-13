import { Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useState } from "react";
import BiBipIconButton from "../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  AppDrawerBiBipHomeStackCompositeProps,
  BiBipHomeStackParamList,
} from "../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import gql from "../../utils/gql/gql";
import { ListCarsResult } from "./Home.type";
import * as queries from "../../graphql/queries";
import CustomMapView from "../../components/views/Map/Map";
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

const Home: FC<AppDrawerBiBipHomeStackCompositeProps<"BiBipHome">> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState({
    id: "",
    photo: "",
    license: "",
  });
  const [value, setValue] = useState(0);

  const userContext = useContext(UserContext);

  const {
    isLoading: isCarsLoading,
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
              navigation.navigate("Profile");
            },
            "Profil'e git"
          );
        }
      }),
    enabled: !!userContext.user,
  });

  useEffect(() => {
    if (isCarsLoading) setIsLoading(true);
    else setIsLoading(false);
  }, [isCarsLoading]);

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

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isLoading} />
        <Landing
          handle={(i) => {}}
          navigate={navigation.navigate}
          modalPosition={modalPosition}
        />
        <CustomMapView
          onLocationSet={(loc) => {
            setLocation(loc);
          }}
          onPress={() => setValue(0)}
          onMarkerPress={({ nativeEvent: { coordinate } }) => {
            setValue(1);
            console.log(findCarFromLocation(cars, coordinate as LatLng));
          }}
          markers={cars}
        />
        <View className={`absolute left-12 top-16`}>
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </View>

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
              setValue(1);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setValue(0);
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
