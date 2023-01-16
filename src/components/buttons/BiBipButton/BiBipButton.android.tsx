import { styled } from "nativewind";
import { FunctionComponent } from "react";
import {
  Pressable,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface BiBipButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle: TextProps["style"];
  containerStyle: TouchableOpacityProps["style"];
}

const BiBipButton: FunctionComponent<BiBipButtonProps> = ({
  title,
  containerStyle,
  textStyle,
  children,
  style,
  ...props
}) => {
  return (
    <Pressable
      style={[
        containerStyle,
        {
          shadowColor: "#000",
        },
      ]}
      {...props}
      android_ripple={{
        color: "white",
      }}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

export default styled(BiBipButton, {
  props: {
    containerStyle: true,
    textStyle: true,
  },
});
