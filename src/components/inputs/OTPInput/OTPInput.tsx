import { View, TextInput } from "react-native";
import React, { useRef } from "react";
import styles from "./OTPInput.style";
const OTPInput = ({ setFirst, setSecond, setThird, checkUserInput }) => {
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        autoFocus={true}
        onChangeText={(val) => {
          if (val.length === 1) {
            setFirst(val);
            input2.current.focus();
          }
        }}
        maxLength={1}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(val) => {
          if (val.length === 1) {
            setSecond(val);
            input3.current.focus();
          }
        }}
        maxLength={1}
        returnKeyType="next"
        ref={input2}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(val) => {
          if (val.length === 1) {
            setThird(val);
            input4.current.focus();
          }
        }}
        maxLength={1}
        ref={input3}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(val) => {
          if (val.length === 1) {
            checkUserInput(val);
          }
        }}
        maxLength={1}
        ref={input4}
      />
    </View>
  );
};

export default OTPInput;
