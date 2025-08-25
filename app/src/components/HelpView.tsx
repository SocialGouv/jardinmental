import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import { View, Text } from "react-native";

interface Props {
  title: string;
  description: string;
  link?: string;
}

const HelpView = ({ title, description, link }: Props) => {
  return (
    <View className="flex-1 bg-white p-4 pb-16">
      <Text className={mergeClassNames(typography.textXlBold, "mb-4 text-cnam-primary-950")}>{title}</Text>
      <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>{description}</Text>
      {link && (
        <Text className="text-base text-center mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
          {link}
        </Text>
      )}
    </View>
  );
};

export default HelpView;
