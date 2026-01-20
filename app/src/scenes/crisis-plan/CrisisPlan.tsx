import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import CrisisHeader from "./CrisisHeader";
import JMButton from "@/components/JMButton";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import ClockIcon from "@assets/svg/icon/Clock";
import WifiOff from "@assets/svg/icon/WifiOff";
import LockIcon from "@assets/svg/icon/Lock";
import UsersIcon from "@assets/svg/icon/Users";
import { TW_COLORS } from "@/utils/constants";
import { Typography } from "@/components/Typography";
interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

export const CrisisPlan: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader navigation={navigation} title={"Mon plan de crise"} description={"Hop ma liste"} />
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
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-mauve-darken-80")}>
            Votre plan de crise pour faire face aux idées suicidaires
          </Typography>
          <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
            Préparez un plan d’action personnel pour lutter contre les idées suicidaires et savoir quoi faire quand la situation monte.
          </Typography>
        </View>
        <View className="flex-column py-4 space-y-4 px-2 rounded-2xl">
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>Infos pratiques</Typography>
        </View>
        <View className="bg-cnam-primary-50 flex-column py-4 space-y-4 px-4 rounded-2xl">
          <View className="flex-row items-center justify-start space-x-2">
            <ClockIcon />
            <Typography className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Durée : 3–5 min. Modifiable à tout moment.
            </Typography>
          </View>
          <View className="flex-row items-center justify-start space-x-2">
            <WifiOff />
            <Typography className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>Accessible hors connexion.</Typography>
          </View>
          <View className="flex-row items-center justify-start space-x-2">
            <LockIcon width={16} height={16} color={TW_COLORS.CNAM_PRIMARY_800} />
            <Typography className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Données stockées uniquement sur votre téléphone.
            </Typography>
          </View>
          <View className="flex-row items-center justify-start space-x-2">
            <UsersIcon />
            <Typography className={mergeClassNames(typography.textMdRegular, "text-primary-900 text-left")}>
              Accès à vos contacts possible pour sélectionner des proches.
            </Typography>
          </View>
        </View>
        <View className="py-4 px-4 rounded-2xl items-center justify-center">
          <Typography className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>
            En cas d’urgence,{" "}
            <Typography
              onPress={() => {
                Alert.alert("Souhaitez vous appeler le 15 (urgences immédiates)?", undefined, [
                  { text: "Annuler", style: "cancel" },
                  { text: "Appeler", onPress: () => Linking.openURL("tel:15") },
                ]);
              }}
              className={mergeClassNames(typography.textMdSemibold, "text-primary-900 underline")}
            >
              appelez le 15
            </Typography>{" "}
            ou{" "}
            <Typography
              onPress={() => {
                Alert.alert("Souhaitez vous appeler le 3114 (prévention suicide)?", undefined, [
                  { text: "Annuler", style: "cancel" },
                  { text: "Appeler", onPress: () => Linking.openURL("tel:3114") },
                ]);
              }}
              className={mergeClassNames(typography.textMdSemibold, "text-primary-900 underline")}
            >
              le 3114
            </Typography>
          </Typography>
        </View>
      </ScrollView>
      <NavigationButtons
        absolute={true}
        onNext={() => {
          navigation.navigate("crisis-plan-intro", {
            initialRouteName: "tabs",
          });
        }}
        withArrow={true}
        showPrevious={false}
        nextText="Suivant"
      />
    </View>
  );
};
