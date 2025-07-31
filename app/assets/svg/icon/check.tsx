import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CheckMarkIcon({
    color
}: {
    color?: string
}) {
    return <View className={'ml-2 mr-2 p-2'}><Svg
        width="20"
        height="20" viewBox="0 0 20 20" fill="none">
        <Path d="M16.6668 5.00052L7.50016 14.1672L3.3335 10.0005"
            stroke={color ?? "#093F43"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </Svg></View>
}