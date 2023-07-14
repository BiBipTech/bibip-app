import { FunctionComponent } from "react";
import { Text, TouchableOpacity } from "react-native";

interface InformationBoxButtonProps {
  invert?: boolean;
  text: string;
}

const InformationBoxButton: FunctionComponent<InformationBoxButtonProps> = ({
  invert,
  text,
}) => {
  if (invert)
    return (
      <TouchableOpacity className="flex flex-grow items-center justify-center flex-col border-2 border-cyan-500 rounded-full py-1">
        <Text className="text-cyan-500 text-center text-lg">{text}</Text>
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity className="flex flex-grow items-center justify-center bg-cyan-500 flex-col border-2 border-cyan-500 rounded-full py-1">
      <Text className="text-gray-100 text-center font-semibold text-lg">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default InformationBoxButton;
