import { StackScreenProps } from "@react-navigation/stack";
import { Camera, CameraType } from "expo-camera";
import { FunctionComponent, useContext, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import {
  AppSignedInDrawerParamList,
  AppSignedInStackParamList,
} from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import CameraView from "../../../components/inputs/CameraView/CameraView";
import { promiseWithLoader } from "../../../utils/aws/api";
import UserContext from "../../../utils/context/UserContext";
import { uploadPhoto } from "./DocumentCamera.action";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type NavigatorProps = StackScreenProps<
  AppSignedInStackParamList,
  "DocumentCamera"
>;

interface DocumentCameraProps extends NavigatorProps {}

const DocumentCamera: FunctionComponent<DocumentCameraProps> = ({
  navigation,
  route,
}) => {
  const userContext = useContext(UserContext);
  const camera = useRef<Camera>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState("");

  if (imageUri !== "") {
    return (
      <View className="w-full h-full">
        <Spinner visible={isLoading} />
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
              onPress={async () => {
                await promiseWithLoader(
                  setIsLoading,
                  uploadPhoto(
                    {
                      type: route.params.document,
                      value: imageUri,
                    },
                    userContext.user!
                  )
                );
                navigation.goBack();
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

export default DocumentCamera;
