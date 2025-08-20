import { ReactNode } from "react";
import { View, Text } from "react-native";

export default function BasicCard({ children }: { children: ReactNode }) {
  return <View className="p-4 py-8 rounded-xl bg-cnam-primary-50 w-full mb-8 border border-1 border-gray-400">{children}</View>;
}
