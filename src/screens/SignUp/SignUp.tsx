import { StackScreenProps } from "@react-navigation/stack";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  Animated,
  Appearance,
  Keyboard,
  Pressable,
  ScrollView,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { AppSignedOutStackParamList } from "../../../Router";
import BiBipButton from "../../components/buttons/BiBipButton/BiBipButton";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { StatusBar } from "expo-status-bar";
import { signUp } from "./SignUp.action";

type NavigatorProps = StackScreenProps<AppSignedOutStackParamList, "SignUp">;

interface SignUpProps extends NavigatorProps {}

const SignUp: FunctionComponent<SignUpProps> = ({
  navigation,
  route: {
    params: { phoneNumber },
  },
}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const name = useRef<TextInput>(null);
  const email = useRef<TextInput>(null);
  const birthday = useRef<TextInput>(null);
  const citizenId = useRef<TextInput>(null);

  const keyboardAnimation = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Keyboard.removeAllListeners("keyboardWillHide");
    Keyboard.removeAllListeners("keyboardWillShow");

    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(keyboardAnimation, {
        toValue: e.endCoordinates.height,
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
    <Formik
      initialValues={{
        email: "",
        name: "",
        phoneNumber: `+90${phoneNumber.replace(/\s/g, "")}`,
        birthday: "",
        citizenId: "",
      }}
      onSubmit={async (values) => {
        const res = await signUp(values);

        if (res) {
          navigation.navigate("OTP", {
            phoneNumber: `+90${phoneNumber.replace(/\s/g, "")}`,
            attempt: res,
          });
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        setFieldTouched,
      }) => {
        return (
          <View className="p-6 flex flex-col justify-between h-full">
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
              }}
              className="flex flex-shrink flex-col"
            >
              <ScrollView className="flex flex-shrink flex-col">
                <TextInput
                  className="bg-white text-lg rounded-xl p-4 text-gray-300 border border-gray-300"
                  multiline
                  placeholder=""
                  editable={false}
                  value={values.phoneNumber}
                  placeholderTextColor={"#9ca3af"}
                />
                <TextInput
                  className="bg-white text-lg rounded-xl p-4 mt-2 text-gray-700 border border-gray-300"
                  ref={name}
                  multiline
                  placeholder="Ad-soyad"
                  value={values.name}
                  placeholderTextColor={"#9ca3af"}
                  blurOnSubmit
                  onChangeText={(e) => {
                    e = e
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    setFieldValue("name", e);
                  }}
                  onSubmitEditing={(e) => {
                    email.current?.focus();
                  }}
                />
                <TextInput
                  className="bg-white text-lg rounded-xl p-4 mt-2 text-gray-700 border border-gray-300"
                  ref={email}
                  autoCorrect={false}
                  keyboardType="email-address"
                  multiline
                  placeholder="Email"
                  value={values.email}
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={handleChange("email")}
                  blurOnSubmit
                  onSubmitEditing={(e) => {
                    setIsDatePickerVisible(true);
                  }}
                />

                <Pressable
                  // className="bg-white text-lg p-4 border border-gray-300 border-t-0"
                  onPress={() => {
                    setIsDatePickerVisible(true);
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      className="bg-white text-lg rounded-xl p-4 mt-2 text-gray-700 border border-gray-300"
                      ref={birthday}
                      multiline
                      editable={false}
                      placeholder="Doğum tarihi"
                      value={values.birthday}
                      placeholderTextColor={"#9ca3af"}
                      onChangeText={handleChange("email")}
                    />
                  </View>
                </Pressable>
                <TextInput
                  className="bg-white text-lg rounded-xl p-4 mt-2 text-gray-700 border border-gray-300"
                  ref={citizenId}
                  keyboardType="number-pad"
                  multiline
                  placeholder="Kimlik Numarası"
                  value={values.citizenId}
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={handleChange("citizenId")}
                  blurOnSubmit
                  onSubmitEditing={(e) => {
                    birthday.current?.focus();
                  }}
                />

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
                  mode="date"
                  onHide={() => {
                    citizenId.current?.focus();
                  }}
                  date={
                    values.birthday === ""
                      ? new Date()
                      : moment(values.birthday, "DD.MM.yyyy").toDate()
                  }
                  onConfirm={(val) => {
                    setFieldValue("birthday", moment(val).format("DD.MM.yyyy"));
                    setIsDatePickerVisible(false);
                  }}
                  onCancel={() => {
                    setIsDatePickerVisible(false);
                  }}
                />
              </ScrollView>
            </Pressable>
            <Animated.View
              className="justify-end flex flex-grow"
              style={{
                paddingBottom: keyboardAnimation,
              }}
            >
              <BiBipButton onPress={() => handleSubmit()} title="Submit" />
            </Animated.View>
            <StatusBar style="dark" />
          </View>
        );
      }}
    </Formik>
  );
};

export default SignUp;
