import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg width={20} height={27} viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M10 0C8.355 0 7 1.355 7 3H3C1.355 3 0 4.355 0 6v18c0 1.645 1.355 3 3 3h14c1.645 0 3-1.355 3-3V6c0-1.645-1.355-3-3-3h-4c0-1.645-1.355-3-3-3zm0 2c.564 0 1 .436 1 1 0 .564-.436 1-1 1-.564 0-1-.436-1-1 0-.564.436-1 1-1zM3 5h4v1a1 1 0 001 1h4a1 1 0 001-1V5h4c.565 0 1 .435 1 1v18c0 .565-.435 1-1 1H3c-.565 0-1-.435-1-1V6c0-.565.435-1 1-1zm3 6a1 1 0 100 2h4a1 1 0 100-2H6zm8 0a1 1 0 100 2 1 1 0 000-2zm-8 4a1 1 0 100 2h4a1 1 0 100-2H6zm8 0a1 1 0 100 2 1 1 0 000-2zm-8 4a1 1 0 100 2h4a1 1 0 100-2H6zm8 0a1 1 0 100 2 1 1 0 000-2z"
        fill="currentColor"
      />
    </Svg>
  );
}

export default SvgComponent;
