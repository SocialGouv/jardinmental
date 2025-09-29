import Svg, { Path } from "react-native-svg";

const CloudIcon = ({ width = 25, height = 24, color = "#E0EFF3" }: { width?: number; height?: number; color?: string }) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill={"none"}>
    <Path
      d="M6.75 19C4.26472 19 2.25 16.9853 2.25 14.5C2.25 12.1564 4.04151 10.2313 6.32974 10.0194C6.79781 7.17213 9.27024 5 12.25 5C15.2298 5 17.7022 7.17213 18.1703 10.0194C20.4585 10.2313 22.25 12.1564 22.25 14.5C22.25 16.9853 20.2353 19 17.75 19C13.3602 19 10.5933 19 6.75 19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CloudIcon;
