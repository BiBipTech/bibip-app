import { FunctionComponent, ReactNode } from "react";
import { Text, View } from "react-native";

interface IconWithLabelProps {
  icon: ReactNode;
  label: string;
}
const IconWithLabel: FunctionComponent<IconWithLabelProps> = ({
  icon,
  label,
}) => {
  return (
    <View className="ml-2 flex flex-row items-center">
      {icon}
      <Text className="ml-1 text-gray-100">{label}</Text>
    </View>
  );
};

export default IconWithLabel;
