import { Svg, Path } from "react-native-svg";

export default function MenuIcon({ width = 16, height = 16, color = "#3D6874", strokeWidth = 1.5, ...props }) {
  return (
    <Svg width={width || "20"} height={height || "20"} viewBox="0 0 20 20" fill="none">
      <Path d="M2.5 10H12.5M2.5 5H17.5M2.5 15H17.5" stroke={color || "#3D6874"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
