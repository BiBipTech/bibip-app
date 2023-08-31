import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { Car } from "../../../../models";
import NavigationButton from "../../../buttons/NavigationButton/NavigationButton";
import IconWithLabel from "../../../buttons/IconWithLabel";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";

interface BiBipCarInformationBoxProps {
  selectedCar: Car;
}

const BiBipCarInformationBox: FunctionComponent<
  BiBipCarInformationBoxProps
> = ({
  selectedCar: {
    id,
    name,
    Trips: trips,
    battery,
    createdAt,
    inUse,
    location,
    updatedAt,
  },
}) => {
  return (
    <View className="w-full bg-gray-900 rounded-2xl shadow-md h-64 pb-2 pt-2 px-4 flex flex-col justify-around">
      <View className="flex flex-row justify-between">
        <View className="flex flex-col flex-initial w-4/5 justify-between items-start">
          <Text className="text-gray-100 text-start font-bold text-lg">
            asdas
          </Text>
          <Text className="text-gray-100 text-start break-all">{inUse} </Text>
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
          label={`${battery?.toFixed(1)} km`}
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons size={16} name="taxi" color={"white"} />
          }
          label={`${battery?.toFixed(1)} dk.`}
        />
      </View>

      <View className="flex flex-row w-full justify-between">
        <InformationBoxButton invert text="Yol Tarifi" />
        <View className="w-2" />
        <InformationBoxButton text="QR Tara" />
      </View>
    </View>
  );
};

export default BiBipCarInformationBox;
