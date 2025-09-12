import Svg, { Path } from "react-native-svg";

export default function ThumbsUpIcon({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <Svg width={width || "21"} height={height || "21"} viewBox="0 0 21 21" fill="none">
      <Path
        d="M6.33335 18.8332V9.6665M2.16669 11.3332V17.1665C2.16669 18.087 2.91288 18.8332 3.83335 18.8332H15.0219C16.2558 18.8332 17.3052 17.9329 17.4928 16.7133L18.3903 10.88C18.6232 9.36558 17.4515 7.99984 15.9193 7.99984H13C12.5398 7.99984 12.1667 7.62674 12.1667 7.1665V4.22137C12.1667 3.0865 11.2467 2.1665 10.1118 2.1665C9.84113 2.1665 9.59584 2.32592 9.4859 2.57327L6.5533 9.17162C6.41955 9.47256 6.12112 9.6665 5.79179 9.6665H3.83335C2.91288 9.6665 2.16669 10.4127 2.16669 11.3332Z"
        stroke={color || "#799092"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
