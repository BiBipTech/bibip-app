import { FunctionComponent, useMemo, useRef, useState } from "react";
import { ColorValue } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  convertToRGBA,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import tinycolor from "tinycolor2";

interface TabViewProps<T> {
  data: {
    key: string;
    label: string;
    value: T;
  }[];
  renderItem: (item: T, index: number) => JSX.Element;
  indicatorColor?: string;
}

const TabView = <T,>({ data, renderItem, indicatorColor }: TabViewProps<T>) => {
  const offset = useSharedValue(0);
  const page = useSharedValue(0);
  const sign = useSharedValue(1);
  const signSet = useSharedValue(false);

  const pager = useRef<PagerView>(null);

  const backgroundIndicatorColor = tinycolor(indicatorColor).setAlpha(0.5);

  return (
    <View className="h-full w-full flex-1 flex flex-col justify-start">
      <View
        className="w-full h-12 flex flex-row px-4"
        style={{
          zIndex: 1000,
        }}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            className="w-1/2 h-full items-center justify-center"
            onPress={() => pager.current?.setPage(index)}
          >
            <Text className="text-white text-xl">{item.label}</Text>
          </TouchableOpacity>
        ))}
        <View
          className="ml-4 top-12 w-full border-b-2 border-b-gray-400 absolute"
          style={{
            borderBottomColor: backgroundIndicatorColor.toHslString(),
          }}
        />
        <Animated.View
          className="ml-4 top-12 w-[50%] border-b-2 absolute"
          style={[
            useAnimatedStyle(() => {
              var left;

              if (sign.value === 1) {
                left =
                  page.value * (100 / data.length) +
                  interpolate(offset.value, [0, 1], [0, 100 / data.length]);
              } else {
                left =
                  page.value * (100 / data.length) -
                  interpolate(offset.value, [0, 1], [100 / data.length, 0]);
              }

              return {
                left: `${left}%`,
              };
            }, []),
            {
              borderBottomColor: indicatorColor ?? "gray",
            },
          ]}
        />
      </View>
      <PagerView
        className="h-full w-full flex-1"
        ref={pager}
        initialPage={0}
        onPageScroll={(e) => {
          offset.value = e.nativeEvent.offset;
          if (e.nativeEvent.offset === 0) {
            signSet.value = false;
            if (sign.value === 1) offset.value = 0;
            else offset.value = 1;
          }

          if (!signSet.value) {
            sign.value = e.nativeEvent.offset > 0.5 ? -1 : 1;
            signSet.value = true;
          }
        }}
        onPageScrollStateChanged={(e) => {
          if (e.nativeEvent.pageScrollState === "idle") {
            signSet.value = false;
            if (sign.value === 1) offset.value = 0;
            else offset.value = 1;
          }
        }}
        onPageSelected={(e) => {
          page.value = e.nativeEvent.position;
        }}
      >
        {data.map((item, index) => renderItem(item.value, index))}
      </PagerView>
    </View>
  );
};

export default TabView;
