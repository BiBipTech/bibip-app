import {
  FunctionComponent,
  LegacyRef,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Keyboard, TextInput, TextInputProps, View } from "react-native";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import { VariantProps, cva } from "class-variance-authority";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";

interface CustomTextInputProps
  extends TextInputProps,
    VariantProps<typeof inputStyles> {}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  ({ ...props }, ref) => {
    const textInput = useRef<TextInput>(null);

    useImperativeHandle(ref, () => textInput.current!, [textInput]);

    return (
      <View
        onTouchStart={() => {
          textInput.current?.focus();
        }}
        onTouchMove={() => {
          Keyboard.dismiss();
        }}
        style={[
          useCustomTailwind(
            inputStyles({
              side: props.side,
            })
          ),
        ]}
      >
        <TextInput
          {...props}
          ref={textInput}
          placeholderTextColor={useTailwindColor("bg-gray-400")}
        />
      </View>
    );
  }
);
export default CustomTextInput;

const inputStyles = cva(
  "border border-gray-200 bg-white p-6 mt-2 items-center rounded-md flex flex-row flex-1",
  {
    variants: {
      side: {
        generic: "",
        left: "rounded-l-md rounded-r-none border-l border-y border-r-0",
        middle: "rounded-none border-l border-y border-r-0",
        right: "rounded-r-md rounded-l-none border",
      },
    },
    defaultVariants: {
      side: "generic",
    },
  }
);
