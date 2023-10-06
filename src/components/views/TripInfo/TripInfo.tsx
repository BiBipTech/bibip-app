import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BiBipButton from "../../buttons/BiBipButton/BiBipButton";
import UserContext from "../../../utils/context/UserContext";
import { getStartTime } from "./TripInfo.action";
import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";

interface TripInfoProps {
  onEndTrip: () => void;
  onLockCar: () => void;
  onUnlockCar: () => void;
}

const TripInfo: FunctionComponent<TripInfoProps> = ({
  onEndTrip,
  onLockCar,
  onUnlockCar,
}) => {
  const userContext = useContext(UserContext);

  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("0.0₺");

  const { isLoading, data } = useQuery({
    queryKey: "startTime",
    queryFn: () =>
      getStartTime(userContext.user?.getUsername()!, userContext.token!).then(
        (val) => val.data.startTime
      ),
    onError: (err) => console.log(JSON.stringify(err)),
    onSuccess: (val) => console.log(val),
    enabled: !!userContext.token,
  });

  const updateDuration = (startTime: number) => {
    const currentTime = +new Date();

    const durationInSec = (currentTime - startTime) / 1000;

    const min = Math.floor(durationInSec / 60);
    const sec = Math.floor(durationInSec % 60);

    const formattedMin = min.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const formattedSec = sec.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    setDuration(`${formattedMin}:${formattedSec}`);
    setPrice(`${(min * 2.99).toFixed(2)}₺`);
  };

  useEffect(() => {
    if (data) {
      updateDuration(data);
      setInterval(() => updateDuration(data), 1000);
    }
  }, [data]);

  return (
    <View className="h-full bg-white rounded-t-3xl shadow-lg flex flex-col">
      <View className="flex flex-row p-4 pb-2">
        <Ionicons name="car-outline" size={64} />
        <View className="flex flex-col ml-2">
          <Text className="mb-2 font-bold text-lg text-gray-800">
            BiBip E-Araba
          </Text>
          <View className="flex flex-row">
            {isLoading ? (
              <ActivityIndicator color={"#23a65e"} className="ml-1" />
            ) : (
              <Text className="text-bibip-green-600 font-bold">
                {" "}
                {duration}
              </Text>
            )}
            <Text className="text-gray-900 text-center"> • </Text>
            {isLoading ? (
              <ActivityIndicator color={"#23a65e"} className="ml-1" />
            ) : (
              <Text className="text-bibip-green-600 font-regular">
                {" "}
                {price}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View className="w-full border-b border-b-gray-300" />
      <View className="flex flex-1 mb-4">
        <View
          className="flex flex-row flex-1 mx-6 my-2"
          style={{ columnGap: 8 }}
        >
          <TouchableOpacity
            className="border aspect-square h-full flex items-center justify-center rounded-xl border-bibip-green-500"
            onPress={onLockCar}
          >
            <View className="">
              <Ionicons name="lock-closed" color={"#23a65e"} size={24} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="border h-full flex items-center justify-center bg-bibip-green-500 flex-grow rounded-xl border-bibip-green-500"
            onPress={onEndTrip}
          >
            <Text className="text-white font-regular text-2xl">SONLANDIR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border aspect-square h-full flex items-center justify-center rounded-xl border-bibip-green-500"
            onPress={onUnlockCar}
          >
            <View className="">
              <Ionicons name="lock-open" color={"#23a65e"} size={24} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TripInfo;
