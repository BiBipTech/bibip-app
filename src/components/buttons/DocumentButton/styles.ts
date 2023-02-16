import { cva } from "class-variance-authority";
import { Ionicons } from "@expo/vector-icons";

export const buttonStyles = cva(
  "py-4 w-full flex flex-row items-center justify-center mb-1 rounded-xl",
  {
    variants: {
      intent: {
        notConfirmed: "bg-bibip-red-500",
        waiting: "bg-bibip-yellow-600",
        confirmed: "bg-bibip-green-500",
      },
      isDisabled: {
        true: "opacity-50",
      },
    },
    defaultVariants: {
      intent: "notConfirmed",
    },
  }
);

export const iconNames = (
  intent: "confirmed" | "waiting" | "notConfirmed" | null | undefined
): keyof typeof Ionicons.glyphMap => {
  if (intent === "confirmed") return "checkmark";
  else if (intent === "waiting") return "hourglass-outline";
  else if (intent === "notConfirmed") return "close";
  else return "close";
};
