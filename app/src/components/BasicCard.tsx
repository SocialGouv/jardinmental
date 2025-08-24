import { mergeClassNames } from "@/utils/className";
import { ReactNode } from "react";
import { View, Text } from "react-native";

export default function BasicCard({ children, completed }: { children: ReactNode; completed?: Boolean }) {
  return (
    <View
      className={mergeClassNames(
        "p-4 py-8 rounded-2xl w-full mb-8 border border-1",
        completed ? "bg-cnam-primary-25 border-gray-700" : "bg-cnam-primary-50 border-cnam-cyan-600-darken-20"
      )}
    >
      {children}
    </View>
  );
}
