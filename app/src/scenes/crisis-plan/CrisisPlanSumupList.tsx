import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
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
import { Modal } from "react-native";
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
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  type Contact = {
    name: string;
    phoneNumbers?: { number: string; digits?: string; countryCode?: string; label?: string; id?: string }[];
    activities?: string[];
  };

  const [cardData, setCardData] = useState<{
    alerts: string[];
    activities: string[];
    contacts_change_ideas: Contact[];
    contacts_help: Contact[];
    contacts_professional: Contact[];
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
    setIsLoadingPdf(true);
    try {
      // Build a simple HTML representation of the cardData

      const convertImagesToBase64 = async () => {
        const base64Images = await Promise.all(
          cardData.reason_to_live_image.map(async (img) => {
            let uri: string | null = null;
            if (img && typeof img === "object" && "localUri" in img && "originalUri" in img) {
              // Try localUri first, then originalUri
              try {
                const info = await FileSystem.getInfoAsync(img.localUri);
                if (info.exists) {
                  uri = img.localUri;
                } else {
                  const infoOrig = await FileSystem.getInfoAsync(img.originalUri);
                  if (infoOrig.exists) {
                    uri = img.originalUri;
                  }
                }
              } catch {
                uri = img.localUri || img.originalUri;
              }
            }
            if (uri) {
              try {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                return `data:image/jpeg;base64,${base64}`;
              } catch {
                // If file not found or error, skip
                return null;
              }
            }
            return null;
          })
        );
        // Filter out nulls (missing images)
        return base64Images.filter(Boolean);
      };

      const base64Images = await convertImagesToBase64();
      const html = `
<html>
  <head>
    <meta charset="utf-8" />
    <title>Mon plan de crise</title>
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
    <h1>Mon plan de crise</h1>

    <h2>Mes signes d’alerte</h2>
    <ul>${(cardData.alerts || []).map((a) => `<li>${a}</li>`).join("")}</ul>

    <h2>Activités</h2>
    <ul>${(cardData.activities || []).map((a) => `<li>${a}</li>`).join("")}</ul>

    <h2>Se changer les idées</h2>
    <ul>
      ${(cardData.contacts_change_ideas || [])
        .map(
          (c) =>
            `<li>${c.name}${c.phoneNumbers && c.phoneNumbers.length && c.phoneNumbers[0].number ? " (" + c.phoneNumbers[0].number + ")" : ""}${
              c.activities && c.activities.length ? " (" + c.activities.join(", ") + ")" : ""
            }</li>`
        )
        .join("")}
    </ul>

    <h2>Demander de l’aide</h2>
    <ul>
      ${(cardData.contacts_help || [])
        .map(
          (c) =>
            `<li>${c.name}${c.phoneNumbers && c.phoneNumbers.length && c.phoneNumbers[0].number ? " (" + c.phoneNumbers[0].number + ")" : ""}</li>`
        )
        .join("")}
    </ul>

    <h2>En cas d’urgence</h2>
    <ul>
      ${(cardData.contacts_professional || [])
        .map(
          (c) =>
            `<li>${c.name}${c.phoneNumbers && c.phoneNumbers.length && c.phoneNumbers[0].number ? " (" + c.phoneNumbers[0].number + ")" : ""}</li>`
        )
        .join("")}
    </ul>

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
      const { uri } = await Print.printToFileAsync({ html });
      // Set custom filename
      const fileName = "mon plan de crise.pdf";
      const destPath = FileSystem.cacheDirectory ? FileSystem.cacheDirectory + fileName : uri.replace(/[^/]+$/, fileName);
      try {
        await FileSystem.copyAsync({ from: uri, to: destPath });
      } catch (e) {
        // fallback: if file exists, overwrite
        await FileSystem.deleteAsync(destPath, { idempotent: true });
        await FileSystem.copyAsync({ from: uri, to: destPath });
      }
      setIsLoadingPdf(false);
      setTimeout(() => {
        shareAsync(destPath, { UTI: ".pdf", mimeType: "application/pdf" });
      }, 100);
    } catch (e) {
      // Optionally handle error
      console.error("Erreur lors de la génération ou du partage du PDF", e);
      setIsLoadingPdf(false);
    }
  };

  return (
    <>
      <Modal visible={isLoadingPdf} transparent animationType="fade" onRequestClose={() => {}}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              maxWidth: 320,
              marginHorizontal: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ActivityIndicator size="large" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} style={{ marginBottom: 24 }} />
            <Text style={{ textAlign: "center", fontSize: 16, color: "#222" }}>
              {"Le PDF est en cours de génération,\ncela peut prendre un certain temps.\nMerci de patienter."}
            </Text>
          </View>
        </View>
      </Modal>
      <View className="flex-1 bg-cnam-cyan-50-lighten-90">
        <CrisisHeader
          initialRouteName={route.params?.initialRouteName}
          navigation={navigation}
          title={"Mon plan de crise"}
          description="Hop Ma Liste"
        />
        <View className="flex-row justify-between m-4">
          <TouchableOpacity onPress={handleSharePdf} className="flex-row items-center justify-center space-x-2" disabled={isLoadingPdf}>
            {isLoadingPdf && <ActivityIndicator size="small" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} style={{ marginRight: 0 }} />}
            {!isLoadingPdf && <ShareIcon width={20} height={20} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />}
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
          <AlertCard
            alerts={cardData["alerts"] || []}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-alert", {
                isEdit: true,
              });
            }}
          />
          <ActivitiesCard
            activities={cardData["activities"] || []}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-activities", {
                isEdit: true,
              });
            }}
          />
          <ChangeIdeasCard
            contactsChangeIdeas={cardData.contacts_change_ideas as any}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-contact", {
                isEdit: true,
              });
            }}
          />
          <HelpCard
            contactsHelp={cardData.contacts_help as any}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-contact-help", {
                isEdit: true,
              });
            }}
          />
          <ProfessionalCard
            contactsProfessional={cardData.contacts_professional as any}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-contact-professional", {
                isEdit: true,
              });
            }}
          />
          <SafetyCard
            safety={cardData["safety"] || []}
            addElement={() => {
              navigation.navigate("crisis-plan-slide-safety", {
                isEdit: true,
              });
            }}
          />
          <ReasonToLiveCard
            reasonToLive={cardData["reason_to_live"] || []}
            reasonToLiveImage={
              Array.isArray(cardData["reason_to_live_image"]) &&
              cardData["reason_to_live_image"].length > 0 &&
              typeof cardData["reason_to_live_image"][0] === "string"
                ? cardData["reason_to_live_image"].map((uri: string) => ({ localUri: uri, originalUri: uri }))
                : cardData["reason_to_live_image"] || []
            }
            addElement={() => {
              navigation.navigate("crisis-plan-slide-reason-to-live", {
                isEdit: true,
              });
            }}
          />
        </ScrollView>
      </View>
    </>
  );
};
