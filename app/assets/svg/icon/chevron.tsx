import Svg, { Path } from "react-native-svg";

export default function ChevronIcon({ color }: { color?: string }) {
  return (
    <Svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <Path d="M6.5 11L1.5 6L6.5 1" stroke={color || "#3D6874"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
