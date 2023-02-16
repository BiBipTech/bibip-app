import { styled, useTailwind } from "nativewind";
import { FunctionComponent } from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

interface BiBipButtonProps extends TouchableOpacityProps {}

const BiBipButton: FunctionComponent<BiBipButtonProps> = ({
  children,
  style,
  ...props
}) => {
  return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
};

export default styled(BiBipButton, {
  props: {},
});
