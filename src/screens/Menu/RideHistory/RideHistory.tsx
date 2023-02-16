import { DrawerScreenProps } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useContext } from "react";
import { FlatList, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useQuery } from "react-query";
import { HomeStackParamList } from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import RideCard from "../../../components/views/RideCard/RideCard";
import UserContext from "../../../utils/context/UserContext";
import { getTripsOfUser } from "./RideHistory.action";

type NavigationProps = StackScreenProps<HomeStackParamList, "RideHistory">;

interface RideHistoryProps extends NavigationProps {}

const RideHistory: FunctionComponent<RideHistoryProps> = ({
  route,
  navigation,
}) => {
  const userContext = useContext(UserContext);

  const { isLoading: tripsLoading, data: trips } = useQuery({
    queryKey: "tripsOfUser",
    queryFn: () =>
      getTripsOfUser(userContext.user?.getUsername()!).then((val) => {
        return val;
      }),
  });

  return (
    <View>
      <Spinner visible={tripsLoading} />
      <View className="m-4">
        <FlatList
          data={trips}
          renderItem={(trip) => <RideCard trip={trip.item} />}
        />
      </View>
    </View>
  );
};

export default RideHistory;
