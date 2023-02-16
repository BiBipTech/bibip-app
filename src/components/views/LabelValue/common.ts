import { cva } from "class-variance-authority";

export const labelStyle = cva("text-gray-400 font-regular text-xl", {
  variants: {
    labelSize: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    },
    labelWeight: {
      light: "font-light",
      regular: "font-regular",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    labelSize: "small",
    labelWeight: "regular",
  },
});

export const valueStyle = cva("text-gray-700 font-bold text-xl", {
  variants: {
    valueSize: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    },
    valueWeight: {
      light: "font-light",
      regular: "font-regular",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    valueSize: "small",
    valueWeight: "bold",
  },
});
