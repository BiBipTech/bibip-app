import React, { FunctionComponent } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VariantProps } from "class-variance-authority";
import { buttonStyles, iconNames } from "./styles";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";

interface DocumentButtonProps
  extends VariantProps<typeof buttonStyles>,
    TouchableOpacityProps {
  title: string;
}

const DocumentButton: FunctionComponent<DocumentButtonProps> = ({
  intent,
  title,
  ...props
}) => {
  const isDisabled = intent !== "notConfirmed" ? true : false;
  // const isDisabled = false;
  return (
    <TouchableOpacity
      {...props}
      style={useCustomTailwind(buttonStyles({ intent, isDisabled }))}
      disabled={isDisabled}
    >
      <View className="flex flex-row justify-center items-baseline w-1/2">
        <Ionicons name={iconNames(intent)} size={20} color="white" />
        <Text className="text-gray-100 text-center text-xl ml-2">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentButton;
