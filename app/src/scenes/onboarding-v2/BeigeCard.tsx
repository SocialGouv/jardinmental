import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

export default function BeigeCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View className="flex-1 justify-center items-center p-4" style={style}>
      <View className={"bg-white p-8 px-6 w-full border border-[#FCEBD9]"}>{children}</View>
    </View>
  );
}
