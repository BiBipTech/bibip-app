import React, {
  FunctionComponent,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Appearance,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAvatar } from "../utils/api/avatar";
import { useQuery } from "react-query";
import { Auth } from "aws-amplify";
import {
  Feather,
  FontAwesome5,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTailwindColor } from "../utils/hooks/useTailwindColor";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserContext from "../utils/context/UserContext";
import { warn } from "../utils/api/alert";

const Test: FunctionComponent = () => {
  const userContext = useContext(UserContext);

  const [fullName, setFullName] = useState("");
  const [textRefs] = useState<TextInput[]>([]);

  const [fullNameInput, setFullNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [birthdayInput, setBirthdayInput] = useState("");

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const iconColor = useTailwindColor("bg-white");

  const fetchDocumentStatuses = async (user: CognitoUser) => {
    const attributes = await Auth.userAttributes(user);

    return {
      license: attributes.filter(
        (e) => e.Name === "custom:license_confirmed"
      )[0].Value,
      photo: attributes.filter((e) => e.Name === "custom:photo_confirmed")[0]
        .Value,
      id: attributes.filter((e) => e.Name === "custom:id_confirmed")[0].Value,
    };
  };

  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: "documents",
    enabled: !!userContext.user,
    queryFn: () => fetchDocumentStatuses(userContext.user!),
  });

  useQuery(["fullName"], async () => {
    const user = await Auth.currentAuthenticatedUser();

    setFullName(user.attributes.name);
    setFullNameInput(user.attributes.name);
    setEmailInput(user.attributes.email);
    setBirthdayInput(user.attributes.birthdate);
  });

  return (
    <View
      className="h-full w-full items-center justify-start p-4 bg-white"
      onTouchEnd={() => {
        textRefs.forEach((ref) => ref.blur());
      }}
    >
      <View className="w-full flex flex-col justify-start items-center">
        {fullName === "" ? (
          <View className="h-24 w-24 rounded-full items-center justify-center flex flex-col bg-gray-100">
            <ActivityIndicator size="large" color={"grey"} />
          </View>
        ) : (
          <Image
            className="h-24 w-24 rounded-full"
            source={{
              uri: getAvatar(fullName ?? "Eyub Yildirim"),
            }}
          />
        )}
        <Text className="text-3xl mt-4 font-semibold">{fullName}</Text>
        <ProfileTextInput
          value={fullNameInput}
          setValue={setFullNameInput}
          ref={(ref) => {
            if (ref && !textRefs.includes(ref)) textRefs.push(ref);
          }}
        />
        <ProfileTextInput
          value={emailInput}
          setValue={setEmailInput}
          ref={(ref) => {
            if (ref && !textRefs.includes(ref)) textRefs.push(ref);
          }}
        />
        <ProfileTextInput
          value={birthdayInput}
          setValue={setBirthdayInput}
          onEditing={() => {
            setDatePickerVisible(true);
          }}
          ref={(ref) => {
            if (ref && !textRefs.includes(ref)) textRefs.push(ref);
          }}
        />
        <DateTimePickerModal
          isVisible={datePickerVisible}
          isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
          date={moment(birthdayInput, "DD.MM.yyyy").add(24, "hours").toDate()}
          mode="date"
          onConfirm={(val) => {
            setBirthdayInput(
              moment(val).subtract(24, "hours").format("DD.MM.yyyy")
            );
            setDatePickerVisible(false);
          }}
          onCancel={() => {
            setDatePickerVisible(false);
          }}
        />
      </View>
      <View className="flex flex-row justify-between w-full px-4 mt-2">
        <View className="flex flex-col w-[30%] items-center ">
          {documents?.id === "false" ? (
            <TouchableOpacity
              className={`w-full aspect-square rounded-xl bg-bibip-red-500 flex flex-col items-center justify-center`}
            >
              <AntDesign name="idcard" size={32} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View
              className={`w-full aspect-square rounded-xl ${
                documents?.id === "waiting"
                  ? "bg-bibip-yellow-600"
                  : "bg-bibip-green-500"
              } flex flex-col items-center justify-center`}
              onTouchEnd={() => {
                warn(
                  documents?.id === "waiting" ? "Onay Bekliyor" : "Onaylandı",
                  "",
                  () => {},
                  "Tamam"
                );
              }}
            >
              <AntDesign name="idcard" size={32} color={iconColor} />
            </View>
          )}
          <Text className="mt-2 text-xl">Kimlik</Text>
        </View>
        <View className="flex flex-col w-[30%] items-center ">
          {documents?.license === "false" ? (
            <TouchableOpacity
              className={`w-full aspect-square rounded-xl bg-bibip-red-500 flex flex-col items-center justify-center`}
            >
              <FontAwesome
                name="drivers-license-o"
                size={32}
                color={iconColor}
              />
            </TouchableOpacity>
          ) : (
            <View
              className={`w-full aspect-square rounded-xl ${
                documents?.license === "waiting"
                  ? "bg-bibip-yellow-600"
                  : "bg-bibip-green-500"
              } flex flex-col items-center justify-center`}
              onTouchEnd={() => {
                warn(
                  documents?.license === "waiting"
                    ? "Onay Bekliyor"
                    : "Onaylandı",
                  "",
                  () => {},
                  "Tamam"
                );
              }}
            >
              <FontAwesome
                name="drivers-license-o"
                size={32}
                color={iconColor}
              />
            </View>
          )}
          <Text className="mt-2 text-xl">Sürücü Belgesi</Text>
        </View>
        <View className="flex flex-col w-[30%] items-center ">
          {documents?.photo === "false" ? (
            <TouchableOpacity
              className={`w-full aspect-square rounded-xl bg-bibip-red-500 flex flex-col items-center justify-center`}
            >
              <FontAwesome5 name="portrait" size={32} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View
              className={`w-full aspect-square rounded-xl ${
                documents?.photo === "waiting"
                  ? "bg-bibip-yellow-600"
                  : "bg-bibip-green-500"
              } flex flex-col items-center justify-center`}
              onTouchEnd={() => {
                warn(
                  documents?.photo === "waiting"
                    ? "Onay Bekliyor"
                    : "Onaylandı",
                  "",
                  () => {},
                  "Tamam"
                );
              }}
            >
              <FontAwesome5 name="portrait" size={32} color={iconColor} />
            </View>
          )}
          <Text className="mt-2 text-xl">Selfie</Text>
        </View>
      </View>
      <View className="w-full flex-1 flex flex-col justify-end pb-8">
        <TouchableOpacity className="rounded-2xl py-2 bg-bibip-green-500 w-full items-center justify-center">
          <Text className="text-3xl text-gray-100">Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface ProfileTextInputProps {
  value: string;
  setValue: (value: string) => void;
  onEditing?: () => void;
}

const ProfileTextInput = forwardRef<TextInput, ProfileTextInputProps>(
  ({ value, setValue, onEditing }, ref) => {
    const [isEditing, setIsEditing] = useState(false);

    const textInput = useRef<TextInput>(null);

    const editing = useSharedValue(false);

    useImperativeHandle(ref, () => textInput.current!, [textInput]);

    useEffect(() => {
      if (isEditing) {
        textInput.current?.focus();
      }
    }, [isEditing]);

    const gray = useTailwindColor("bg-gray-800");

    const borderAnimation = useAnimatedStyle(() => {
      return {
        borderColor: withTiming(editing.value ? gray : "transparent"),
        borderWidth: 1,
      };
    }, []);

    return (
      <Animated.View
        onTouchEnd={(e) => {
          e.stopPropagation();
          Keyboard.dismiss();
        }}
        style={[borderAnimation]}
        className="rounded-2xl px-4 w-full mt-6 flex flex-row justify-between items-end"
      >
        <TextInput
          className="py-4 text-xl"
          editable={isEditing}
          onChangeText={setValue}
          ref={textInput}
          value={value}
          onBlur={() => {
            setIsEditing(false);
            editing.value = false;
          }}
        />
        <TouchableOpacity
          onPress={
            onEditing
              ? onEditing
              : () => {
                  setIsEditing(true);
                  editing.value = true;
                }
          }
        >
          <Feather
            name="edit"
            size={24}
            color={useTailwindColor("bg-bibip-green-500")}
            style={{
              paddingVertical: 16,
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

export default Test;
