import Svg, { Path } from "react-native-svg";

export default function CrossIcon({
  color,
  width,
  height,
  strokeWidth = 2.25,
}: {
  color: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  return (
    <Svg width={width || 15} height={height || 16} viewBox="0 0 15 16" fill="none">
      <Path d="M11.25 4.25L3.75 11.75M3.75 4.25L11.25 11.75" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
