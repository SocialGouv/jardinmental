import Svg, { Path, Rect } from "react-native-svg";

export default function OrganisationIcon() {
  return (
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Rect width="48" height="48" rx="24" fill="#E5F6FC" />
      <Path
        d="M17.25 30.7499H30.75M19.5 28.4999V22.4999M22.5 28.4999V22.4999M25.5 28.4999V22.4999M28.5 28.4999V22.4999M30 20.2499L24.318 16.6987C24.2026 16.6266 24.145 16.5905 24.0831 16.5765C24.0284 16.564 23.9716 16.564 23.9169 16.5765C23.855 16.5905 23.7974 16.6266 23.682 16.6987L18 20.2499H30Z"
        stroke="#006386"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
