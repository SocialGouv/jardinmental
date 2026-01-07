import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function ClocksIcon({ color, width = 16, height = 16 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <G clip-path="url(#clip0_25208_27750)">
        <Path
          d="M7.99992 4.00001V8.00001L10.6666 9.33334M14.6666 8.00001C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00001C1.33325 4.31811 4.31802 1.33334 7.99992 1.33334C11.6818 1.33334 14.6666 4.31811 14.6666 8.00001Z"
          stroke={color || "#3D6874"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_25208_27750">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
