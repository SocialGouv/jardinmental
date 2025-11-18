import { mergeClassNames } from "@/utils/className";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { SquircleView } from "expo-squircle-view";

export default function BeigeCard({
  children,
  style,
  color = "#FCEBD9",
  bottomComponent,
}: {
  children: ReactNode;
  style?: ViewStyle;
  color?: string;
  bottomComponent?: ReactNode;
}) {
  return (
    <View className="flex-1 justify-center items-center p-4" style={style}>
      <SquircleView
        className={mergeClassNames("bg-white py-10 px-6 w-full rounded-xl")}
        cornerSmoothing={100}
        preserveSmoothing={true}
        style={{
          borderRadius: 20,
          borderColor: color,
          borderWidth: 1,
        }}
      >
        {children}
      </SquircleView>
      {bottomComponent}
    </View>
  );
}
