import { FunctionComponent } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface NavigationButtonProps {}

const NavigationButton: FunctionComponent<NavigationButtonProps> = () => {
  return (
    <TouchableOpacity className="bg-cyan-500 rounded-full items-center justify-center flex flex-col w-14 h-14 shadow-md shadow-cyan-500">
      <MaterialCommunityIcons
        name="navigation-variant"
        color={"white"}
        size={32}
      />
    </TouchableOpacity>
  );
};

export default NavigationButton;
