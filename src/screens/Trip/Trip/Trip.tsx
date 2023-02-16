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
import { TripStackParamList } from "../../../../Router";
import CustomMapView from "../../../components/views/Map/Map";
import TripInfo from "../../../components/views/TripInfo/TripInfo";
import TripNotification from "../../../components/views/TripNotification/TripNotification";
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { getCarId } from "./Trip.action";
import UserContext from "../../../utils/context/UserContext";
import Spinner from "react-native-loading-spinner-overlay/lib";

type NavigatorProps = StackScreenProps<TripStackParamList, "Trip">;

interface TripProps extends NavigatorProps {}

const Trip: FunctionComponent<TripProps> = memo(({ navigation }) => {
  let interval: NodeJS.Timer;

  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>(
    []
  );
  const [carId, setCarId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);

  const { data } = useQuery({
    queryKey: "carId",
    queryFn: () =>
      getCarId(userContext.user?.getUsername()!, userContext.token!).then(
        (val) => {
          setCarId(val.data.carId);
          return val.data;
        }
      ),
    enabled: !!userContext.token,
  });

  useEffect(() => {
    console.log(carId);
  }, [carId]);

  const onEndTrip = async () => {
    navigation.navigate("TripEnd", {
      carId: carId,
      waypoints: waypoints,
    });
  };

  const onPauseTrip = () => {
    console.log("pause");
  };

  useEffect(() => {
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
      <CustomMapView />
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
