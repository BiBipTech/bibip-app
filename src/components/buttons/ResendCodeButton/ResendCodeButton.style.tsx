import { StyleSheet } from "react-native";
import COLORS from "../../../assets/COLORS";

export default StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    alignSelf: "center",
    maxWidth: 200,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.primaryDark,
    fontWeight: "bold",
    fontSize: 15,
  },
});
