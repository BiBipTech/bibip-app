import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import {
  AppSignedInDrawerParamList,
  AppSignedInStackParamList,
} from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";

type NavigatorProps = StackScreenProps<AppSignedInStackParamList, "Success">;

interface SuccessProps extends NavigatorProps {}

const Success: FunctionComponent<SuccessProps> = ({ navigation }) => {
  return (
    <View className="h-full justify-center items-center">
      <Text>Success</Text>
      <BiBipButton
        title="Go Back"
        onPress={() => {
          navigation.navigate("PaymentMethods");
        }}
      />
    </View>
  );
};

export default Success;
