import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M1.439 16.873L0 24l7.128-1.437L24.001 5.691l-5.69-5.69L1.439 16.873zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zM21.172 5.689L7.555 19.307l-2.86-2.861L15.52 5.62l2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"
      />
    </Svg>
  );
}

export default SvgComponent;
