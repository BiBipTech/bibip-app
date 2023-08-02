import { StackScreenProps } from "@react-navigation/stack";
import {
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
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

type NavigatorProps = StackScreenProps<BiBipTripStackParamList, "Trip">;

interface TripProps extends NavigatorProps {}

const Trip: FunctionComponent<TripProps> = memo(({ navigation }) => {
  let interval: NodeJS.Timer;

  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>(
    []
  );
  const [carId, setCarId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);

  const [status, requestPermission] = Location.useForegroundPermissions();

  const { data, isLoading: isCarLoading } = useQuery({
    queryKey: "carId",
    queryFn: () =>
      getCarId(userContext.user?.getUsername()!, userContext.token!)
        .then((val) => {
          setCarId(val.data.carId);

          return val.data;
        })
        .catch(() => {
          userContext.updateToken();

          return "";
        }),
    enabled: !!userContext.token,
  });

  const onEndTrip = async () => {
    while (isCarLoading) setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("TripEnd", {
        carId: carId,
        waypoints: waypoints,
      });
    }, 1000);
  };

  const onPauseTrip = () => {};

  useEffect(() => {
    if (status) {
      if (status.status !== "granted") {
        requestPermission();
      }
    }

    if (interval === undefined) {
      interval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync();

        waypoints.push({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }, 20000);
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View className="w-full h-full flex-col flex justify-between">
      <Spinner visible={isLoading} />
      {/* <CarMap /> */}
      <SafeAreaView className="mx-8">
        <TripNotification />
      </SafeAreaView>
      <View className="h-1/4">
        <TripInfo onEndTrip={onEndTrip} onPauseTrip={onPauseTrip} />
      </View>
    </View>
  );
});

export default Trip;
