import { VariantProps } from "class-variance-authority";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import { labelStyle, valueStyle } from "./common";

interface LabelValueProps
  extends VariantProps<typeof labelStyle>,
    VariantProps<typeof valueStyle> {
  label: string;
  value: string;
}

const LabelValue: FunctionComponent<LabelValueProps> = ({
  label,
  value,
  labelSize,
  labelWeight,
  valueSize,
  valueWeight,
}) => {
  return (
    <View className="flex flex-row justify-between w-full mt-4">
      <Text style={useCustomTailwind(labelStyle({ labelSize, labelWeight }))}>
        {label}
      </Text>
      <Text style={useCustomTailwind(valueStyle({ valueSize, valueWeight }))}>
        {value}
      </Text>
    </View>
  );
};

export default LabelValue;
