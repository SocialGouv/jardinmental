import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React from "react";
import { Text, View, ViewStyle, StyleSheet } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import JMButton from "@/components/JMButton";
import Markdown, { MarkdownIt, stringToTokens, tokensToAST } from "react-native-markdown-display";
import Accordion from "@/components/Accordion";
import NavigationListItem from "@/components/ListItem/NavigationListItem";
import { FAQ_DATA } from "./FaqData";
import logEvents from "@/services/logEvents";

const markdownStyles = {
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: "red",
    lineHeight: 24,
    // color: TW_COLORS.CNAM_PRIMARY_900,
    fontFamily: "SourceSans3",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_900,
    marginBottom: 8,
    fontFamily: "SourceSans3",
  },
  strong: {
    fontWeight: "600" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    fontFamily: "SourceSans3",
  },
  em: {
    fontSize: 16,
    // fontWeight: 400,
    color: TW_COLORS.CNAM_PRIMARY_900,
    fontFamily: "SourceSans3-Italic",
  },
  // strong_em: { fontFamily: "SourceSans3-BoldItalic" },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_900,
    marginBottom: 4,
    fontFamily: "SourceSans3",
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  link: {
    color: TW_COLORS.CNAM_CYAN_0,
    textDecorationLine: "underline" as const,
    fontFamily: "SourceSans3",
  },
  code_inline: {
    backgroundColor: TW_COLORS.GRAY_50,
    color: TW_COLORS.CNAM_PRIMARY_900,
    fontFamily: "SourceSans3",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: TW_COLORS.GRAY_50,
    color: TW_COLORS.CNAM_PRIMARY_900,
    fontFamily: "SourceSans3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
};

export default function FaqDetailScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      slug: string;
    };
  };
}) {
  const item = FAQ_DATA[route.params.slug];
  return (
    <AnimatedHeaderScrollScreen
      title={item.title}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        // in most cases we want to go back to the FAQ main screen
        // but if the user has been redirected here from another screen
        // that is not in faq hiearchy
        // we want to go back to that screen
        // ie clicking "Qui peut voir mes données ?" from the drawer menu
        const routes = navigation.getState()?.routes;
        const faqRoute = routes?.find((route) => route.name === "faq");
        if (faqRoute) {
          navigation.navigate("faq");
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // optional: navigate to a default page
          navigation.navigate("tabs");
        }
      }}
      noPadding={true}
      showBottomButton={false}
      navigation={navigation}
    >
      <View>
        <View className="bg-gray-50 p-4 flex-col space-y-6 pt-8">
          <View className="flex-col space-y-4">
            {item.subtitle && (
              <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-950 text-left mb-4")}>{item.subtitle}</Text>
            )}
            {/*
            we encapsulate the Markdown tag in <> otherwise when <Text> and <Markdown> are next to each others,
            markdownStyles is not applied (haven’t found out why yet)
          */}
            <>
              <Markdown style={markdownStyles}>{item.description}</Markdown>
            </>
            {item.exemple && (
              <View className="bg-cnam-primary-100 px-2 rounded-xl py-1">
                <Markdown style={markdownStyles}>{item.exemple}</Markdown>
              </View>
            )}
          </View>
          {item.accordion.length && (
            <View>
              <Accordion items={item.accordion} />
            </View>
          )}
        </View>
        {item.next && (
          <View className={mergeClassNames("bg-cnam-primary-100 bg-cyan-50-lighten-90 p-4 space-y-6 p-6 mt-8 h-full")}>
            <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 text-left mb-4")}>A découvrir ensuite</Text>
            <NavigationListItem
              icon={FAQ_DATA[item.next].icon}
              label={FAQ_DATA[item.next].title}
              onPress={() => {
                navigation.push("faq-detail", {
                  slug: item.next,
                });
                logEvents.logOpenFaqSection(FAQ_DATA[item.next].matomoId);
              }}
            />
          </View>
        )}
      </View>
    </AnimatedHeaderScrollScreen>
  );
}
