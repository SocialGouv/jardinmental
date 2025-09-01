import Svg, { Path } from "react-native-svg";

export default function StopWatchIcon({ color, width = 20, height = 21 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      <Path
        d="M10 8.41602V11.7493L12.0834 12.9993M10 4.66602C6.088 4.66602 2.91669 7.83733 2.91669 11.7493C2.91669 15.6614 6.088 18.8327 10 18.8327C13.912 18.8327 17.0834 15.6614 17.0834 11.7493C17.0834 7.83733 13.912 4.66602 10 4.66602ZM10 4.66602V2.16602M8.33335 2.16602H11.6667M16.9408 5.15938L15.6908 3.90938L16.3158 4.53438M3.0592 5.15938L4.3092 3.90938L3.6842 4.53438"
        stroke={color || "#134449"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
