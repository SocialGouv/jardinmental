import { mergeClassNames } from "@/utils/className";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CheckMarkIcon({ color, className, width, height }: { color?: string; className?: string; width?: number; height?: number }) {
  return (
    <View className={mergeClassNames("ml-2 mr-2 p-2 flex", className)}>
      <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
        <Path
          d="M16.6668 5.00052L7.50016 14.1672L3.3335 10.0005"
          stroke={color ?? "#093F43"}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
