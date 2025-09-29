import Svg, { Path } from "react-native-svg";

const WaveIcon = ({ width = 25, height = 24, color = "#E0EFF3" }: { width?: number; height?: number; color?: string }) => (
  <Svg width={width} height={height} viewBox="0 0 25 24">
    <Path
      d="M2.75 6C3.35 6.5 3.95 7 5.25 7C7.75 7 7.75 5 10.25 5C11.55 5 12.15 5.5 12.75 6C13.35 6.5 13.95 7 15.25 7C17.75 7 17.75 5 20.25 5C21.55 5 22.15 5.5 22.75 6M2.75 18C3.35 18.5 3.95 19 5.25 19C7.75 19 7.75 17 10.25 17C11.55 17 12.15 17.5 12.75 18C13.35 18.5 13.95 19 15.25 19C17.75 19 17.75 17 20.25 17C21.55 17 22.15 17.5 22.75 18M2.75 12C3.35 12.5 3.95 13 5.25 13C7.75 13 7.75 11 10.25 11C11.55 11 12.15 11.5 12.75 12C13.35 12.5 13.95 13 15.25 13C17.75 13 17.75 11 20.25 11C21.55 11 22.15 11.5 22.75 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default WaveIcon;
