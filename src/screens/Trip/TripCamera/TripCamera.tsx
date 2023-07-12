import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useState } from "react";
import { Image, View } from "react-native";
import { LogBox } from "react-native";
import { BiBipTripStackParamList } from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import CameraView from "../../../components/inputs/CameraView/CameraView";
import { cloneWithNewReference } from "../../../utils/util/array";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

type NavigatorProps = StackScreenProps<BiBipTripStackParamList, "Camera">;

interface TripCameraProps extends NavigatorProps {}

const TripCamera: FunctionComponent<TripCameraProps> = ({
  navigation,
  route,
}) => {
  const [imageUri, setImageUri] = useState("");

  if (imageUri !== "") {
    return (
      <View className="w-full h-full">
        <Image source={{ uri: imageUri }} className="flex-1 " />
        <View className="w-full items-center justify-center">
          <View className="absolute bottom-8 flex flex-row justify-between">
            <BiBipButton
              title="TEKRAR"
              buttonCount={2}
              onPress={() => {
                setImageUri("");
              }}
              intent={"secondary"}
            />
            <BiBipButton
              title="ONAYLA"
              buttonCount={2}
              onPress={() => {
                const oldData = route.params.data;
                const type = route.params.type;

                const index = oldData.findIndex((p) => p.type === type);

                oldData[index] = {
                  type: type,
                  value: imageUri,
                };

                const newData = cloneWithNewReference(oldData);
                route.params.setData(newData);

                navigation.navigate("TripEnd", route.params.currentRoute);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <CameraView setImageUri={setImageUri} />
    </View>
  );
};

export default TripCamera;
