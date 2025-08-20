import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { View, Text } from "react-native";

interface AlertBannerProps {
  text: string;
}

export default ({ text }: AlertBannerProps) => {
  return (
    <View className={"bg-cnam-jaune-100 py-3 px-2 mb-1"} role="alert" accessibilityRole="text">
      <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-jaune-900")} accessibilityLabel={text}>
        {text}
      </Text>
    </View>
  );
};
