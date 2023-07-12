import { StackScreenProps } from "@react-navigation/stack";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Appearance,
  Keyboard,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BiBipHomeStackParamList } from "../../../../Router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useQuery } from "react-query";
import UserContext from "../../../utils/context/UserContext";
import {
  fetchAttributes,
  fetchDocumentStatuses,
  saveAttributes,
} from "./Profile.action";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DocumentButton from "../../../components/buttons/DocumentButton/DocumentButton";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import { promiseWithLoader } from "../../../utils/aws/api";
import { showMessage, hideMessage } from "react-native-flash-message";

type NavigatorProps = StackScreenProps<BiBipHomeStackParamList, "Profile">;

interface ProfileProps extends NavigatorProps {}

const Profile: FunctionComponent<ProfileProps> = ({ navigation }) => {
  const userContext = useContext(UserContext);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");

  const keyboardAnimation = useRef(new Animated.Value(24)).current;

  const {
    data: attributes,
    isLoading: attributesLoading,
    refetch: refetchAttributes,
  } = useQuery({
    queryKey: "attributes",
    enabled: !!userContext.user,
    queryFn: () => fetchAttributes(userContext.user!),
  });

  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: "documents",
    enabled: !!userContext.user,
    queryFn: () => fetchDocumentStatuses(userContext.user!),
  });

  useEffect(() => {
    if (attributes) {
      setName(attributes.name);
      setBirthday(attributes.birthday);
      setEmail(attributes.email);
    }
  }, [attributes, documents]);

  const statusToIntent = (
    status?: string
  ): "confirmed" | "waiting" | "notConfirmed" => {
    if (status === "true") return "confirmed";
    else if (status === "waiting") return "waiting";
    else if (status === "false") return "notConfirmed";

    return "notConfirmed";
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      refetchDocuments();
    });
  }, []);

  useEffect(() => {
    Keyboard.removeAllListeners("keyboardWillHide");
    Keyboard.removeAllListeners("keyboardWillShow");

    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(keyboardAnimation, {
        toValue: e.endCoordinates.height - 40,
        duration: 215,
        useNativeDriver: false,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardWillHide", (e) => {
      Animated.timing(keyboardAnimation, {
        toValue: 24,
        duration: 215,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View className="flex flex-col h-full pb-12">
      <Spinner visible={attributesLoading || documentsLoading || isLoading} />
      <ScrollView className="flex flex-col flex-grow">
        <View className="p-6">
          <TextInput
            className="bg-white text-lg rounded-t-xl p-4 text-gray-700 border border-gray-300"
            multiline
            placeholder="Ad-soyad"
            value={name}
            placeholderTextColor={"#9ca3af"}
            onChangeText={(val) => {
              setName(
                val
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              );
            }}
          />
          <Pressable
            className="bg-white text-lg p-4 pt-2 border border-gray-300 border-t-0"
            onPress={() => {
              setIsDatePickerVisible(true);
            }}
          >
            <View pointerEvents="none">
              <TextInput
                className="bg-white text-lg text-gray-700"
                multiline
                editable={false}
                value={birthday}
                onPressIn={() => {
                  setIsDatePickerVisible(false);
                }}
                placeholder="Doğum tarihi"
                placeholderTextColor={"#9ca3af"}
              />
            </View>
          </Pressable>
          <TextInput
            className="bg-white text-lg rounded-b-xl p-4 text-gray-700 border border-gray-300 border-t-0"
            multiline
            value={email}
            keyboardType="email-address"
            placeholder="Email adresi"
            placeholderTextColor={"#9ca3af"}
            onChangeText={(val) => {
              setEmail(val);
            }}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
            date={moment(birthday, "DD.MM.yyyy").toDate()}
            mode="date"
            onConfirm={(val) => {
              setBirthday(moment(val).format("DD.MM.yyyy"));
              setIsDatePickerVisible(false);
            }}
            onCancel={() => {
              setIsDatePickerVisible(false);
            }}
          />
        </View>
        <View className="w-full border-t border-t-gray-300" />
        <View className="flex flex-col p-6 items-center">
          <DocumentButton
            intent={statusToIntent(documents ? documents.license : "false")}
            title="Sürücü Belgesi"
            onPress={() => {
              navigation.navigate("DocumentCamera", {
                document: "license",
              });
            }}
          />
          <DocumentButton
            intent={statusToIntent(documents ? documents.id : "false")}
            title="Kimlik"
            onPress={() => {
              navigation.navigate("DocumentCamera", {
                document: "id",
              });
            }}
          />
          <DocumentButton
            intent={statusToIntent(documents ? documents.photo : "false")}
            title="Fotoğraf"
            onPress={() => {
              navigation.navigate("DocumentCamera", {
                document: "photo",
              });
            }}
          />
        </View>
      </ScrollView>

      <Animated.View
        className="justify-end px-6"
        style={{
          paddingBottom: keyboardAnimation,
        }}
      >
        <BiBipButton
          title="KAYDET"
          onPress={async () => {
            await promiseWithLoader(
              setIsLoading,
              saveAttributes(userContext.user!, {
                birthday: birthday,
                email: email,
                name: name,
              }).then(async (res) => {
                if (res === "SUCCESS") {
                  await promiseWithLoader(setIsLoading, refetchAttributes());
                  showMessage({
                    message: "Bilgilerin başarıyla güncellendi!",
                    type: "success",
                    icon: "success",
                    style: {
                      alignItems: "center",
                    },
                  });
                }
              })
            );
          }}
        />
      </Animated.View>
    </View>
  );
};

export default Profile;
