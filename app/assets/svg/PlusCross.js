import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgComponent = (props) => (
  <Svg width={14} height={15} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M7.96 2.325a.964.964 0 0 0-1.928 0v10.634a.964.964 0 0 0 1.928 0V2.325Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.042}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.68 6.678a.964.964 0 1 0 0 1.928h10.633a.964.964 0 0 0 0-1.928H1.68Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.042}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgComponent;
