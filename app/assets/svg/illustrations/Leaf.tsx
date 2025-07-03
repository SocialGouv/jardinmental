import Svg, { Path } from "react-native-svg";

export default function Leaf({ style, width, height, color }: { style: any, width?: number, height?: number, color?: string }) {
    return <Svg
        style={style}
        width={width || "234"} height={height || "240"} viewBox="0 0 234 240" fill="none">
        <Path d="M0.625429 239.585C82.025 238.761 317.787 90.6932 202.241 13.9212C86.6954 -62.8507 59.9068 211.371 0.625429 239.585Z"
        fill={color || "#FCEBD9"} />
    </Svg>
}