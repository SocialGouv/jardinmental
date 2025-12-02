import Svg, { Path } from "react-native-svg";

export default function Bookmark({ color, width = 25, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M15.8334 17.5L10 13.3333L4.16669 17.5V4.16667C4.16669 3.72464 4.34228 3.30072 4.65484 2.98816C4.9674 2.67559 5.39133 2.5 5.83335 2.5H14.1667C14.6087 2.5 15.0326 2.67559 15.3452 2.98816C15.6578 3.30072 15.8334 3.72464 15.8334 4.16667V17.5Z"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
