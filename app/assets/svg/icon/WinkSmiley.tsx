import Svg, { Path } from "react-native-svg";

export default function WinkSmileyIcon({
    color
}: {
    color: string
}) {
    return <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path d="M7 13C7 13 8.5 15 11 15C13.5 15 15 13 15 13M14 8H14.01M7 8H9M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11ZM14.5 8C14.5 8.27614 14.2761 8.5 14 8.5C13.7239 8.5 13.5 8.27614 13.5 8C13.5 7.72386 13.7239 7.5 14 7.5C14.2761 7.5 14.5 7.72386 14.5 8Z"
            stroke={color || "#21896B"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </Svg>
}
