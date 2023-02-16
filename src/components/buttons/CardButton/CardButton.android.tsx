import { VariantProps } from "class-variance-authority";
import { styled, useTailwind } from "nativewind";
import { FunctionComponent } from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface BiBipButtonProps extends TouchableOpacityProps {}

const BiBipIconButton: FunctionComponent<BiBipButtonProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View className="rounded-full overflow-hidden">
      <Pressable
        {...props}
        android_ripple={{
          color: "white",
        }}
      >
        {children}
      </Pressable>
    </View>
  );
};

export default BiBipIconButton;
