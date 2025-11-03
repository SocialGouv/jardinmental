import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export default function InfoIcon({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width || 16} height={height || 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_22410_555)">
        <Path
          d="M7.99992 10.6666V7.99992M7.99992 5.33325H8.00659M14.6666 7.99992C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99992C1.33325 4.31802 4.31802 1.33325 7.99992 1.33325C11.6818 1.33325 14.6666 4.31802 14.6666 7.99992Z"
          stroke="#134449"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_22410_555">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
