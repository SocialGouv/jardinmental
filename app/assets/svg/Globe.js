import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
        <Circle cx={36} cy={36} r={28} />
        <Path d="M36 8v56c-8.6 0-15.5-12.5-15.5-28S27.4 8 36 8s15.5 12.5 15.5 28S44.6 64 36 64M64 36H8M60 22H12M60 50H12" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
