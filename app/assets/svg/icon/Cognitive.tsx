import Svg, { Path, G, Defs, Rect, ClipPath } from "react-native-svg";

export default function Cognitive({ color }: { color: string }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <G clip-path="url(#clip0_17492_732)">
        <Path
          d="M9.99984 18.3332C14.6022 18.3332 18.3332 14.6022 18.3332 9.99984C18.3332 5.39746 14.6022 1.6665 9.99984 1.6665C5.39746 1.6665 1.6665 5.39746 1.6665 9.99984C1.6665 14.6022 5.39746 18.3332 9.99984 18.3332Z"
          stroke={color || "#617778"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_17492_732">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
