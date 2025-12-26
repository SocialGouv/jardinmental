import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
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
import { ScrollView } from "react-native-gesture-handler";
import PhoneIcon from "@assets/svg/icon/Phone";
import AlertCard from "./CrisisPlanSumupCards/AlertCard";
import ActivitiesCard from "./CrisisPlanSumupCards/ActivitiesCard";
import ChangeIdeasCard from "./CrisisPlanSumupCards/ChangeIdeasCard";
import HelpCard from "./CrisisPlanSumupCards/HelpCard";
import ProfessionalCard from "./CrisisPlanSumupCards/ProfessionalCard";
import SafetyCard from "./CrisisPlanSumupCards/SafetyCard";
import ReasonToLiveCard from "./CrisisPlanSumupCards/ReasonToLiveCard";
import { useBottomSheet } from "@/context/BottomSheetContext";
import CrisisSumUpBottomSheet from "./CrisisSumUpBottomSheet";
interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

export const CrisisPlanSumupList: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  //CNAM - secondary/Cyan (Accent)/50 lighten 90
  const [cardData, setCardData] = useState<{
    alerts: string[];
    activities: string[];
    contacts_change_ideas: { name: string; activities?: string[] }[];
    contacts_help: { name: string }[];
    contacts_professional: { name: string }[];
    safety: string[];
    reason_to_live: string[];
    reason_to_live_image: string[];
  }>({
    alerts: [],
    activities: [],
    contacts_change_ideas: [],
    contacts_help: [],
    contacts_professional: [],
    safety: [],
    reason_to_live: [],
    reason_to_live_image: [],
  });
  const { showBottomSheet } = useBottomSheet();
  useEffect(() => {
    const cb = async function () {
      const data = {
        alerts: [],
        activities: [],
        contacts_change_ideas: [],
        contacts_help: [],
        contacts_professional: [],
        safety: [],
        reason_to_live: [],
        reason_to_live_image: [],
      };
      try {
        data["alerts"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_ALERT")) || "[]");
        data["activities"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_ACTIVITIES")) || "[]");
        data["contacts_change_ideas"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT")) || "[]");
        data["contacts_help"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT_HELP")) || "[]");
        data["contacts_professional"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_CONTACT_PROFESSIONAL")) || "[]");
        data["safety"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_SAFETY")) || "[]");
        data["reason_to_live"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_REASON_TO_LIVE")) || "[]");
        data["reason_to_live_image"] = JSON.parse((await AsyncStorage.getItem("@CRISIS_PLAN_REASON_TO_LIVE_IMAGE")) || "[]");
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
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(<CrisisSumUpBottomSheet navigation={navigation} />);
          }}
          className="flex-row items-center justify-center space-x-2"
        >
          <PencilIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Editer ma liste</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ paddingBottom: 200 }} contentContainerStyle={{ paddingBottom: 200 }}>
        <AlertCard alerts={cardData["alerts"] || []} />
        <ActivitiesCard activities={cardData["activities"] || []} />
        <ChangeIdeasCard contactsChangeIdeas={cardData["contacts_change_ideas"] || []} />
        <HelpCard contactsHelp={cardData["contacts_help"] || []} />
        <ProfessionalCard contactsProfessional={cardData["contacts_professional"] || []} />
        <SafetyCard safety={cardData["safety"] || []} />
        <ReasonToLiveCard reasonToLive={cardData["reason_to_live"] || []} reasonToLiveImage={cardData["reason_to_live_image"] || []} />
      </ScrollView>
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
