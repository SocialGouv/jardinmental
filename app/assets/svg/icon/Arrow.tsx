import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function ArrowIcon({ color, style, width = 20, height = 20 }: { color?: string; style?: ViewStyle; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" style={style}>
      <Path
        d="M3.33301 10H16.6663M16.6663 10L11.6663 5M16.6663 10L11.6663 15"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
