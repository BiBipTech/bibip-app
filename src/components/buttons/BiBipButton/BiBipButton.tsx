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
    VariantProps<typeof buttonStyles>,
    VariantProps<typeof textStyles> {
  title: string;
}

const BiBipButton: FunctionComponent<BiBipButtonProps> = ({
  title,
  children,
  intent,
  fullWidth,
  fullHeight,
  alignment,
  buttonCount,
  rounding,
  isDisabled,
  fontSize,
  fontWeight,
  mini,
  style,
  className,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        useTailwind({
          className: buttonStyles({
            intent,
            fullWidth,
            fullHeight,
            alignment,
            buttonCount,
            rounding,
            isDisabled,
            mini,
          }),
        }) as StyleProp<ViewStyle>,
      ]}
      disabled={isDisabled === null ? undefined : isDisabled}
      {...props}
    >
      {children}
      <Text
        style={
          useTailwind({
            className: textStyles({ intent, isDisabled, fontSize, fontWeight }),
          }) as StyleProp<TextStyle>
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default styled(BiBipButton, {
  props: {},
});
