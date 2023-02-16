import { useTailwind } from "nativewind";

const useCustomTailwind = <T>(className: string): T => {
  return useTailwind({ className: className }) as T;
};

export default useCustomTailwind;
