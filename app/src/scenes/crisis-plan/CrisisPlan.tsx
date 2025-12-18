import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import CrisisHeader from "./CrisisHeader";
import JMButton from "@/components/JMButton";
import NavigationButtons from "@/components/onboarding/NavigationButtons";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

export const CrisisPlan: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader navigation={navigation} title={"Ma liste de secours"} description={"Par Hop ma liste"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <View className="bg-cnam-mauve-lighten-90 flex-column py-4 space-y-4 px-4 rounded-2xl">
          <LifeBuoy />
          <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-mauve-darken-40")}>
            Votre plan de crise pour faire face aux idées suicidaires
          </Text>
          <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-mauve-darken-40 text-left")}>
            Préparez à froid un plan d’action personnel pour lutter contre les idées suicidaires et savoir quoi faire quand la situation monte.
          </Text>
        </View>
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>Infos pratiques</Text>
        </View>
        <View className="bg-cnam-primary-50 flex-column py-4 space-y-4 px-4 rounded-2xl">
          <View className="flex-row">
            <Text className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Durée : 3–5 min. Modifiable à tout moment.
            </Text>
          </View>
          <View className="flex-row">
            <Text className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>Accessible hors connexion.</Text>
          </View>
          <View className="flex-row">
            <Text className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Données stockées uniquement sur votre téléphone.
            </Text>
          </View>
          <View className="flex-row">
            <Text className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Accès à vos contacts possible pour sélectionner des proches.
            </Text>
          </View>
        </View>
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>En cas d’urgence, appelez 15 ou le 3114</Text>
        </View>
        {/* <JMButton
          title={"Suivant"}
          className="mb-2"
          onPress={() => {
            navigation.navigate("crisis-plan-intro");
          }}
        /> */}
      </ScrollView>
      <NavigationButtons
        absolute={true}
        onNext={() => {
          navigation.navigate("crisis-plan-intro");
        }}
        withArrow={true}
        showPrevious={false}
        nextText="Suivant"
      />
    </View>
  );
};
