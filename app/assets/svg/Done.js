import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent({color, backgroundColor, ...props}) {
  return (
    <Svg
      width={48}
      height={48}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      {/* <Path
        d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24z"
        fill={backgroundColor}
      /> */}
      <Path
        d="M17 25l4 4 10-10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
