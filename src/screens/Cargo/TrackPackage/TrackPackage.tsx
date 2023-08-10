import React, { FunctionComponent, useRef } from "react";
import { Keyboard, ScrollView, Text, TextInput, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";

interface TrackPackageProps {}

const TrackPackage: FunctionComponent<TrackPackageProps> = () => {
  return (
    <ScrollView
      contentContainerStyle={{}}
      className="bg-white flex flex-col flex-grow px-4 pt-8"
      onScrollBeginDrag={() => {
        Keyboard.dismiss();
      }}
    >
      <PackageNumberSearch />
    </ScrollView>
  );
};

const PackageNumberSearch: FunctionComponent = (props) => {
  const packageNumber = useRef<TextInput>(null);

  return (
    <View className="flex flex-col px-4 pb-4 w-full bg-bibip-green-50 gap-y-3 rounded-xl shadow-sm">
      <Text className="text-xl font-bold text-gray-800">
        Track Your Package
      </Text>
      <Text className="text-base text-gray-800">
        Please enter your tracking number
      </Text>
      <View className="flex flex-row items-center">
        <View
          onTouchEnd={() => {
            packageNumber.current?.focus();
          }}
          className="shadow-sm bg-white h-full px-4 items-center rounded-md flex flex-row flex-1"
        >
          <Ionicons
            name="cube-outline"
            color={useTailwindColor("bg-gray-800")}
            size={28}
          />

          <TextInput
            ref={packageNumber}
            className="ml-2 flex-1"
            placeholder="Tracking Number"
            placeholderTextColor={useTailwindColor("bg-gray-400")}
          />
        </View>
        {/* <SharedElement id="test" className="ml-2"> */}
        <BiBipIconButton
          className="bg-green-500 ml-6 rounded-md p-4"
          buttonSize={"medium"}
          intent="inverted"
        >
          <Ionicons
            name="qr-code"
            color={useTailwindColor("bg-bibip-green-500")}
            size={32}
          />
        </BiBipIconButton>
        {/* </SharedElement> */}
      </View>
    </View>
  );
};

export default TrackPackage;
