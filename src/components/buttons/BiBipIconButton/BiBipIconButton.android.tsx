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
import { buttonStyles } from "./common";

interface BiBipButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyles> {}

const BiBipIconButton: FunctionComponent<BiBipButtonProps> = ({
  children,
  intent,
  buttonSize,
  style,
  ...props
}) => {
  return (
    <View className="rounded-full overflow-hidden">
      <Pressable
        style={[
          useTailwind({
            className: buttonStyles({ intent, buttonSize }),
          }) as StyleProp<ViewStyle>,
          {
            shadowColor: "#000",
          },
        ]}
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
