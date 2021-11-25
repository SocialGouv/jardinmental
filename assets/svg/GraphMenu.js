import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 .125v24.75h24v-2.063H2V12.35l6.098 4.236 6.046-8.31 5.065 4.293 4.846-7.136-1.639-1.184-3.605 5.311-5.008-4.248-6.164 8.468L2 9.861V.125H0z"
        fill="currentColor"
      />
    </Svg>
  );
}

export default SvgComponent;
