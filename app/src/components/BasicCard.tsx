import { mergeClassNames } from "@/utils/className";
import { ReactNode } from "react";
import { View, Text } from "react-native";
import { SquircleView } from "expo-squircle-view";
import { TW_COLORS } from "@/utils/constants";

export default function BasicCard({ children, completed }: { children: ReactNode; completed?: Boolean }) {
  return (
    <SquircleView
      className={mergeClassNames(
        "p-4 py-8 w-full mb-8",
        completed ? "bg-cnam-primary-25 border-gray-700" : "bg-cnam-primary-50 border-cnam-cyan-600-darken-20"
      )}
      cornerSmoothing={100} // 0-100
      preserveSmoothing={true} // false matches figma, true has more rounding
      style={{
        borderRadius: 20,
        borderColor: TW_COLORS.GRAY_400,
        borderWidth: 1,
      }}
    >
      {children}
    </SquircleView>
  );
}
