import { VariantProps } from "class-variance-authority";
import { styled, useTailwind } from "nativewind";
import { FunctionComponent } from "react";
import {
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { buttonStyles, textStyles } from "./common";

interface BiBipButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyles> {
  title: string;
  containerStyle?: TouchableOpacityProps["style"];
  textStyle?: TextProps["style"];
}

const BiBipButton: FunctionComponent<BiBipButtonProps> = ({
  title,
  children,
  intent,
  fullWidth,
  disabled,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={
        useTailwind({
          className: buttonStyles({ intent, fullWidth, disabled }),
        }) as StyleProp<ViewStyle>
      }
      disabled={disabled}
      {...props}
    >
      <Text
        style={
          useTailwind({
            className: textStyles({ intent }),
          }) as StyleProp<TextStyle>
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default styled(BiBipButton, {
  props: {
    containerStyle: true,
    textStyle: true,
  },
});
