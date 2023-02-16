import { FunctionComponent } from "react";
import { View, Text, Image, ActivityIndicator, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import useCustomTailwind from "../../utils/hooks/useCustomTailwind";

interface LoadingProps {}

const Loading: FunctionComponent<LoadingProps> = () => {
  return (
    <View className="bg-white h-full w-full items-center justify-center">
      <Image
        source={require("../../assets/bibip_logo.png")}
        style={useCustomTailwind("mb-4")}
      />
      <View className="w-3/4 items-center justify-center">
        <Progress.Bar
          indeterminate
          borderWidth={0}
          color="#23a65e"
          width={250}
          borderRadius={0}
        />
      </View>
    </View>
  );
};

export default Loading;
