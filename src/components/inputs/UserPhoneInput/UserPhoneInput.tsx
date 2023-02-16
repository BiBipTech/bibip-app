import React, { FC, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from "react-native";
import styles from "./UserPhoneInput.style";
import MaskInput from "react-native-mask-input";

interface UserPhoneInputProps extends TextInputProps {}

const UserPhoneInput: FC<UserPhoneInputProps> = ({
  value,
  placeholder,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.codeContainer}>
        <Text style={styles.codeText}> +90 </Text>
      </TouchableOpacity>
      <MaskInput
        autoFocus={true}
        value={value}
        style={styles.input}
        placeholder={placeholder}
        maxLength={14}
        keyboardType="numeric"
        onChangeText={onChangeText}
        mask={[
          /\d/,
          /\d/,
          /\d/,
          " ",
          /\d/,
          /\d/,
          /\d/,
          " ",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
      />
    </View>
  );
};

export default UserPhoneInput;
