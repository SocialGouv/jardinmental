import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ArrowIcon from "@assets/svg/icon/Arrow";
import CheckMarkIcon from "@assets/svg/icon/check";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { Card } from "@/components/Card";

export default function CheckListScreen({ navigation, route }) {
  return (
    <AnimatedHeaderScrollScreen
      title={"Comment ça marche ?"}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      showBottomButton={false}
      navigation={navigation}
    >
      <View className="bg-gray-50 flex-1 p-4 flex-col space-y-4">
        <View className="flex-col space-y-2">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left mb-8")}>
            Jardin mental, qu’est-ce que c’est?
          </Text>
          <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left mb-8")}>
            La santé mentale mérite d'être préservée au quotidien, pas seulement lorsqu'elle est en crise.{"\n\n"}
            <Text className={typography.textMdSemibold}>Un bon premier pas est d'apprendre à s'observer avec bienveillance</Text>, sans tomber dans
            l'analyse excessive. Cela aide à reconnaître les signaux de mal-être et à identifier ce qui nous apporte du bien-être.{"\n\n"}
            Notre application Jardin Mental offre un espace pour évaluer et suivre son état mental, même dans les moments positifs.
          </Text>
        </View>
        <View className="flex-col space-y-2">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-cnam-primary-950 text-left mb-8")}>Guide Pratique</Text>
          <View className="flex-col space-y-1">
            {[
              {
                icon: "",
                label: "Définir mes indicateurs",
                path: "/faq/indicateur",
              },
              {
                icon: "",
                label: "Définir mes objectifs",
                path: "/faq/indicateur",
              },
              {
                icon: "",
                label: "Faire mon suivi quotidien",
                path: "/faq/indicateur",
              },
              {
                icon: "",
                label: "Comprendre mes analyses",
                path: "/faq/indicateur",
              },
              {
                icon: "",
                label: "Renseigner mon traitement",
                path: "/faq/indicateur",
              },
              {
                icon: "",
                label: "Parteger mes données",
                path: "/faq/indicateur",
              },
            ].map((test) => null)}
          </View>
        </View>
        <Card title="Besoin d'assistance" text={`Si vous ne trouvez pas la réponse à votre question, contactez-nous sur `} />
      </View>
    </AnimatedHeaderScrollScreen>
  );
}
