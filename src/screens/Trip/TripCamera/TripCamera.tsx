import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LogBox } from "react-native";
import { BiBipTripStackParamList } from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import CameraView from "../../../components/inputs/CameraView/CameraView";
import { cloneWithNewReference } from "../../../utils/util/array";
import { Camera, CameraType } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

  const camera = useRef<Camera>(null);

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
    <View className=" flex flex-col justify-end items-center w-full h-full">
      <Camera
        className="absolute h-full w-full"
        ref={camera}
        type={CameraType.back}
        style={{ flex: 1, zIndex: -1 }}
      />
      <SafeAreaView>
        <TouchableOpacity
          onPress={async () => {
            const res = await camera.current?.takePictureAsync();
            setImageUri(res?.uri!);
          }}
          className="w-20 rounded-full h-20 bg-bibip-blue-500 flex flex-col items-center justify-center"
        >
          <Ionicons name="camera" size={52} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default TripCamera;
