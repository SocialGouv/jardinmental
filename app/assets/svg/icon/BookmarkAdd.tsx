import Svg, { Path } from "react-native-svg";

export default function BookmarkAdded({ color, width = 25, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 10.8333V5.83333M7.50002 8.33333H12.5M15.8334 17.5V6.5C15.8334 5.09987 15.8334 4.3998 15.5609 3.86502C15.3212 3.39462 14.9387 3.01217 14.4683 2.77248C13.9336 2.5 13.2335 2.5 11.8334 2.5H8.16669C6.76656 2.5 6.06649 2.5 5.53171 2.77248C5.06131 3.01217 4.67885 3.39462 4.43917 3.86502C4.16669 4.3998 4.16669 5.09987 4.16669 6.5V17.5L10 14.1667L15.8334 17.5Z"
        stroke={color || "#518B9A"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
