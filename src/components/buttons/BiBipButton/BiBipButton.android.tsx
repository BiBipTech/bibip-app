import { VariantProps } from "class-variance-authority";
import { styled, useTailwind } from "nativewind";
import { FunctionComponent } from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { buttonStyles, textStyles } from "./common";

interface BiBipButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyles> {
  title: string;
}

const BiBipButton: FunctionComponent<BiBipButtonProps> = ({
  title,
  children,
  intent,
  fullWidth,
  isDisabled,
  style,
  ...props
}) => {
  return (
    <Pressable
      style={[
        useTailwind({
          className: buttonStyles({ intent, fullWidth, isDisabled }),
        }) as StyleProp<ViewStyle>,
        {
          shadowColor: "#000",
        },
      ]}
      {...props}
      android_ripple={{
        color: "white",
      }}
      disabled={isDisabled}
    >
      <Text
        style={
          useTailwind({
            className: textStyles({ intent, isDisabled }),
          }) as StyleProp<TextStyle>
        }
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default styled(BiBipButton, {
  props: {},
});
