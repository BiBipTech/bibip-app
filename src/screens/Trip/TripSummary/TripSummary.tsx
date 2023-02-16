import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { TripStackParamList } from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import LabelValue from "../../../components/views/LabelValue/LabelValue";
import { exitTripStack, getTrip, updateRating } from "./TripSummary.action";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import Rating from "../../../components/inputs/Rating/Rating";
import UserContext from "../../../utils/context/UserContext";
import { getTripStatus, promiseWithLoader } from "../../../utils/aws/api";

type NavigationProps = StackScreenProps<TripStackParamList, "TripSummary">;

interface TripSummaryProps extends NavigationProps {}

const TripSummary: FunctionComponent<TripSummaryProps> = ({ route }) => {
  const userContext = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { isLoading: tripLoading, data } = useQuery({
    queryKey: "trip",
    queryFn: () =>
      getTrip(route.params.tripId).then((trip) => trip.data?.getTrip),
    enabled: !!route.params.tripId,
  });

  useEffect(() => {
    if (data) {
      setStartDate(new Date(data.time?.start!));
      setEndDate(new Date(data.time?.end!));
    }
  }, [data]);

  return (
    <SafeAreaView className="h-full">
      <Spinner visible={tripLoading || isLoading} />
      <View className="justify-start items-center px-8 w-full">
        <Text className="text-3xl font-bold mb-4">Sürüşün nasıldı?</Text>
        <Rating rating={rating} setRating={setRating} />
        <LabelValue
          label="Başlama Zamanı"
          value={startDate.toLocaleDateString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        />
        <LabelValue
          label="Bitis Zamanı"
          value={endDate.toLocaleDateString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        />
        <LabelValue
          label="Sure (dk.)"
          value={Math.floor(
            (data?.time?.end! - data?.time?.start!) / 60000
          ).toString()}
        />
      </View>
      <View className="border-b-gray-100 border w-full mt-4" />
      <View className="justify-start items-center px-8 w-full">
        <LabelValue
          label="Ucret (TL)"
          value={`${data?.fee?.toFixed(2).toString()}₺`}
        />
        <LabelValue
          label="Cuzdan"
          value={`${data?.paidViaWallet?.toFixed(2).toString()}₺` ?? "0.00₺"}
        />
        <LabelValue
          label="Kredi Karti"
          value={
            `${data?.paidViaCreditCard?.toFixed(2).toString()}₺` ?? "0.00₺"
          }
        />
      </View>
      <View className="flex flex-grow justify-end items-end">
        <View className="flex flex-row w-full justify-evenly items-end">
          <BiBipButton
            title="ATLA"
            buttonCount={2}
            intent="secondary"
            onPress={async () => {
              await exitTripStack(setIsLoading, userContext);
            }}
          />
          <BiBipButton
            title="ONAYLA"
            buttonCount={2}
            onPress={async () => {
              await promiseWithLoader(
                setIsLoading,
                updateRating(
                  route.params.tripId,
                  rating,
                  Number.parseInt(data?._version!)
                )
              );
              await exitTripStack(setIsLoading, userContext);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TripSummary;
