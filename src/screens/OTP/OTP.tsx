import { View, Pressable, Text, Image, Keyboard } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import styles from "./OTP.style";
import COLORS from "../../assets/COLORS";
import OTPInput from "../../components/inputs/OTPInput/OTPInput";
import ResendCodeButton from "../../components/buttons/ResendCodeButton/ResendCodeButton";
const OTP = ({ navigation, route }) => {
  const { otpCode, phoneNumber } = route.params;
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [isResend, setIsResend] = useState(false);

  const checkUserInput = (fourth: number) => {
    const userInput = (first + second + third + fourth).toString();
    if (otpCode === userInput) {
      navigation.navigate("Home");
      console.log(userInput, "userInput");
    } else {
      console.log("Yanlış Kod");
    }
  };
  const pressableHandler = () => {
    Keyboard.dismiss();
  };
  const sendCodeHandler = () => {
    setIsResend(true);
  };

  return (
    <Pressable onPress={pressableHandler} style={styles.container}>
      <View style={styles.textContainer}>
        <Image
          source={require("../../assets/bibip-logo.jpg")}
          style={{ height: 150, width: 150 }}
        />
        <Text style={styles.primaryText}>Telefon Numaranı Doğrula</Text>
        <Text style={styles.secondaryText}>
          Cep telefonuna SMS ile gönderdiğimiz kodu gir.
        </Text>
        <Text style={{ ...styles.secondaryText, color: COLORS.mediumEmphasis }}>
          +90 {phoneNumber}
        </Text>
      </View>

      <OTPInput
        setFirst={setFirst}
        setSecond={setSecond}
        setThird={setThird}
        checkUserInput={checkUserInput}
      />
      <ResendCodeButton
        onPress={sendCodeHandler}
        isResend={isResend}
        title="TEKRAR GÖNDER"
      />
    </Pressable>
  );
};

export default OTP;
