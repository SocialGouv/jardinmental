import Svg, { Path } from "react-native-svg";

export default function ThoughtIcon({
    color
}: { color: string }) {
    return <Svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <Path d="M1 2C1.6 2.5 2.2 3 3.5 3C6 3 6 1 8.5 1C9.8 1 10.4 1.5 11 2C11.6 2.5 12.2 3 13.5 3C16 3 16 1 18.5 1C19.8 1 20.4 1.5 21 2M1 14C1.6 14.5 2.2 15 3.5 15C6 15 6 13 8.5 13C9.8 13 10.4 13.5 11 14C11.6 14.5 12.2 15 13.5 15C16 15 16 13 18.5 13C19.8 13 20.4 13.5 21 14M1 8C1.6 8.5 2.2 9 3.5 9C6 9 6 7 8.5 7C9.8 7 10.4 7.5 11 8C11.6 8.5 12.2 9 13.5 9C16 9 16 7 18.5 7C19.8 7 20.4 7.5 21 8"
            stroke={color || "#FAFFFF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </Svg>
}
