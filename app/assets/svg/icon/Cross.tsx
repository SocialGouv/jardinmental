import Svg, { Path } from "react-native-svg";

export default function CrossIcon({ color, width, height }: { color: string; width?: number; height?: number }) {
  return (
    <Svg width={width || 15} height={height || 16} viewBox="0 0 15 16" fill="none">
      <Path d="M11.25 4.25L3.75 11.75M3.75 4.25L11.25 11.75" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
