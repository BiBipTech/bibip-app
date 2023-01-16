import { StyleSheet } from "react-native";
import COLORS from "../../../assets/COLORS";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    marginHorizontal: 25,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderColor: COLORS.border,
  },
  input: {
    marginLeft: 20,
    width: "94%",
    fontSize: 15,
  },
  codeContainer: {
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.border,
  },
  codeText: {
    fontSize: 15,
  },
});
