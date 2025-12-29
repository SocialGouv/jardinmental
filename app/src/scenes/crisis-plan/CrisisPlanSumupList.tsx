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
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";

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
  useFocusEffect(() => {
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
  });

  // Handler to generate and share PDF
  const handleSharePdf = async () => {
    // Build a simple HTML representation of the cardData

    const convertImagesToBase64 = async () => {
      const base64Images = await Promise.all(
        cardData.reason_to_live_image.map(async (img) => {
          const base64 = await FileSystem.readAsStringAsync(img, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return `data:image/jpeg;base64,${base64}`;
        })
      );
      return base64Images;
    };

    const base64Images = await convertImagesToBase64();
    const html = `
<html>
  <head>
    <meta charset="utf-8" />
    <title>Plan de protection</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      ul {
        padding-left: 16px;
      }

      .image-grid {
        list-style: none;
        padding: 0;
        margin: 0 0 12px 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .image-grid li {
        width: 100%;
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .image-grid img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 12px;
        display: block;
      }
    </style>
  </head>

  <body>
    <h1>Plan de protection</h1>

    <h2>Mes signes d’alerte</h2>
    <ul>${(cardData.alerts || []).map((a) => `<li>${a}</li>`).join("")}</ul>

    <h2>Activités</h2>
    <ul>${(cardData.activities || []).map((a) => `<li>${a}</li>`).join("")}</ul>

    <h2>Se changer les idées</h2>
    <ul>
      ${(cardData.contacts_change_ideas || [])
        .map((c) => `<li>${c.name}${c.activities && c.activities.length ? " (" + c.activities.join(", ") + ")" : ""}</li>`)
        .join("")}
    </ul>

    <h2>Demander de l’aide</h2>
    <ul>${(cardData.contacts_help || []).map((c) => `<li>${c.name}</li>`).join("")}</ul>

    <h2>En cas d’urgence</h2>
    <ul>${(cardData.contacts_professional || []).map((c) => `<li>${c.name}</li>`).join("")}</ul>

    <h2>Environnement sécurisé</h2>
    <ul>${(cardData.safety || []).map((s) => `<li>${s}</li>`).join("")}</ul>

    <h2>Raisons de vivre</h2>

    <ul class="image-grid">
      ${(base64Images || []).map((r) => `<li><img src="${r}" /></li>`).join("")}
    </ul>

    <ul>${(cardData.reason_to_live || []).map((r) => `<li>${r}</li>`).join("")}</ul>
  </body>
</html>
`;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (e) {
      // Optionally handle error
      console.error("Erreur lors de la génération ou du partage du PDF", e);
    }
  };

  return (
    <View className="flex-1 bg-cnam-cyan-50-lighten-90">
      <CrisisHeader
        initialRouteName={route.params?.initialRouteName}
        navigation={navigation}
        title={"Plan de protection"}
        description={"Par Hop ma liste"}
      />
      <View className="flex-row justify-between m-4">
        <TouchableOpacity onPress={handleSharePdf} className="flex-row items-center justify-center space-x-2">
          <ShareIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Partager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(<CrisisSumUpBottomSheet navigation={navigation} onClose={() => {}} initialSelectedItems={[]} items={[]} />);
          }}
          className="flex-row items-center justify-center space-x-2"
        >
          <PencilIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Editer ma liste</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ paddingBottom: 200 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <AlertCard alerts={cardData["alerts"] || []} />
        <ActivitiesCard activities={cardData["activities"] || []} />
        <ChangeIdeasCard contactsChangeIdeas={cardData["contacts_change_ideas"] || []} />
        <HelpCard contactsHelp={cardData["contacts_help"] || []} />
        <ProfessionalCard contactsProfessional={cardData["contacts_professional"] || []} />
        <SafetyCard safety={cardData["safety"] || []} />
        <ReasonToLiveCard reasonToLive={cardData["reason_to_live"] || []} reasonToLiveImage={cardData["reason_to_live_image"] || []} />
      </ScrollView>
    </View>
  );
};
