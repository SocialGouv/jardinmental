import Svg, { Path } from "react-native-svg";

export default function ChevronDown({ color }) {
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <Path d="M5.5 7.5L10.5 12.5L15.5 7.5" stroke={color || "#158993"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
