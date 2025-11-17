import logEvents from "@/services/logEvents";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import { View, Text, Touchable, TouchableOpacity, Linking } from "react-native";
import Markdown from "react-native-markdown-display";

interface Props {
  title: string;
  description: string;
  link?: string;
  isMd?: boolean;
}

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_800,
    fontFamily: "SourceSans3",
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 12,
    fontFamily: "SourceSans3",
  },
  heading2: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 8,
    fontFamily: "SourceSans3",
  },
  heading3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 6,
    fontFamily: "SourceSans3",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 8,
    fontFamily: "SourceSans3",
  },
  strong: {
    fontWeight: "600" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
  },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3D6874",
    marginBottom: 4,
    fontFamily: "SourceSans3",
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
};

const HelpView = ({ title, description, link, isMd }: Props) => {
  return (
    <View className="flex-1 bg-white p-4 pb-16">
      <Text className={mergeClassNames(typography.textXlBold, "mb-6 text-cnam-primary-950")}>{title}</Text>
      {!isMd && <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>{description}</Text>}
      {isMd && <Markdown style={markdownStyles}>{description}</Markdown>}
      {link && (
        <TouchableOpacity
          onPress={() => {
            logEvents.logInfoClick(link);
            Linking.openURL(link);
          }}
        >
          <Text className="text-base text-center mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
            {link}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HelpView;
