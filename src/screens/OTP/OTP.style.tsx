import { StyleSheet } from "react-native";
import COLORS from "../../assets/COLORS";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
  },
  textContainer: {
    alignItems: "center",
    padding: 20,
  },

  primaryText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 10,
    lineHeight: 40,
    color: COLORS.highEmphasis,
  },
  secondaryText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.2,
    marginTop: 10,
    color: COLORS.mediumEmphasis,
  },
});
