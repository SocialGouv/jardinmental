import { colors } from "@/utils/colors";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import { View } from "react-native";

export default function Chevron() {
  return (
    <View
      style={{
        transform: [{ rotate: "180deg" }],
      }}
    >
      <ArrowUpSvg color={colors.BLUE} />
    </View>
  );
}
