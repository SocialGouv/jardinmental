import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

export default function LightBulbIcon({ color, width = 16, height = 16 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_18556_5232)">
        <Path
          d="M6.66634 11.7726V13.3335C6.66634 14.0699 7.2633 14.6668 7.99967 14.6668C8.73605 14.6668 9.33301 14.0699 9.33301 13.3335V11.7726M7.99967 1.3335V2.00016M1.99967 8.00016H1.33301M3.66634 3.66683L3.26628 3.26676M12.333 3.66683L12.7332 3.26676M14.6663 8.00016H13.9997M11.9997 8.00016C11.9997 10.2093 10.2088 12.0002 7.99967 12.0002C5.79054 12.0002 3.99967 10.2093 3.99967 8.00016C3.99967 5.79102 5.79054 4.00016 7.99967 4.00016C10.2088 4.00016 11.9997 5.79102 11.9997 8.00016Z"
          stroke={color || "#354445"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18556_5232">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
