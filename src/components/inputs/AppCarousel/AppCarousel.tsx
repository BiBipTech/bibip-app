import * as React from "react";
import type { ImageSourcePropType } from "react-native";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { Entypo } from "@expo/vector-icons";

import { BlurView as _BlurView } from "expo-blur";

import { parallaxLayout } from "./parallax";

import MarkerIcon from "../../../../assets/marker-icon.svg";
import BiBipIconButton from "../../buttons/BiBipIconButton/BiBipIconButton";

const BlurView = Animated.createAnimatedComponent(_BlurView);

const window = Dimensions.get("window");

const PAGE_WIDTH = 125;

function AppCarousel() {
  return (
    <Carousel
      loop={true}
      autoPlay={false}
      style={{
        width: 250,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
      }}
      width={PAGE_WIDTH}
      data={[1, 2, 3]}
      renderItem={({ item, index, animationValue }) => {
        return (
          <View className="items-center justify-center flex flex-1">
            <CustomItem
              key={index}
              source={item}
              animationValue={animationValue}
            />
          </View>
        );
      }}
      customAnimation={parallaxLayout(
        {
          size: PAGE_WIDTH,
          vertical: false,
        },
        {
          parallaxScrollingScale: 1,
          parallaxAdjacentItemScale: 0.45,
          parallaxScrollingOffset: 50,
        }
      )}
      scrollAnimationDuration={1200}
    />
  );
}

interface ItemProps {
  source: number;
  animationValue: Animated.SharedValue<number>;
}

const CustomItem: React.FC<ItemProps> = ({ source, animationValue }) => {
  const maskStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [1, 0, 1]);

    return {
      opacity,
    };
  }, [animationValue]);

  const getIcon = () => {
    switch (source) {
      case 1:
        return (
          <Entypo
            className="items-center justify-center"
            name="facebook-with-circle"
            size={32}
            color="white"
          />
        );
      case 2:
        return <Entypo name="twitter-with-circle" size={32} color="white" />;
      case 3:
        return <Entypo name="linkedin-with-circle" size={32} color="white" />;
      default:
        return <Entypo name="facebook-with-circle" size={32} color="white" />;
    }
  };
  return (
    <View className="overflow-hidden flex flex-1 rounded-md justify-start items-center">
      <BiBipIconButton buttonSize={"medium"}>{getIcon()}</BiBipIconButton>
    </View>
  );
};

export default AppCarousel;
