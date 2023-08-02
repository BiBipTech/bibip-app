import { useTailwind } from "nativewind";

export const useTailwindColor = (className: string) => {
  const color = useTailwind({ className }) as { backgroundColor: string }[];
  return color[0].backgroundColor;
};
