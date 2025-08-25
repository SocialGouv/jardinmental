import Svg, { Path, Defs, ClipPath, G, Rect } from "react-native-svg";

export default function Target({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <Svg width={width || "16"} height={height || "16"} viewBox="0 0 16 16" fill="none">
      <G clip-path="url(#clip0_18844_4314)">
        <Path
          d="M14.6666 7.99967H11.9999M3.99992 7.99967H1.33325M7.99992 3.99967V1.33301M7.99992 14.6663V11.9997M13.3333 7.99967C13.3333 10.9452 10.9454 13.333 7.99992 13.333C5.0544 13.333 2.66659 10.9452 2.66659 7.99967C2.66659 5.05416 5.0544 2.66634 7.99992 2.66634C10.9454 2.66634 13.3333 5.05416 13.3333 7.99967ZM9.99992 7.99967C9.99992 9.10424 9.10449 9.99967 7.99992 9.99967C6.89535 9.99967 5.99992 9.10424 5.99992 7.99967C5.99992 6.89511 6.89535 5.99967 7.99992 5.99967C9.10449 5.99967 9.99992 6.89511 9.99992 7.99967Z"
          stroke={color || "#134449"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18844_4314">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
