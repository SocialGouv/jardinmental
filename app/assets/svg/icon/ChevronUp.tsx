import Svg, { Path } from "react-native-svg";

export default function ChevronUp({ color }) {
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <Path d="M15.5 12.5L10.5 7.5L5.5 12.5" stroke={color || "#158993"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
