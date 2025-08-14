import * as React from "react";
import Svg, { Path } from "react-native-svg";

const TriangleWithBorderTop = (props) => (
  <Svg viewBox="0 0 100 100" width={10} height={10} {...props}>
    <Path fill="currentColor" d="M0 100h100L50 25z" />
    <Path stroke={props.borderColor || "#000"} strokeWidth={props.strokeWidth || 6} d="m0 100 50-75 50 75-50-75" />
  </Svg>
);

export default TriangleWithBorderTop;
