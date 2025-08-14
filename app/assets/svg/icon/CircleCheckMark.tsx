import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function CircleCheckMark() {
  return (
    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <G clip-path="url(#clip0_17585_11417)">
        <Path
          d="M4.99967 8.49967L6.99967 10.4997L10.9997 6.49967M14.6663 8.49967C14.6663 12.1816 11.6816 15.1663 7.99967 15.1663C4.31778 15.1663 1.33301 12.1816 1.33301 8.49967C1.33301 4.81778 4.31778 1.83301 7.99967 1.83301C11.6816 1.83301 14.6663 4.81778 14.6663 8.49967Z"
          stroke="#12747D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_17585_11417">
          <Rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
