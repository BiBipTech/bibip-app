import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "px-6 py-2 mt-2 items-center justify-center rounded-md",
  {
    variants: {
      intent: {
        primary: "bg-bibip-green-500",
        secondary: "border-bibip-green-600 border bg-bibip-green-50",
        danger: "",
      },
      disabled: {
        true: "bg-bibip-green-300",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
      disabled: false,
    },
  }
);

export const textStyles = cva("text-center text-lg font-bold", {
  variants: {
    intent: {
      primary: "text-white",
      secondary: "text-bibip-green-600",
      danger: "",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});
