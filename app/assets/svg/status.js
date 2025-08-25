import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M18.695 12.178l1.605 4.24h3.125a.766.766 0 01.54 1.336l-2.709 1.89 1.502 3.453a.819.819 0 01-1.165 1.023l-3.635-2.043-3.632 2.043a.819.819 0 01-1.166-1.023l1.504-3.452-2.709-1.89a.765.765 0 01.537-1.337h3.125l1.608-4.24a.834.834 0 011.47 0zM5.469 10.949H12.5M5.469 14.855h2.343M5.469 18.762h2.343"
        stroke="currentColor"
        strokeWidth={1.563}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.375 24.23H2.344A1.563 1.563 0 01.78 22.668V6.26A1.562 1.562 0 012.344 4.7H6.25a3.906 3.906 0 117.813 0h3.906a1.562 1.562 0 011.562 1.562v2.344"
        stroke="currentColor"
        strokeWidth={1.563}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.156 3.918a.39.39 0 110 .781.39.39 0 010-.781"
        stroke="currentColor"
        strokeWidth={1.563}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
