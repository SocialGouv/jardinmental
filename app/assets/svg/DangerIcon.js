import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg width={28} height={24} viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M13.89.04c-.746 0-1.492.349-1.909 1.049L.333 20.602C-.526 22.039.573 24 2.239 24h23.299c1.666 0 2.767-1.961 1.909-3.398L15.798 1.089c-.417-.7-1.163-1.05-1.908-1.05zm0 3.025l10.906 18.268H2.984L13.89 3.065zM12.566 8v6.667h2.648V8h-2.648zm0 9.333V20h2.648v-2.667h-2.648z"
        fill="#FEAA5B"
      />
    </Svg>
  );
}

export default SvgComponent;
