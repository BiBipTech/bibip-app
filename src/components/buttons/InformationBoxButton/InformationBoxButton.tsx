import { FunctionComponent } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface InformationBoxButtonProps extends TouchableOpacityProps {
  invert?: boolean;
  text: string;
  danger?: boolean;
}

const InformationBoxButton: FunctionComponent<InformationBoxButtonProps> = ({
  invert,
  text,
  danger,
  ...props
}) => {
  if (invert && danger)
    return (
      <TouchableOpacity
        {...props}
        className="flex flex-grow bg-white items-center justify-center flex-col border border-bibip-red-400 rounded-full py-1"
      >
        <Text className="text-bibip-red-500 text-center text-lg">{text}</Text>
      </TouchableOpacity>
    );

  if (invert)
    return (
      <TouchableOpacity
        {...props}
        className="flex flex-grow items-center justify-center flex-col border-2 border-cyan-500 rounded-full py-1"
      >
        <Text className="text-cyan-500 text-center text-lg">{text}</Text>
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity
      {...props}
      className="flex flex-grow items-center justify-center bg-cyan-500 flex-col border border-cyan-500 rounded-full py-1"
    >
      <Text className="text-gray-100 text-center font-semibold text-lg">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default InformationBoxButton;
