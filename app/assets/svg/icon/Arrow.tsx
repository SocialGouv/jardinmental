import Svg, { Path } from "react-native-svg";

export default function ArrowIcon({ color }: { color?: string }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M3.33301 10H16.6663M16.6663 10L11.6663 5M16.6663 10L11.6663 15"
        stroke={color || "#134449"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
