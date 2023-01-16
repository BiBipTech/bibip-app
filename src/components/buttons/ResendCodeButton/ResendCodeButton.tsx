import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import styles from "./ResendCodeButton.style";
import COLORS from "../../../assets/COLORS";

const ResendCodeButton = ({ title, onPress, loading, isResend }) => {
  return (
    <TouchableOpacity
      disabled={isResend}
      onPress={onPress}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size={30} color={COLORS.primaryDark} />
      ) : (
        <Text
          style={
            isResend
              ? { ...styles.title, color: COLORS.primaryExtraLight }
              : styles.title
          }
        >
          {isResend ? "1:59" : title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ResendCodeButton;
