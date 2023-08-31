import React, { useState, useEffect, FC, useContext } from "react";
import {
  Pressable,
  Text,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import UserPhoneInput from "../../components/inputs/UserPhoneInput/UserPhoneInput";
import styles from "./Login.style";
import BiBipButton from "../../components/buttons/BiBipButton/BiBipButton";
import { StackScreenProps } from "@react-navigation/stack";
import { AppSignedOutStackParamList } from "../../../Router";
import UserContext from "../../utils/context/UserContext";
import useUser from "../../utils/hooks/useUser";
import Spinner from "react-native-loading-spinner-overlay/lib";

type NavigatorProps = StackScreenProps<AppSignedOutStackParamList, "Login">;

interface LoginProps extends NavigatorProps {}

const Login: FC<LoginProps> = ({ navigation }) => {
  const { signIn } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const [phoneNumber, setphoneNumber] = useState("");
  const [isDisabled, setDisabled] = useState(true);

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (phoneNumber.length === 12) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [phoneNumber]);

  const onPressHandler = async () => {
    setIsLoading(true);
    try {
      const signInAttempt = await signIn(
        `+90${phoneNumber.replace(/\s/g, "")}`
      );
      setIsLoading(false);
      navigation.navigate("OTP", {
        phoneNumber: phoneNumber,
        attempt: signInAttempt,
      });
    } catch (error: any) {
      setIsLoading(false);

      if (error.code === "UserNotFoundException") {
        navigation.navigate("SignUp", {
          phoneNumber: phoneNumber,
        });
      }
    }
  };

  const pressableHandler = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
      }}
    >
      <Spinner visible={isLoading} />
      <Pressable
        onPress={pressableHandler}
        className="bg-white h-full px-4 py-12 flex flex-col"
      >
        <View className="items-center justify-center">
          <Image
            source={require("../../assets/bibip-logo.jpg")}
            style={{ height: 150, width: 150 }}
          />
          <Text style={styles.primaryText}>Telefon Numarası ile Devam Et</Text>
          <Text style={styles.secondaryText}>
            Telefonunu doğrulamak için sana bir SMS göndereceğiz.
          </Text>
        </View>
        <View className="px-4 mt-4 items-center justify-between flex flex-grow">
          <UserPhoneInput
            value={phoneNumber}
            placeholder="Mobil Telefon Numarası"
            onChangeText={setphoneNumber}
          />
          <BiBipButton
            onPress={onPressHandler}
            intent="primary"
            isDisabled={isDisabled}
            fullWidth={true}
            title="DEVAM"
          />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Login;
