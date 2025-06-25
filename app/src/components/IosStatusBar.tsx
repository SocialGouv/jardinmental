import { colors } from "@/utils/colors";
import { View } from "react-native";

const IosStatusBarColor = ({ color }: { color?:string }) => <View
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Covers status bar area and a bit more
    backgroundColor: color ?? colors.LIGHT_BLUE,
    zIndex: -1,
  }}
/>
export default IosStatusBarColor