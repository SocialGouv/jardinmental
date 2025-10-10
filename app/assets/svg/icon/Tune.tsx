import Svg, { Path } from "react-native-svg";

export default function Tune({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.5 6.66669L12.5 6.66669M12.5 6.66669C12.5 8.0474 13.6193 9.16669 15 9.16669C16.3807 9.16669 17.5 8.0474 17.5 6.66669C17.5 5.28598 16.3807 4.16669 15 4.16669C13.6193 4.16669 12.5 5.28598 12.5 6.66669ZM7.5 13.3334L17.5 13.3334M7.5 13.3334C7.5 14.7141 6.38071 15.8334 5 15.8334C3.61929 15.8334 2.5 14.7141 2.5 13.3334C2.5 11.9526 3.61929 10.8334 5 10.8334C6.38071 10.8334 7.5 11.9526 7.5 13.3334Z"
        stroke={color || "#FAFDFD"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
