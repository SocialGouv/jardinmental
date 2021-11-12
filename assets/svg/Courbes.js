import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={25}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1 4h22.5v19.5H1V4z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7 6.25V1v5.25z" fill="#fff" />
      <Path
        d="M7 6.25V1"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M17.5 6.25V1v5.25z" fill="#fff" />
      <Path
        d="M17.5 6.25V1"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 17.5l.182-.728-.412-.103-.3.3.53.531zm2 .5l-.182.728.09.022H9V18zm1.5 0v.75h.416l.22-.352L10.5 18zm2.5-4l.469-.586-.658-.526-.447.714L13 14zm2.5 2l-.469.586.699.559.428-.786L15.5 16zm3.658-5.14a.75.75 0 10-1.316-.72l1.316.72zM5.03 20.53l2.5-2.5-1.06-1.06-2.5 2.5 1.06 1.06zm1.788-2.302l2 .5.364-1.456-2-.5-.364 1.456zM9 18.75h1.5v-1.5H9v1.5zm2.136-.352l2.5-4-1.272-.796-2.5 4 1.272.796zm1.396-3.812l2.5 2 .937-1.172-2.5-2-.938 1.172zm3.626 1.773l3-5.5-1.316-.718-3 5.5 1.316.718z"
        fill="currentColor"
      />
    </Svg>
  );
}

export default SvgComponent;
