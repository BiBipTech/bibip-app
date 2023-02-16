import { FunctionComponent, useContext } from "react";
import { View } from "react-native";

interface WalletCardProps {}

const WalletCard: FunctionComponent<WalletCardProps> = () => {
  return <View className="w-full h-48 bg-bibip-green-500 rounded-3xl"></View>;
};

export default WalletCard;
