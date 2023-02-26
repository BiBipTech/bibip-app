import { View, Platform, DevSettings } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { HomeStackParamList, RootDrawerParamList } from "../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery, useQueryClient } from "react-query";
import gql from "../../utils/gql/gql";
import { ListCarsResult } from "./Home.type";
import * as queries from "../../graphql/queries";
import CustomMapView from "../../components/views/Map/Map";
import { LatLng } from "react-native-maps";
import UserContext from "../../utils/context/UserContext";
import { fetchDocumentStatuses } from "../Menu/Profile/Profile.action";
import { warn } from "../../utils/api/alert";
import { startTrip } from "../QRModal/QRModal.action";
import { promiseWithLoader } from "../../utils/aws/api";

type NavigatorProps = DrawerScreenProps<HomeStackParamList, "Map">;

interface HomeProps extends NavigatorProps {}

const Home: FC<HomeProps> = ({ route, navigation }) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState({
    id: "",
    photo: "",
    license: "",
  });

  const userContext = useContext(UserContext);

  const queryClient = useQueryClient();

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
    retry: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isCarsLoading) setIsLoading(true);
    else setIsLoading(false);
  }, [isCarsLoading]);

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isLoading} />
        <CustomMapView
          onLocationSet={(loc) => {
            setLocation(loc);
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
        <View className="absolute bottom-10 right-8">
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
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default Home;
