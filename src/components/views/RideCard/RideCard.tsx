import { TRIP_API } from "@env";
import { FunctionComponent, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Trip } from "../../../models";
import { formatDate, getTripPhoto } from "./RideCard.action";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import CardButton from "../../buttons/CardButton/CardButton";
interface RideCardProps {
  trip: Trip;
}

const RideCard: FunctionComponent<RideCardProps> = ({ trip }) => {
  const [base, setBase] = useState("");

  useEffect(() => {
    getTripPhoto(trip.id).then((val) => {
      setBase(val.data);
    });
  }, []);

  return (
    <CardButton>
      <View className="w-full h-60 bg-white rounded-2xl mb-4 shadow-sm">
        <Image
          className="w-full h-4/6"
          source={{ uri: `data:image/jpeg;base64,${base}` }}
        />
        <View className="py-5 px-6 w-full h-2/6 flex flex-row">
          <View className="w-4/6 h-full flex flex-col">
            <View className="flex flex-row">
              <Text className="font-bold text-gray-600">
                {formatDate(trip.createdAt!).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
              <Text className="text-gray-500">
                {" "}
                {formatDate(trip.createdAt!).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View className="flex flex-row">
              <View className="flex flex-row mt-2 items-center">
                <Feather name="clock" />
                <Text className="text-gray-500 font-light">
                  {" "}
                  {Math.ceil(trip.duration! / 60000)} Dk
                </Text>
              </View>
            </View>
          </View>
          <View className="w-2/6 h-full items-center justify-center flex flex-col">
            <Text className="text-bibip-green-500">
              {trip.fee?.toFixed(2)}₺
            </Text>
          </View>
        </View>
      </View>
    </CardButton>
  );
};

export default RideCard;
