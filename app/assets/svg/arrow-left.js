import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/utils/colors";

function SvgComponent(props) {
  return (
    <Svg color={colors.LIGHT_BLUE} width={8} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.71 1.457L2.633 6.5l5.077 5.041-1.171 1.164L.29 6.5 6.538.296 7.71 1.457z"
        fill="currentColor"
      />
    </Svg>
  );
}

export default SvgComponent;
