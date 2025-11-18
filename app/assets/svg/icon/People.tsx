import Svg, { Path, Rect } from "react-native-svg";

export default function PeopleIcon() {
  return (
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Rect width="48" height="48" rx="24" fill="#E5F6FC" />
      <Path
        d="M17.25 30C19.0018 28.1419 21.3803 27 24 27C26.6197 27 28.9982 28.1419 30.75 30M27.375 20.625C27.375 22.489 25.864 24 24 24C22.136 24 20.625 22.489 20.625 20.625C20.625 18.761 22.136 17.25 24 17.25C25.864 17.25 27.375 18.761 27.375 20.625Z"
        stroke="#006386"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
