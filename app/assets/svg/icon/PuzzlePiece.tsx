import Svg, { Defs, G, Path, Rect, ClipPath } from "react-native-svg";

export default function PuzzlePiece({ color, width, height }: { color: string; width?: number; height?: number }) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <G clip-path="url(#clip0_17592_674)">
        <Path
          d="M9.99984 1.6665L12.9998 4.6665C14.9998 -0.583496 20.5832 4.99984 15.3332 6.99984L18.3332 9.99984L15.3332 12.9998C13.3332 7.74984 7.74984 13.3332 12.9998 15.3332L9.99984 18.3332L6.99984 15.3332C4.99984 20.5832 -0.583496 14.9998 4.6665 12.9998L1.6665 9.99984L4.6665 6.99984C6.6665 12.2498 12.2498 6.6665 6.99984 4.6665L9.99984 1.6665Z"
          stroke={color || "#617778"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_17592_674">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
