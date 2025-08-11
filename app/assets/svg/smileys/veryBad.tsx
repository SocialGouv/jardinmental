import { iconColors } from "@/utils/constants";
import Svg, { Path } from "react-native-svg";

export default function SmileyVeryBad({ width = 25, height = 26 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 27 28" fill="none">
      <Path
        d="M17.8826 18.3826C17.8826 18.3826 16.2391 16.1913 13.5 16.1913C10.7608 16.1913 9.11737 18.3826 9.11737 18.3826M18.9782 10.976C18.5455 11.5074 17.9538 11.8087 17.3348 11.8087C16.7157 11.8087 16.1405 11.5074 15.6913 10.976M11.3087 10.976C10.8759 11.5074 10.2842 11.8087 9.6652 11.8087C9.04615 11.8087 8.47094 11.5074 8.02172 10.976M24.4565 14C24.4565 20.0511 19.5511 24.9565 13.5 24.9565C7.44886 24.9565 2.54346 20.0511 2.54346 14C2.54346 7.94886 7.44886 3.04346 13.5 3.04346C19.5511 3.04346 24.4565 7.94886 24.4565 14Z"
        stroke={iconColors.veryBad}
        strokeWidth={2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
