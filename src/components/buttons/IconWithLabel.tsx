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
    <View className="mr-2 flex flex-row items-center">
      {icon}
      <Text className="ml-1 text-gray-100 text-lg">{label}</Text>
    </View>
  );
};

export default IconWithLabel;
