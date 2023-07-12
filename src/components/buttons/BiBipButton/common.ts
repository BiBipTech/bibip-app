import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "px-6 py-3 h-min mt-1 items-center justify-center rounded-md flex-row border-bibip-green-500 border",
  {
    variants: {
      intent: {
        primary: "bg-bibip-green-500",
        secondary: "border-bibip-green-400 border bg-white",
        primaryBlue: "bg-bibip-blue-500",
        secondaryBlue: "border-0 bg-white",
        danger: "",
      },
      mini: {
        true: "px-2 py-1",
      },
      isDisabled: {
        true: "",
      },
      fullWidth: {
        true: "w-full",
      },
      alignment: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
      buttonCount: {
        1: "",
        2: "w-9/20",
        3: "",
      },
      rounding: {
        small: "rounded-md",
        medium: "rounded-lg",
        large: "rounded-xl",
      },
      fullHeight: {
        true: "h-full",
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        isDisabled: true,
        className: "bg-bibip-green-300 border-bibip-green-300",
      },
      {
        intent: "secondary",
        isDisabled: true,
        className: "border-bibip-green-300",
      },
    ],
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
      isDisabled: false,
      fullHeight: false,
      alignment: "center",
      rounding: "small",
      buttonCount: 1,
      mini: false,
    },
  }
);

export const textStyles = cva("text-center text-lg", {
  variants: {
    intent: {
      primary: "text-white",
      secondary: "text-bibip-green-600",
      primaryBlue: "text-white",
      secondaryBlue: "text-bibip-blue-500 border bg-white",
      danger: "",
    },
    fontSize: {
      small: "text-base",
      medium: "text-lg",
      large: "text-2xl",
      mini: "text-xs",
    },
    fontWeight: {
      bold: "font-bold",
      light: "font-light",
      regular: "",
    },
    isDisabled: {
      true: "",
    },
  },
  compoundVariants: [
    {
      intent: "secondary",
      isDisabled: true,
      className: "text-bibip-green-300",
    },
  ],
  defaultVariants: {
    intent: "primary",
    fontSize: "medium",
    fontWeight: "regular",
  },
});
