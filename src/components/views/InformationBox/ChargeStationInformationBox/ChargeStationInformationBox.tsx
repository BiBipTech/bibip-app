import { FunctionComponent, ReactNode } from "react";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NavigationButton from "../../../buttons/NavigationButton/NavigationButton";
import StarRating from "react-native-star-rating-widget";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";

interface ChargeStationInformationBoxProps {}

const ChargeStationInformationBox: FunctionComponent<
  ChargeStationInformationBoxProps
> = () => {
  return (
    <View className="w-full bg-gray-900 rounded-2xl shadow-md h-64 pb-2 pt-2 px-4 flex flex-col justify-around">
      <View className="flex flex-row justify-between">
        <View className="flex flex-col justify-between items-start">
          <Text className="text-gray-100 text-start font-bold text-xl">
            99 Prospect Park W
          </Text>
          <Text className="text-gray-100 text-start">
            Brooklyn, 99 Prospect Park W
          </Text>
        </View>
        <NavigationButton />
      </View>
      <View className="flex flex-row justify-start items-baseline divide-x-4 divide-transparent">
        <Text className="text-gray-100 text-end">4.5</Text>
        <StarRating
          onChange={(rating) => console.log(rating)}
          rating={4.5}
          starSize={17}
          color="gold"
          onRatingStart={() => console.log()}
          starStyle={{ marginHorizontal: 1 }}
          StarIconComponent={({ type, size, color }) => {
            if (type === "empty")
              return <FontAwesome name="star-o" size={size} color={color} />;
            else if (type === "half")
              return (
                <FontAwesome name="star-half-o" size={size} color={color} />
              );

            return <FontAwesome name="star" size={size} color={color} />;
          }}
        />
        <Text className="text-gray-100 text-end">(107 reviews)</Text>
      </View>

      <View className="flex flex-row justify-start divide-x-4 divide-transparent">
        <View className="bg-bibip-red-400 p-2 rounded-lg">
          <Text className="text-gray-100">In Use</Text>
        </View>
        <IconWithLabel
          icon={<Ionicons size={24} name="location-sharp" color={"white"} />}
          label="1.9 km"
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons size={24} name="taxi" color={"white"} />
          }
          label="7 mins"
        />
      </View>

      <View className="border-y border-gray-500 py-4 flex-row flex justify-start">
        <Text className="text-gray-100">Chargers</Text>
      </View>
      <View className="flex flex-row w-full justify-between">
        <InformationBoxButton invert text="View" />
        <View className="w-2" />
        <InformationBoxButton text="Book" />
      </View>
    </View>
  );
};

interface IconWithLabelProps {
  icon: ReactNode;
  label: string;
}
const IconWithLabel: FunctionComponent<IconWithLabelProps> = ({
  icon,
  label,
}) => {
  return (
    <View className="ml-2 flex flex-row items-center">
      {icon}
      <Text className="ml-1 text-gray-100">{label}</Text>
    </View>
  );
};

export default ChargeStationInformationBox;
