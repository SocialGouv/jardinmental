import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function Potion({ color, width, height }: { color?: string; width?: string; height?: string }) {
  return (
    <Svg width={width || "32"} height={height || "33"} viewBox="0 0 32 33" fill="none">
      <G clip-path="url(#clip0_18343_77936)">
        <Path
          d="M14.6667 9.97271V13.0797C14.6667 13.2244 14.6667 13.2968 14.6446 13.3544C14.6238 13.4087 14.5962 13.4482 14.5524 13.4864C14.5059 13.5269 14.4306 13.5545 14.2801 13.6097C12.3659 14.3109 11 16.1489 11 18.306C11 21.0674 13.2386 23.306 16 23.306C18.7614 23.306 21 21.0674 21 18.306C21 16.1489 19.6341 14.3109 17.7199 13.6097C17.5694 13.5545 17.4941 13.5269 17.4476 13.4864C17.4038 13.4482 17.3762 13.4087 17.3554 13.3544C17.3333 13.2968 17.3333 13.2244 17.3333 13.0797V9.97271M13.6667 9.97266H18.3333"
          stroke={color || "#006386"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18343_77936">
          <Rect width="16" height="16" fill="white" transform="translate(8 8.63965)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
