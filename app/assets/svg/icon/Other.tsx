import Svg, { Path } from "react-native-svg";

export default function Other({ color }: { color: string }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.00004 8.66699C8.36823 8.66699 8.66671 8.36851 8.66671 8.00033C8.66671 7.63214 8.36823 7.33366 8.00004 7.33366C7.63185 7.33366 7.33337 7.63214 7.33337 8.00033C7.33337 8.36851 7.63185 8.66699 8.00004 8.66699Z"
        stroke={color || "#134449"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8.00004 4.00033C8.36823 4.00033 8.66671 3.70185 8.66671 3.33366C8.66671 2.96547 8.36823 2.66699 8.00004 2.66699C7.63185 2.66699 7.33337 2.96547 7.33337 3.33366C7.33337 3.70185 7.63185 4.00033 8.00004 4.00033Z"
        stroke={color || "#134449"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8.00004 13.3337C8.36823 13.3337 8.66671 13.0352 8.66671 12.667C8.66671 12.2988 8.36823 12.0003 8.00004 12.0003C7.63185 12.0003 7.33337 12.2988 7.33337 12.667C7.33337 13.0352 7.63185 13.3337 8.00004 13.3337Z"
        stroke={color || "#134449"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
