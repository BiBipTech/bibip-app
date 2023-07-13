import { StackScreenProps } from "@react-navigation/stack";
import { Camera, CameraType } from "expo-camera";
import { FunctionComponent, useContext, useRef, useState } from "react";
import { Image, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import {
  AppSignedInDrawerParamList,
  BiBipHomeStackParamList,
} from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import CameraView from "../../../components/inputs/CameraView/CameraView";
import { promiseWithLoader } from "../../../utils/aws/api";
import UserContext from "../../../utils/context/UserContext";
import { uploadPhoto } from "./DocumentCamera.action";

type NavigatorProps = StackScreenProps<
  BiBipHomeStackParamList,
  "DocumentCamera"
>;

interface DocumentCameraProps extends NavigatorProps {}

const DocumentCamera: FunctionComponent<DocumentCameraProps> = ({
  navigation,
  route,
}) => {
  const userContext = useContext(UserContext);

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
    <View>
      <CameraView
        setImageUri={setImageUri}
        type={
          route.params.document === "photo" ? CameraType.front : CameraType.back
        }
      />
    </View>
  );
};

export default DocumentCamera;
