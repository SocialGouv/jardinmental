import Svg, { Path } from "react-native-svg";

export default function HorizontalDots({ color, width, height }: { color?: string; width?: string; height?: string }) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 10.8334C10.4602 10.8334 10.8333 10.4603 10.8333 10.0001C10.8333 9.53984 10.4602 9.16675 10 9.16675C9.53977 9.16675 9.16667 9.53984 9.16667 10.0001C9.16667 10.4603 9.53977 10.8334 10 10.8334Z"
        stroke={color || "#3D6874"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M15.8333 10.8334C16.2936 10.8334 16.6667 10.4603 16.6667 10.0001C16.6667 9.53984 16.2936 9.16675 15.8333 9.16675C15.3731 9.16675 15 9.53984 15 10.0001C15 10.4603 15.3731 10.8334 15.8333 10.8334Z"
        stroke={color || "#3D6874"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4.16667 10.8334C4.62691 10.8334 5 10.4603 5 10.0001C5 9.53984 4.62691 9.16675 4.16667 9.16675C3.70643 9.16675 3.33334 9.53984 3.33334 10.0001C3.33334 10.4603 3.70643 10.8334 4.16667 10.8334Z"
        stroke={color || "#3D6874"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
