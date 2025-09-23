import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function ArrowUpSvg({
  color,
  style,
  width = 20,
  height = 20,
}: {
  color?: string;
  style?: ViewStyle;
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" style={style}>
      <Path d="M15 12.5L10 7.5L5 12.5" stroke={color || "#3D6874"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
