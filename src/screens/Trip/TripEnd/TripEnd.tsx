import { StackScreenProps } from "@react-navigation/stack";
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { endTrip } from "../Trip/Trip.action";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PhotoType } from "./TripEnd.type";
import { AxiosError } from "axios";
import { Auth, Storage } from "aws-amplify";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { onEndTrip, photoTypeString, uploadPhoto } from "./TripEnd.action";
import { TripStackParamList } from "../../../../Router";
import UserContext from "../../../utils/context/UserContext";
import { promiseWithLoader } from "../../../utils/aws/api";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { cloneWithNewReference } from "../../../utils/util/array";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";

type NavigatorProps = StackScreenProps<TripStackParamList, "TripEnd">;

type Sides = {
  [K in PhotoType]: string;
};

interface TripEndProps extends NavigatorProps {}

const TripEnd: FunctionComponent<TripEndProps> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [additionalComment, setAdditionalComment] = useState("");

  const userContext = useContext(UserContext);

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

  const onEnd = async () => {
    await promiseWithLoader(
      setIsLoading,
      onEndTrip(
        data,
        userContext,
        route.params.carId!,
        route.params.waypoints!,
        navigation
      )
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

  return (
    <SafeAreaView className="mt-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          height: "100%",
        }}
        onTouchStart={(e) => {
          Keyboard.dismiss();
        }}
      >
        <View className="h-full justify-start items-center">
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TripEnd;
