import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import styles from "./ConfirmButton.style";
import COLORS from "../../../assets/COLORS";
const ConfirmButton = ({ title, onPress, isDisabled, loading }) => {
  return (
    <TouchableOpacity
      touchSoundDisabled={true}
      disabled={isDisabled}
      style={
        isDisabled
          ? { ...styles.container, backgroundColor: COLORS.primaryExtraLight }
          : styles.container
      }
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size={30} color="#FFFFFF" />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ConfirmButton;
