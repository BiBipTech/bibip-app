import { Alert } from "react-native";

export const warn = (
  title: string,
  message: string,
  onPress: () => void,
  ok: string
) => {
  Alert.alert(title, message, [{ onPress: onPress, text: ok }]);
  return false;
};
