import Svg, { Path } from "react-native-svg";

export default function CloseCross({ color }: { color: string }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M15 5L5 15M5 5L15 15" stroke={color || "#FAFDFD"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
