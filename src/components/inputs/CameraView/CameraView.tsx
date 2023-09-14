import { Camera, CameraProps, CameraType } from "expo-camera";
import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const camera = useRef<Camera>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted || permission.canAskAgain) {
    requestPermission().then((res) => {
      if (res.granted || !res.canAskAgain) setPermissionGranted(true);

      requestPermission().then((res) => {
        if (res.granted || !res.canAskAgain) setPermissionGranted(true);
      });
    });
  }

  return (
    <Camera ref={camera} type={type}>
      <SafeAreaView
        style={{
          zIndex: 10,
        }}
      >
        <View className="justify-end items-center w-full h-full">
          <TouchableOpacity
            className="bg-bibip-blue-500 w-16 h-16 rounded-full justify-center items-center flex flex-col"
            onPress={async () => {
              const res = await camera.current?.takePictureAsync();
              setImageUri(res?.uri!);
            }}
          >
            <Ionicons name="camera" size={48} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Camera>
  );
};

export default CameraView;
