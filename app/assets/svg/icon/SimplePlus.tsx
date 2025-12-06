import Svg, { Defs, G, Path, Rect, ClipPath } from "react-native-svg";

export default function SimplePlus({ color, width, height }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width || "16"} height={height || "16"} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.99998 3.33337V12.6667M3.33331 8.00004H12.6666"
        stroke={color || "#3D6874"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
