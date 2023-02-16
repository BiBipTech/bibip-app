import { VariantProps } from "class-variance-authority";
import { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import { buttonStyles } from "./common";

interface BiBipIconButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyles> {}

const BiBipIconButton: FC<BiBipIconButtonProps> = ({
  buttonSize,
  intent,
  style,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={useCustomTailwind(buttonStyles({ buttonSize, intent }))}
    >
      {children}
    </TouchableOpacity>
  );
};

export default BiBipIconButton;
