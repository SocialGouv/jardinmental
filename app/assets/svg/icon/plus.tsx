import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function PlusIcon({ color }: { color?: string }) {
  return (
    <Svg className={"ml-2 mr-2 p-2"} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <G clip-path="url(#clip0_17060_507)">
        <Path
          d="M9.99984 6.66719V13.3339M6.6665 10.0005H13.3332M18.3332 10.0005C18.3332 14.6029 14.6022 18.3339 9.99984 18.3339C5.39746 18.3339 1.6665 14.6029 1.6665 10.0005C1.6665 5.39815 5.39746 1.66718 9.99984 1.66718C14.6022 1.66718 18.3332 5.39815 18.3332 10.0005Z"
          stroke={color || "#799092"}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_17060_507">
          <Rect width="20" height="20" fill="white" transform="translate(0 0.000518799)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
