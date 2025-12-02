import Svg, { Path } from "react-native-svg";

export default function MapIcon({ color, width = 24, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.00001 12L1.33334 14.6667V4.00004L6.00001 1.33337M6.00001 12L10.6667 14.6667M6.00001 12V1.33337M10.6667 14.6667L14.6667 12V1.33337L10.6667 4.00004M10.6667 14.6667V4.00004M10.6667 4.00004L6.00001 1.33337"
        stroke={"#3D6874"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
