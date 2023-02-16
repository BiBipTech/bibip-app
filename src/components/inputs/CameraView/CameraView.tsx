import { Camera, CameraProps, CameraType } from "expo-camera";
import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Dimensions, Image, Platform, View } from "react-native";
import BiBipIconButton from "../../buttons/BiBipIconButton/BiBipIconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

interface CameraViewProps extends CameraProps {
  setImageUri: Dispatch<SetStateAction<string>>;
}

const CameraView: FunctionComponent<CameraViewProps> = ({
  setImageUri,
  type,
}) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const camera = useRef<Camera>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    requestPermission();
  }

  return (
    <Camera ref={camera} type={type}>
      <SafeAreaView>
        <View className="justify-end items-center w-full h-full">
          <BiBipIconButton
            buttonSize={"large"}
            onPress={async () => {
              const res = await camera.current?.takePictureAsync();
              setImageUri(res?.uri!);
            }}
          >
            <Ionicons name="camera" size={48} color="white" />
          </BiBipIconButton>
        </View>
      </SafeAreaView>
    </Camera>
  );
};

export default CameraView;
