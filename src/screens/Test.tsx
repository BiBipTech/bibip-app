import { FunctionComponent } from "react";
import { View } from "react-native";
import ChargeStationInformationBox from "../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";

interface TestProps {}

const Test: FunctionComponent<TestProps> = () => {
  return (
    <View className="p-4">
      <ChargeStationInformationBox />
    </View>
  );
};

export default Test;
