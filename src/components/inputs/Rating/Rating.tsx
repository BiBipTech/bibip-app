import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import { View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface RatingProps {
  rating: number;
  setRating: Dispatch<SetStateAction<number>>;
}

const Rating: FunctionComponent<RatingProps> = ({ rating, setRating }) => {
  return (
    <View className="bg-transparent items-center justify-center w-full">
      <Pressable
        className="flex flex-row justify-evenly w-full"
        onTouchStart={(e) => {}}
      >
        <Pressable onPress={() => setRating(1)}>
          <FontAwesome
            name={rating >= 1 ? "star" : "star-o"}
            size={40}
            color={rating >= 1 ? "#ffb300" : "#aaa"}
          />
        </Pressable>
        <Pressable onPress={() => setRating(2)}>
          <FontAwesome
            name={rating >= 2 ? "star" : "star-o"}
            size={40}
            color={rating >= 2 ? "#ffb300" : "#aaa"}
          />
        </Pressable>
        <Pressable onPress={() => setRating(3)}>
          <FontAwesome
            name={rating >= 3 ? "star" : "star-o"}
            size={40}
            color={rating >= 3 ? "#ffb300" : "#aaa"}
          />
        </Pressable>
        <Pressable onPress={() => setRating(4)}>
          <FontAwesome
            name={rating >= 4 ? "star" : "star-o"}
            size={40}
            color={rating >= 4 ? "#ffb300" : "#aaa"}
          />
        </Pressable>
        <Pressable onPress={() => setRating(5)}>
          <FontAwesome
            name={rating >= 5 ? "star" : "star-o"}
            size={40}
            color={rating >= 5 ? "#ffb300" : "#aaa"}
          />
        </Pressable>
      </Pressable>
    </View>
  );
};

export default Rating;
