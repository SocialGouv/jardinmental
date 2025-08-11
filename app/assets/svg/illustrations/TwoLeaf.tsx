import Svg, { Path } from "react-native-svg";

export default function TwoLeaf({ style, width, height, color }: { style: any; width?: number; height?: number; color?: string }) {
  return (
    <Svg style={style} pointerEvents="box-none" width={width || "219"} height={height || "164"} viewBox="0 0 234 240" fill="none">
      <Path
        d="M210.046 162.777C146.505 174.645 -59.9213 95.5243 18.2965 17.9578C96.5144 -59.6087 159.527 149.907 210.046 162.777Z"
        fill={color || "#FCEBD9"}
      />
      <Path
        d="M209.214 163.322C184.351 145.88 143.101 50.5555 194.851 51.34C246.601 52.1244 196.938 142.126 209.214 163.322Z"
        fill={color || "#FCEBD9"}
      />
    </Svg>
  );
}
