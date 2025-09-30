import Svg, { Path } from "react-native-svg";

export default function HeadphonesIcon({ color, width = 25, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M17.5 15V10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10V15M4.58333 17.5C3.43274 17.5 2.5 16.5673 2.5 15.4167V13.75C2.5 12.5994 3.43274 11.6667 4.58333 11.6667C5.73393 11.6667 6.66667 12.5994 6.66667 13.75V15.4167C6.66667 16.5673 5.73393 17.5 4.58333 17.5ZM15.4167 17.5C14.2661 17.5 13.3333 16.5673 13.3333 15.4167V13.75C13.3333 12.5994 14.2661 11.6667 15.4167 11.6667C16.5673 11.6667 17.5 12.5994 17.5 13.75V15.4167C17.5 16.5673 16.5673 17.5 15.4167 17.5Z"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
