import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "rounded-full flex justify-center items-center shadow-md",
  {
    variants: {
      buttonSize: {
        small: "w-10 h-10",
        medium: "w-14 h-14",
        large: "w-20 h-20",
      },
      intent: {
        primary: "bg-cyan-500",
        inverted: "bg-white",
        danger: "bg-transparent",
      },
    },
    defaultVariants: {
      buttonSize: "small",
      intent: "primary",
    },
  }
);
