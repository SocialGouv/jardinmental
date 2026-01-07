import React from "react";
import { View, Text, ScrollView } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrisisHeader from "./CrisisHeader";
import NavigationButtons from "@/components/onboarding/NavigationButtons";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const dataInfo = [
  "Vos signes d’alerte.",
  "Des actions à faire seul(e) pour vous apaiser.",
  "Des proches à appeler pour vous changer les idées et des activités à faire ensemble.",
  "Des proches à contacter pour recevoir de l’aide.",
  "Des professionnels ou numéros utiles.",
  "Des actions pour sécuriser votre environnement.",
  "Vos raisons de vivre.",
];

export const CrisisPlanIntro: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader
        initialRouteName={route.params?.initialRouteName}
        navigation={navigation}
        title={"Plan de protection"}
        description={"Hop ma liste"}
      />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <View className="flex-column py-2 space-y-4 px-2 rounded-[8px]">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>Ce que vous allez définir</Text>
        </View>
        <View className="flex-column space-y-4 rounded-2xl mb-6">
          {dataInfo.map((info) => (
            <View key={info} className="bg-cnam-primary-100 flex-column py-2 space-y-4 px-4 rounded-2xl">
              <Text className={mergeClassNames(typography.textMdMedium, "text-primary-900 text-left")}>{info}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <NavigationButtons
        nextText="Démarrer (3-5 min)"
        withArrow={true}
        onNext={async () => {
          navigation.navigate("crisis-plan-slide-alert", {
            initialRouteName: route.params?.initialRouteName,
          });
        }}
      />
    </View>
  );
};
