import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import styles from "./UserPhoneInput.style";
import MaskInput from "react-native-mask-input";
const UserPhoneInput = ({ value, placeholder, onChange }) => {
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
        onChangeText={onChange}
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
