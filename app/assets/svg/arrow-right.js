import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/utils/colors";

function SvgComponent(props) {
  return (
    <Svg color={colors.LIGHT_BLUE} width={8} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M.29 11.543L5.367 6.5.29 1.459 1.46.295 7.71 6.5l-6.248 6.205L.29 11.543z" fill="currentColor" />
    </Svg>
  );
}

export default SvgComponent;
