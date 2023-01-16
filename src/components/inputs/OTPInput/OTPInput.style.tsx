import { StyleSheet } from "react-native";
import COLORS from "../../../assets/COLORS";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    borderWidth: 1,
    height: 80,
    width: 70,
    borderRadius: 10,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    borderColor: COLORS.border,
  },
});
