import { FunctionComponent, ReactNode, useContext, useEffect } from "react";
import { Text, View } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NavigationButton from "../../../buttons/NavigationButton/NavigationButton";
import StarRating from "react-native-star-rating-widget";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";
import IconWithLabel from "../../../buttons/IconWithLabel";
import { useQuery } from "react-query";
import { awsGet, awsPost } from "../../../../utils/aws/api";
import UserContext from "../../../../utils/context/UserContext";

export type ChargeStation = {
  name: string;
  distance: string;
  duration: string;
  latitude: number;
  longitude: number;
  address: string;
  id: number;
  commentCount?: number;
  averageRating?: number;
} | null;

interface ChargeStationInformationBoxProps {
  selectedStation: ChargeStation;
  onComment: () => void;
  onSeeCommentList: () => void;
}

const ChargeStationInformationBox: FunctionComponent<
  ChargeStationInformationBoxProps
> = ({ selectedStation, onComment, onSeeCommentList }) => {
  return (
    <View className="w-full bg-gray-900 rounded-2xl shadow-md h-64 pb-2 pt-2 px-4 flex flex-col justify-around">
      <View className="flex flex-row justify-between">
        <View className="flex flex-col flex-initial w-4/5 justify-between items-start">
          <Text className="text-gray-100 text-start font-bold text-lg">
            {selectedStation?.name}
          </Text>
          <Text className="text-gray-100 text-start break-all">
            {selectedStation?.address}
          </Text>
        </View>
        <NavigationButton />
      </View>
      <View
        className="flex flex-row justify-start items-baseline divide-x-4 divide-transparent"
        onTouchEnd={() => {
          console.log("touched");

          onSeeCommentList();
        }}
      >
        <Text className="text-gray-100 text-end">
          {selectedStation?.averageRating?.toFixed(1) ?? 5.0}
        </Text>
        <StarRating
          onChange={(rating) => console.log(rating)}
          rating={selectedStation?.averageRating ?? 5}
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
        <Text className="text-gray-100 text-end">
          ({selectedStation?.commentCount ?? "..."} reviews)
        </Text>
      </View>

      <View className="flex flex-row justify-start divide-x-4 divide-transparent">
        <View className="bg-bibip-red-400 px-2 py-1 rounded-md">
          <Text className="text-gray-100 text-xs">In Use</Text>
        </View>
        <IconWithLabel
          icon={<Ionicons size={16} name="location-sharp" color={"white"} />}
          label={`${selectedStation?.distance} km`}
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons size={16} name="taxi" color={"white"} />
          }
          label={`${selectedStation?.duration} dk.`}
        />
      </View>

      <View className="border-y border-gray-500 py-4 flex-row flex justify-start">
        <Text className="text-gray-100">Chargers</Text>
      </View>
      <View className="flex flex-row w-full justify-between">
        <InformationBoxButton invert text="View" />
        <View className="w-2" />
        <InformationBoxButton
          text="Puanla"
          onPress={() => {
            onComment();
          }}
        />
      </View>
    </View>
  );
};

export default ChargeStationInformationBox;
