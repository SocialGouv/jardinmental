import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import JMButton from "@/components/JMButton";
import NavigationListItem from "@/components/ListItem/NavigationListItem";
import Pencil from "@assets/svg/Pencil";
import Goal from "@assets/svg/icon/Goal";
import CalendarIcon from "@assets/svg/icon/Calendar";
import TrendUpIcon from "@assets/svg/icon/TrendUp";
import HealthIcon from "@assets/svg/icon/Health";
import ShareIcon from "@assets/svg/icon/Share";
import { FAQ_DATA } from "./FaqData";
import logEvents from "@/services/logEvents";

export default function FaqMainScreen({ navigation, route }) {
  return (
    <AnimatedHeaderScrollScreen
      title={"Comment ça marche ?"}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      noPadding={true}
      showBottomButton={false}
      navigation={navigation}
    >
      <View className="bg-gray-50 flex-1 p-4 flex-col space-y-12 pt-10 pb-12">
        <View className="flex-col space-y-6">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left")}>
            Jardin mental, qu’est-ce que c’est ?
          </Text>
          <View className="flex-col space-y-4">
            <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
              La santé mentale mérite d'être préservée au quotidien, pas seulement lorsqu'elle est en crise.{"\n\n"}
              <Text className={typography.textMdSemibold}>Un bon premier pas est d'apprendre à s'observer avec bienveillance</Text>, sans tomber dans
              l'analyse excessive. Cela aide à reconnaître les signaux de mal-être et à identifier ce qui nous apporte du bien-être.{"\n\n"}
              Notre application{" "}
              <Text className={typography.textMdSemibold}>
                Jardin Mental offre un espace pour évaluer et suivre son état mental, même dans les moments positifs.
              </Text>
            </Text>
          </View>
        </View>
        <View className="flex-col space-y-6">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left")}>Guide Pratique</Text>
          <View className="flex-col space-y-1">
            {Object.keys(FAQ_DATA).map((slug, index) => (
              <NavigationListItem
                key={slug}
                label={FAQ_DATA[slug].title}
                onPress={() => {
                  navigation.navigate("faq-detail", {
                    slug: slug,
                  });
                  logEvents.logOpenFaqSection(FAQ_DATA[slug].matomoId);
                }}
                icon={FAQ_DATA[slug].icon}
              />
            ))}
          </View>
        </View>
        <View className={mergeClassNames("bg-blue bg-cyan-50-lighten-90 p-4 rounded-xl space-y-6 p-6")}>
          <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 text-left")}>Besoin d'assistance ?</Text>
          <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
            Si vous ne trouvez pas la réponse à votre question, contactez-nous sur
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr")}>
            <Text className={mergeClassNames(typography.textMdRegular, "text-gray-800 text-left")}>jardinmental@fabrique.social.gouv.fr</Text>
          </TouchableOpacity>
          <JMButton
            onPress={() => {
              navigation.navigate("contact");
              logEvents.logNeedAssistanceFaq();
            }}
            title="Contactez l’équipe de Jardin mental"
            variant="outline"
          />
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
}
