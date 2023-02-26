import { FunctionComponent } from "react";
import { Text, View, ViewProps, ViewStyle } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTailwind } from "nativewind";

interface TripNotificationProps {}

const TripNotification: FunctionComponent<TripNotificationProps> = () => {
  const iconColor = useTailwind({ className: "bg-bibip-green-700" });

  return (
    <View className="w-full py-8 pl-8 pr-8 bg-white rounded-xl flex flex-row items-center justify-start shadow-md">
      <View className="w-12 h-12 mr-4 bg-bibip-green-300 rounded-full items-center justify-center">
        <MaterialCommunityIcons
          name="navigation"
          color={(iconColor[0]! as ViewStyle).backgroundColor}
          size={32}
        />
      </View>
      <View className="flex-1 flex-col">
        <Text className="mb-1 font-bold text-gray-900 text-lg">
          Sürüş başladı!
        </Text>
        <Text className="mt-1 text-gray-600">
          Dilediğin zaman sonlandır butonuna basıp, aracın park halindeki
          fotoğraflarını yükleyerek sürüşü sonlandırabilirsin!
        </Text>
      </View>
    </View>
  );
};

export default TripNotification;
