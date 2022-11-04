import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 20.5c-5.523 0-10-4.477-10-10S4.477.5 10 .5s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16.001A8 8 0 0010 18.5zm-1-5h2v2H9v-2zm0-8h2v6H9v-6z"
        fill="#000091"
      />
    </Svg>
  );
}

export default SvgComponent;
