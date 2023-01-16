import { StyleSheet } from "react-native";
import COLORS from "../../../assets/COLORS";
export default StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 17,
    margin: 25,
    borderRadius: 12,
    backgroundColor: COLORS.primaryButtons,
  },
  title: {
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 1,
    fontWeight: "bold",
  },
});
