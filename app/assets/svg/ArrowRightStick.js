import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgComponent = (props) => (
  <Svg width={21} height={12} viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M16.198 0c-.178-.004-.34.128-.412.33a.648.648 0 0 0 .09.599l3.49 4.529H.443c-.157-.002-.304.1-.383.27a.656.656 0 0 0 0 .55c.079.17.226.272.383.27h18.923l-3.49 4.53a.644.644 0 0 0 .014.77c.175.209.451.202.619-.017L21 6.003 16.509.175A.408.408 0 0 0 16.198 0Z"
      fill="currentColor"
    />
  </Svg>
);

export default SvgComponent;
