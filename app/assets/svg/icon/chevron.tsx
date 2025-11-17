import Svg, { Path, G } from "react-native-svg";

type Direction = "left" | "right" | "up" | "down";

interface ChevronIconProps {
  color?: string;
  strokeWidth?: number;
  direction?: Direction;
}

export default function ChevronIcon({ color, strokeWidth, direction = "left" }: ChevronIconProps) {
  const getRotation = () => {
    switch (direction) {
      case "right":
        return "180";
      case "up":
        return "-90";
      case "down":
        return "90";
      case "left":
      default:
        return "0";
    }
  };

  const rotation = getRotation();

  return (
    <Svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <G origin="4, 6" rotation={rotation}>
        <Path
          d="M6.5 11L1.5 6L6.5 1"
          stroke={color || "#3D6874"}
          strokeWidth={strokeWidth || "1.66667"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
