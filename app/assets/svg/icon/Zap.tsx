import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";

export default function Zap({
    color
}: {
    color: string
}) {
    return <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <Path d="M10.8335 1.6665L3.41142 10.573C3.12075 10.9219 2.97541 11.0963 2.97319 11.2436C2.97126 11.3716 3.02832 11.4934 3.12792 11.5739C3.2425 11.6665 3.46952 11.6665 3.92357 11.6665H10.0002L9.16688 18.3332L16.589 9.42663C16.8797 9.07782 17.025 8.90341 17.0272 8.75612C17.0292 8.62807 16.9721 8.50625 16.8725 8.42576C16.7579 8.33317 16.5309 8.33317 16.0768 8.33317H10.0002L10.8335 1.6665Z"
            stroke={color || "#617778"}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <Defs>
            <ClipPath id="clip0_17492_3192">
                <Rect width="20" height="20" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
}
