import Svg, { Path } from "react-native-svg";

export default function ParagraphSpacing({ color, width, height }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width || "24"} height={height || "24"} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10H13M21 6H13M21 14H13M21 18H13M6 20L6 4M6 20L3 17M6 20L9 17M6 4L3 7M6 4L9 7"
        stroke={color || "#518B9A"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
