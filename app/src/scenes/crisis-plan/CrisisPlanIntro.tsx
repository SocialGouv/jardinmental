import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import CrisisHeader from "./CrisisHeader";
import JMButton from "@/components/JMButton";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
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
      <CrisisHeader navigation={navigation} title={"Plan de protection"} description={"Par Hop ma liste"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>Ce que vous allez définir</Text>
        </View>
        <View className="flex-column space-y-4 rounded-2xl mb-6">
          {dataInfo.map((info) => (
            <View key={info} className="bg-cnam-primary-100 flex-column py-4 space-y-4 px-4 rounded-2xl">
              <Text className={mergeClassNames(typography.textMdMedium, "text-primary-900 text-left")}>{info}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {!route.params?.isEdit && (
        <NavigationButtons
          absolute={true}
          onNext={() => {
            navigation.navigate("crisis-plan-slide-alert");
          }}
          withArrow={true}
          showPrevious={false}
          nextText="Suivant"
        />
      )}
      {route.params?.isEdit && (
        <NavigationButtons
          nextText="Valider"
          onNext={async () => {
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};
