import * as React from "react";
import Svg, { Ellipse, Path } from "react-native-svg";
import { colors } from "../../src/utils/colors";

function SvgComponent({ size = 15, down = false }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={"0 0 15 14"}
      rotation={down ? 180 : 0}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Ellipse cx={7.27793} cy={7} rx={7.27798} ry={7} transform="rotate(-180 7.278 7)" fill="#DFDFDF" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.479 8.91L7.143 5.678l-3.336 3.23-.77-.745 4.105-3.976 4.106 3.976-.769.745z"
        fill={colors.BLUE}
      />
    </Svg>
  );
}

export default SvgComponent;
