import { mergeClassNames } from "@/utils/className";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

export default function BeigeCard({ children, style, color = "#FCEBD9" }: { children: ReactNode; style?: ViewStyle; color?: string }) {
  return (
    <View className="flex-1 justify-center items-center p-4" style={style}>
      <View
        style={{
          borderColor: color, // the pastel color of our chart didn't work with nativewind
        }}
        className={mergeClassNames("bg-white p-8 px-6 w-full border rounded-xl")}
      >
        {children}
      </View>
    </View>
  );
}
