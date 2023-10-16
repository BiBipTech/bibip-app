import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PhotoType } from "./TripEnd.type";
import { onEndTrip, photoTypeString, uploadPhoto } from "./TripEnd.action";
import { BiBipTripStackParamList } from "../../../../Router";
import UserContext from "../../../utils/context/UserContext";
import { promiseWithLoader } from "../../../utils/aws/api";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { cloneWithNewReference } from "../../../utils/util/array";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import * as Progress from "react-native-progress";
import * as BlurView from "expo-blur";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";
import useMqtt from "../../../utils/hooks/useMqtt";

type NavigatorProps = StackScreenProps<BiBipTripStackParamList, "TripEnd">;

type Sides = {
  [K in PhotoType]: string;
};

interface TripEndProps extends NavigatorProps {}

const TripEnd: FunctionComponent<TripEndProps> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [additionalComment, setAdditionalComment] = useState("");

  const [photosUploading, setPhotosUploading] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(0);

  const userContext = useContext(UserContext);

  const { lockCar, unlockCar } = useMqtt();

  const [data, setData] = useState<{ type: PhotoType; value: string }[]>([
    {
      type: "BACK",
      value: "",
    },
    {
      type: "FRONT",
      value: "",
    },
    {
      type: "RIGHT",
      value: "",
    },
    {
      type: "LEFT",
      value: "",
    },
  ]);

  const showUploadAlert = (show: boolean) => {
    setPhotosUploading(show);
  };

  const onEnd = async () => {
    console.log(route.params);

    await onEndTrip(
      data,
      userContext,
      route.params.carId!,
      route.params.waypoints!,
      navigation,
      showUploadAlert,
      setPhotosUploaded,
      setIsLoading,
      lockCar
    );
  };

  const onPhotoSelect = (type: PhotoType) => {
    navigation.navigate("Camera", {
      currentRoute: route.params,
      data: data,
      setData: setData,
      type: type,
    });
  };

  const cyanColor = useTailwindColor("bg-cyan-500");

  return (
    <View className="mt-4 h-full justify-start items-center">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          height: "100%",
        }}
        onTouchStart={(e) => {
          Keyboard.dismiss();
        }}
      >
        {photosUploading && (
          <BlurView.BlurView
            className="w-screen bottom-4 h-screen absolute px-4 bg-white/10 justify-center flex flex-col"
            style={{
              zIndex: 10,
            }}
          >
            <View className="w-3/4 left-[12.5%] bg-white py-4 flex flex-col justify-center px-4">
              <Text className="text-center mb-2 font-semibold text-xl">
                Fotoğraflar yükleniyor
              </Text>
              <Progress.Bar
                progress={photosUploaded / data.length}
                width={null}
                color={cyanColor}
              />
              <Text className="text-center mt-2">
                {photosUploaded}/{data.length}
              </Text>
            </View>
          </BlurView.BlurView>
        )}
        <SafeAreaView className="h-full justify-start items-center ">
          <Spinner visible={isLoading} />
          <Text className="px-4">
            Sürüşü sonlandırmak için aracın ön, arka, sağ ve sol taraflarının ve
            mevcutsa herhangi bir hasarın fotoğrafını eklemelisin.
          </Text>
          <View className="border-gray-500 border-b w-full mt-4" />
          <View className="w-full mt-4 px-4">
            <FlatList
              ListEmptyComponent={() => <View />}
              data={data}
              horizontal
              renderItem={(item) => {
                if (item.item.value !== "")
                  return (
                    <View className="w-32 h-32 mx-2">
                      <Image
                        source={{ uri: item.item.value }}
                        className="w-full h-full"
                      />
                      <View className="w-full">
                        <View className="bottom-full p-2 flex-row">
                          <BiBipIconButton
                            onPress={() => {
                              const index = data.findIndex(
                                (p) => p.type === item.item.type
                              );
                              data[index].value = "";
                              setData(cloneWithNewReference(data));
                            }}
                            intent="danger"
                          >
                            <Ionicons
                              name="trash"
                              size={24}
                              color="white"
                              style={{
                                borderWidth: 1,
                                borderColor: "white",
                                borderRadius: 5,
                              }}
                            />
                          </BiBipIconButton>
                        </View>
                      </View>
                    </View>
                  );
                else {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onPhotoSelect(item.item.type);
                      }}
                    >
                      <View className="w-32 h-32 mx-2 bg-gray-400 justify-center items-center rounded-lg">
                        <Text className="text-gray-100">
                          {photoTypeString(item.item.type)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
          <View className="flex flex-1 w-full p-4 h-32">
            <TextInput
              className="h-full border rounded-lg border-gray-400 p-4"
              numberOfLines={4}
              multiline
              placeholder="Eklemek istediğin ek yorumlar..."
              value={additionalComment}
              onChangeText={(val) => {
                setAdditionalComment(val);
              }}
            />
          </View>
          <View className="flex-col justify-end w-full px-4">
            <BiBipButton
              title="SONLANDIR"
              onPress={onEnd}
              fullWidth
              fontSize={"large"}
              fontWeight="light"
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TripEnd;
