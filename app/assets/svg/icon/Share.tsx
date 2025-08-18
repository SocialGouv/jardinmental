import Svg, { Path } from "react-native-svg";

export default function ShareIcon({ color, width = 14, height = 16 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M5.72667 9.00683L10.28 11.6602M10.2733 4.34016L5.72667 6.9935M14 3.3335C14 4.43807 13.1046 5.3335 12 5.3335C10.8954 5.3335 10 4.43807 10 3.3335C10 2.22893 10.8954 1.3335 12 1.3335C13.1046 1.3335 14 2.22893 14 3.3335ZM6 8.00016C6 9.10473 5.10457 10.0002 4 10.0002C2.89543 10.0002 2 9.10473 2 8.00016C2 6.89559 2.89543 6.00016 4 6.00016C5.10457 6.00016 6 6.89559 6 8.00016ZM14 12.6668C14 13.7714 13.1046 14.6668 12 14.6668C10.8954 14.6668 10 13.7714 10 12.6668C10 11.5623 10.8954 10.6668 12 10.6668C13.1046 10.6668 14 11.5623 14 12.6668Z"
        stroke={color || "#354445"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
