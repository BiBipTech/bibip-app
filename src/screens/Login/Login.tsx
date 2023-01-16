import React, { useState, useEffect } from "react";
import { Pressable, Text, View, Keyboard, Image } from "react-native";
import UserPhoneInput from "../../components/inputs/UserPhoneInput/UserPhoneInput";
import ConfirmButton from "../../components/buttons/ConfirmButton/ConfirmButton";
import styles from "./Login.style";

const Login = ({ navigation }) => {
  const [phoneNumber, setphoneNumber] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const otpGenerator = (otpCode = "", i = 4) => {
    if (i < 1) {
      return otpCode;
    }
    otpCode = otpCode + Math.floor(Math.random() * 10);
    return otpGenerator(otpCode, (i = i - 1));
  };
  const onPressHandler = () => {
    const otpCode = otpGenerator();
    navigation.navigate("OTP", { otpCode: otpCode, phoneNumber: phoneNumber });
  };

  useEffect(() => {
    if (phoneNumber.length === 12) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [phoneNumber]);
  const pressableHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <Pressable onPress={pressableHandler} style={styles.container}>
      <View style={styles.textContainer}>
        <Image
          source={require("../../assets/bibip-logo.jpg")}
          style={{ height: 150, width: 150 }}
        />
        <Text style={styles.primaryText}>Telefon Numarası ile Devam Et</Text>
        <Text style={styles.secondaryText}>
          Telefonunu doğrulamak için sana bir SMS göndereceğiz.
        </Text>
      </View>
      <UserPhoneInput
        value={phoneNumber}
        placeholder="Mobil Telefon Numarası"
        onChange={setphoneNumber}
      />
      <ConfirmButton
        onPress={onPressHandler}
        isDisabled={isDisabled}
        title="DEVAM"
      />
    </Pressable>
  );
};

export default Login;
