import {
  View,
  Pressable,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TextStyle,
  Platform,
  StyleProp,
} from "react-native";
import React, { useRef, useState, useEffect, useContext } from "react";
import styles from "./OTP.style";
import COLORS from "../../assets/COLORS";
import BiBipButton from "../../components/buttons/BiBipButton/BiBipButton";
import OTPInputView from "../../components/inputs/OTPInputView";
import { useTailwind } from "nativewind";
import { StackScreenProps } from "@react-navigation/stack";
import { AppSignedOutStackParamList } from "../../../Router";
import useUser from "../../utils/hooks/useUser";
import UserContext from "../../utils/context/UserContext";
import { Auth } from "aws-amplify";
import { warn } from "../../utils/api/alert";

type NavigatorProps = StackScreenProps<AppSignedOutStackParamList, "OTP">;

interface OTPProps extends NavigatorProps {}

const OTP = ({ navigation, route }: OTPProps) => {
  const { phoneNumber, attempt } = route.params;
  const { signIn, confirmSignIn } = useUser();
  const userContext = useContext(UserContext);

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
      <Pressable
        onPress={pressableHandler}
        className="flex flex-col bg-white h-full py-12 px-8"
      >
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>Telefon Numaranı Doğrula</Text>
          <Text style={styles.secondaryText}>
            Cep telefonuna SMS ile gönderdiğimiz kodu gir.
          </Text>
          <Text
            style={{ ...styles.secondaryText, color: COLORS.mediumEmphasis }}
          >
            {phoneNumber}
          </Text>
        </View>

        <View className="flex-grow-0 flex-shrink h-20 w-full">
          <OTPInputView
            autofillFromClipboard={true}
            numberOfInputs={6}
            handleChange={async (otp) => {
              if (otp.length === 6) {
                if (
                  attempt.userConfirmed !== undefined &&
                  attempt.userConfirmed === false
                ) {
                  const resp = await Auth.confirmSignUp(
                    route.params.phoneNumber,
                    otp
                  );
                  if (resp === "SUCCESS") {
                    warn(
                      "Üye Olundu",
                      "Başarıyla üye oldun, şimdi tekrar giriş yapmak için anasayfaya yönlendirileceksin!",
                      () => {
                        navigation.popToTop();
                      },
                      "Tamam"
                    );
                  }
                } else {
                  const resp = await confirmSignIn(otp, route.params.attempt);
                  userContext.setUser(resp);
                }
              }
            }}
            inputStyles={
              useTailwind({
                className:
                  "border w-10 h-16 rounded-md border-gray-400 text-center text-3xl text-bibip-blue-900",
              }) as StyleProp<TextStyle>
            }
          />
        </View>
        <View className="justify-center items-center mt-4">
          <BiBipButton
            onPress={() => {}}
            title="TEKRAR GÖNDER"
            intent="secondary"
            fullWidth={false}
          />
        </View>
        <View className="flex-grow items-center justify-end">
          <BiBipButton title="DEVAM >" intent="primary" fullWidth={true} />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default OTP;
