import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";
import IconWithLabel from "../../../buttons/IconWithLabel";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import NavigationButton from "../../../buttons/NavigationButton/NavigationButton";
import StarRating from "react-native-star-rating-widget";

export interface BeefullStation {
  name: string;
  address: string;
  distance: string;
  duration: string;
}

interface BeefullInformationBoxProps {
  selectedBeefullStation: BeefullStation;
}

const BeefullInformationBox: FunctionComponent<BeefullInformationBoxProps> = ({
  selectedBeefullStation: { name, address, distance, duration },
}) => {
  return (
    <View className="w-full bg-gray-900 rounded-2xl shadow-md h-64 pb-2 pt-2 px-4 flex flex-col justify-around">
      <View className="flex flex-row justify-between">
        <View className="flex flex-col flex-initial w-4/5 justify-between items-start">
          <Text className="text-gray-100 text-start font-bold text-lg">
            {name}
          </Text>
          <Text className="text-gray-100 text-start break-all">{address} </Text>
        </View>
        <NavigationButton />
      </View>
      <View className="flex flex-row justify-start items-baseline divide-x-4 divide-transparent">
        <Text className="text-gray-100 text-xs">
          0-30 dk: 10 TL, her 1 saat: +10 TL, günlük: 80 TL
        </Text>
      </View>

      <View className="flex flex-row justify-start divide-x-4 divide-transparent">
        <View className="bg-bibip-red-400 px-2 py-1 rounded-md">
          <Text className="text-gray-100 text-xs">In Use</Text>
        </View>
        <IconWithLabel
          icon={<Ionicons size={16} name="location-sharp" color={"white"} />}
          label={`${distance} km`}
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons size={16} name="taxi" color={"white"} />
          }
          label={`${duration} dk.`}
        />
      </View>

      <View className="border-y border-gray-500 py-4 flex-row flex justify-start">
        <BeefullStationAvailableSlots />
      </View>
      <View className="flex flex-row w-full justify-between">
        <InformationBoxButton invert text="Yol Tarifi" />
        <View className="w-2" />
        <InformationBoxButton text="QR Tara" />
      </View>
    </View>
  );
};

export default BeefullInformationBox;

const BeefullStationAvailableSlots: FunctionComponent = () => {
  const totalSlots = [1, 2, 3, 4, 5];
  const availableSlots = 2;

  return (
    <View className="flex flex-row justify-between items-center w-full">
      {totalSlots.map((_, i) => {
        if (i > availableSlots - 1)
          return (
            <View
              key={_}
              className="h-2 rounded-full flex-grow w-max mx-1 bg-white"
            ></View>
          );
        return (
          <View
            key={_}
            className="h-2 rounded-full flex-grow w-max mx-1 bg-orange-500"
          ></View>
        );
      })}
    </View>
  );
};
