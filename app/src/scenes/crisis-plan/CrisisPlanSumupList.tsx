import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CrisisHeader from "./CrisisHeader";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import PencilIcon from "@assets/svg/icon/Pencil";
import ShareIcon from "@assets/svg/icon/Share";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

export const CrisisPlanSumupList: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  //CNAM - secondary/Cyan (Accent)/50 lighten 90
  const [cardData, setCardData] = useState<{
    alert: [];
    activities: {};
    contacts: {};
    contacts_help: {};
    contact_professional: {};
    contact_safety: {};
    conctact_live: {};
    contact_live_image: {};
  }>({
    alert: [],
  });
  useEffect(() => {
    const cb = async function () {
      console.log("LCS TOTO 1");

      const data = {
        alert: [],
      };
      console.log("LCS TOTO 1.5");
      try {
        data["alert"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_ALERT")) || "[]");
        console.log("LCS TOTO 2");
        data["activities"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_ACTIVITIES")) || "");
        data["contacts"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT")) || "");
        data["contacts_help"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT_HELP")) || "");
        data["contacts_professional"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT_PROFESSIONAL")) || "");
        data["contacts_safety"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_SAFETY")) || "");
        data["contacts_live"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_REASON_TO_LIVE")) || "");
        data["contacts_live_image"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_REASON_TO_LIVE_IMAGE")) || "");
      } catch (e) {
        console.log(e);
      }
      setCardData(data);
    };
    cb();
  }, []);

  return (
    <View className="flex-1 bg-cnam-cyan-50-lighten-90">
      <CrisisHeader navigation={navigation} title={"Ma liste de secours"} description={"Par Hop ma liste"} />
      <View className="flex-row justify-between m-4">
        <View className="flex-row items-center justify-center space-x-2">
          <ShareIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Partager</Text>
        </View>
        <View className="flex-row items-center justify-center space-x-2">
          <PencilIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Editer ma liste</Text>
        </View>
      </View>
      <View
        className="rounded-2xl m-4 p-4 bg-white flex-column space-y-4"
        style={{
          borderWidth: 1,
          borderColor: "#D9BDE2",
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#ECDEF0",
              }}
            >
              1
            </Text>
            <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Mes signes d'alerte</Text>
          </View>
          <TouchableOpacity onPress={() => {}} className="mr-2">
            <ChevronIcon width={14} height={14} direction="up" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
          Les signes d’alerte qui sont pour vous annonciateurs d’idées suicidaires :
        </Text>
        <View className="flex-colmun">
          {cardData["alert"]?.map((itemAlert) => {
            return (
              <View className="flex-row justify-between bg-cnam-primary-25 rounded border border-gray-400">
                <View className="flex-row items-center">
                  <ArrowIcon />
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemAlert}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <NavigationButtons
        absolute={true}
        onNext={() => {
          navigation.navigate("crisis-plan-slide-alert");
        }}
        showPrevious={false}
        nextText="Ouvrir ma liste"
      />
    </View>
  );
};
