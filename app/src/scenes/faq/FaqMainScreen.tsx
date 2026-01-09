import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React, { useRef, useState, useCallback } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import JMButton from "@/components/JMButton";
import NavigationListItem from "@/components/ListItem/NavigationListItem";
import { FAQ_DATA } from "./FaqData";
import logEvents from "@/services/logEvents";
import { useFocusEffect } from "@react-navigation/native";
import { Typography } from "@/components/Typography";

export default function FaqMainScreen({ navigation, route }) {
  const scrollPositionRef = useRef(0);
  const [initialScrollPosition, setInitialScrollPosition] = useState(0);

  // Track scroll position changes
  const handleScrollPositionChange = useCallback((scrollY: number) => {
    scrollPositionRef.current = scrollY;
  }, []);

  // Save scroll position when leaving the screen and restore it when returning
  useFocusEffect(
    useCallback(() => {
      // When screen comes into focus, set the initial scroll position
      setInitialScrollPosition(scrollPositionRef.current);

      // When screen loses focus, the scroll position is already saved in scrollPositionRef
      return () => {
        // No cleanup needed - scroll position is preserved in scrollPositionRef
      };
    }, [])
  );

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
      preserveScrollOnBlur={true}
      onScrollPositionChange={handleScrollPositionChange}
      initialScrollPosition={initialScrollPosition}
    >
      <View className="bg-gray-50 flex-1 p-4 flex-col space-y-12 pt-10 pb-12">
        <View className="flex-col space-y-6">
          <Typography className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left")}>
            Jardin mental, qu’est-ce que c’est ?
          </Typography>
          <View className="flex-col space-y-4">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
              La santé mentale mérite d’être préservée au quotidien, et pas seulement en période de crise.{"\n\n"}
              <Typography className={typography.textMdSemibold}>Un bon premier pas est d'apprendre à s'observer avec bienveillance</Typography>, sans
              tomber dans l'analyse excessive. Cela aide à reconnaître les signaux de mal-être et à identifier ce qui nous apporte du bien-être.
              {"\n\n"}
              Notre application{" "}
              <Typography className={typography.textMdSemibold}>
                Jardin Mental offre un espace pour évaluer et suivre son état mental, même dans les moments positifs.
              </Typography>
            </Typography>
          </View>
        </View>
        <View className="flex-col space-y-6">
          <Typography className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left")}>Guide Pratique</Typography>
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
          <Typography className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 text-left")}>Besoin d'assistance ?</Typography>
          <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
            Si vous ne trouvez pas la réponse à votre question, contactez-nous sur
          </Typography>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr")}>
            <Typography className={mergeClassNames(typography.textMdRegular, "text-gray-800 text-left")}>
              jardinmental@fabrique.social.gouv.fr
            </Typography>
          </TouchableOpacity>
          <JMButton
            onPress={() => {
              Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr");
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
