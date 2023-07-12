declare module "@env" {
  export const TRIP_API: string;
  export const WALLET_API: string;
  export const PBM_API: string;
}

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
