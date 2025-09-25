// global.d.ts
/// <reference types="nativewind/types" />

// SVG module declarations
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
