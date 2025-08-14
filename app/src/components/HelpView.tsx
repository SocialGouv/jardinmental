import { TW_COLORS } from "@/utils/constants";
import { View, Text } from "react-native";

interface Props {
  title: string;
  description: string;
}

const HelpView = ({ title, description }: Props) => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-4" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
        {title}
      </Text>
      <Text className="text-base mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
        {description}
      </Text>
    </View>
  );
};

export default HelpView;
