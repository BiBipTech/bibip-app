import { FunctionComponent } from "react";
import { View } from "react-native";
import * as Progress from "react-native-progress";
import Logo from "../../../assets/logosvg.svg";

interface LoadingProps {}

const Loading: FunctionComponent<LoadingProps> = () => {
  return (
    <View className="bg-cyan-900 h-full w-full items-center justify-center">
      <Logo width={325} height={300} />
      <View className="w-3/4 items-center justify-center mt-3">
        <Progress.Bar
          indeterminate
          borderWidth={0}
          color="#23a65e"
          width={325}
          borderRadius={0}
        />
      </View>
    </View>
  );
};

export default Loading;
