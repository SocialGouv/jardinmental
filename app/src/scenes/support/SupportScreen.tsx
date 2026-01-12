import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React, { useState, useEffect } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { SquircleButton } from "expo-squircle-view";
import PhoneIcon from "@assets/svg/icon/Phone";
import MailIcon from "@assets/svg/icon/Mail";
import UserIcon from "@assets/svg/icon/User";
import HeartHand from "@assets/svg/icon/HeartHand";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import LinkIcon from "@assets/svg/icon/Link";
import Markdown from "react-native-markdown-display";
import logEvents from "@/services/logEvents";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SupportScreen({ navigation, route }) {
  const [sectionListenVisible, setSectionListenVisible] = useState(false);
  const [sectionStartFollowUpVisible, setSectionListenStartFollowUpVisible] = useState(false);
  const [crisisPlanSet, setCrisisPlanSet] = useState(false);

  // Log page opening
  useEffect(() => {
    logEvents.logOpenEmergencyContact();
    const checkCrisisPlan = async () => {
      const crisisPlanCompleted = await AsyncStorage.getItem("@CRISIS_PLAN_COMPLETED");
      if (crisisPlanCompleted === "true") {
        setCrisisPlanSet(true);
      } else {
        setCrisisPlanSet(false);
      }
    };
    checkCrisisPlan();
  }, []);
  const numbers = [
    {
      name: "SOS Amitié",
      description: "24h/24, 7j/7",
      number: "+33972394050",
    },
    {
      name: "Fil Santé Jeunes",
      description: "7j/7, de 9h à 23h",
      number: "+33800235236",
    },
    // {
    //   name: "Cyberharcèlement entre élèves",
    //   description: "Numéro national 7j/7, de 9h à 23h",
    //   number: "3018",
    // },
    {
      name: "Femmes victimes de violences",
      description: "Numéro national 7j/7",
      number: "3919",
    },
  ];

  const handleCall = async (number: string) => {
    // Log emergency contact events for 3114 and 114

    logEvents.logCallHelpline(number);

    const phoneNumber = number;
    const url = `tel:${phoneNumber}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Les appels ne sont pas supportés sur cet appareil vérifié les permissions de l'application.");
    }
  };

  const handleOpenLink = async (link: string) => {
    // Log specific link clicks
    if (link.includes("monsoutienpsy.ameli.fr")) {
      logEvents.logClickMonSoutienPsy();
    } else if (link.includes("santepsy.etudiant.gouv.fr")) {
      logEvents.logClickSantePsyEtudiant();
    }

    const url = link;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Erreur", `Impossible d'ouvrir ce lien : ${url}`);
    }
  };

  const handleSms = async (number: string) => {
    // Log emergency contact for SMS to 114
    logEvents.logCallHelpline(number);

    const phoneNumber = number;
    const message = ""; // optional

    // iOS accepts body param, Android support varie
    const url = `sms:${phoneNumber}${message ? `?body=${encodeURIComponent(message)}` : ""}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Erreur", "L'envoi de SMS n'est pas supporté sur cet appareil");
    }
  };

  return (
    <AnimatedHeaderScrollScreen
      title={"Soutien 24h/24 - 7J/7"}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.WHITE}
      handlePrevious={() => {
        navigation.goBack();
      }}
      showBottomButton={false}
      navigation={navigation}
    >
      <View className="flex-1 p-4 flex-col space-y-12 pt-10 pb-8 bg-white">
        <View className="flex-col space-y-6">
          <View className="flex-row items-center">
            <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-950 text-left")}>Besoin d'aide urgente ?</Text>
          </View>
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <SquircleButton
                onPress={() => handleCall("15")}
                style={{
                  borderRadius: 20,
                  shadowColor: "#F0B323",
                  flexGrow: 1,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8, // smoother shadow
                  elevation: 6, // Android
                }}
                preserveSmoothing={true}
                cornerSmoothing={100}
                className="border border-cnam-jaune-500 bg-cnam-jaune-100 flex-row justify-center items-center px-1"
              >
                <View className="flex-column items-center py-4">
                  <View className="flex-row items-center justify-center">
                    <PhoneIcon width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
                    <Text className={mergeClassNames(typography.displayXsBold, "text-primary-900 ml-2")}>15</Text>
                  </View>
                  <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-800")}>Urgence immédiate</Text>
                </View>
              </SquircleButton>
            </View>
            <View className="flex-1">
              <SquircleButton
                onPress={() => handleSms("114")}
                style={{
                  borderRadius: 20,
                  flexGrow: 1,
                  shadowColor: "#F0B323",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8, // smoother shadow
                  elevation: 6, // Android
                }}
                preserveSmoothing={true}
                cornerSmoothing={100}
                className="border border-cnam-jaune-500 bg-cnam-jaune-100 flex-row justify-center items-center px-1"
              >
                <View className="flex-column items-center py-4">
                  <View className="flex-row items-center justify-center">
                    <MailIcon color={TW_COLORS.CNAM_PRIMARY_800} width={24} height={24} />
                    <Text className={mergeClassNames(typography.displayXsBold, "text-primary-900 ml-2")}>114</Text>
                  </View>
                  <Text className={mergeClassNames(typography.textSmMedium, " text-cnam-primary-800 text-center")}>Sourds & malentendants</Text>
                </View>
              </SquircleButton>
            </View>
          </View>
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-left")}>24h/24, 7j/7, appel gratuit.</Text>
          <View className="flex-col pt-6">
            <Text className={mergeClassNames(typography.textXlMedium, "text-cnam-primary-900 text-left mb-4")}>En cas d'idées suicidaires</Text>
            <SquircleButton
              onPress={() => handleCall("3114")}
              style={{
                borderRadius: 20,
              }}
              preserveSmoothing={true}
              cornerSmoothing={100}
              className="border border-cnam-primary-800 bg-cnam-primary-25  flex-row px-6 py-2 justify-content items-center mt-0"
            >
              <View className="w-[30]">
                <PhoneIcon width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
              </View>
              <View className="ml-3">
                <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 text-left")}>Appeler le 3114</Text>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 text-left")}>Prévention suicide</Text>
              </View>
            </SquircleButton>
            {!!crisisPlanSet && (
              <SquircleButton
                onPress={() => {
                  navigation.navigate("crisis-plan-slide-sumup-list");
                }}
                style={{
                  borderRadius: 20,
                }}
                preserveSmoothing={true}
                cornerSmoothing={100}
                className="border border-cnam-primary-800 bg-cnam-primary-25  flex-row px-6 py-2 justify-content items-center mt-2"
              >
                <View className="w-[30]">
                  <LifeBuoy width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
                </View>
                <View className="ml-3">
                  <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 text-left")}>Ouvrir mon plan de protection</Text>
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 text-left")}>Accéder à votre plan personnel</Text>
                </View>
              </SquircleButton>
            )}
            {!crisisPlanSet && (
              <SquircleButton
                onPress={() => {
                  navigation.navigate("crisis-plan");
                }}
                style={{
                  borderRadius: 20,
                }}
                preserveSmoothing={true}
                cornerSmoothing={100}
                className="border border-cnam-primary-800 bg-cnam-primary-25  flex-row px-6 py-2 justify-content items-center mt-2"
              >
                <View className="w-[30]">
                  <LifeBuoy width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
                </View>
                <View className="ml-3">
                  <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 text-left")}>Compléter mon plan de crise</Text>
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 text-left")}>
                    Préparez un plan d’action personnel pour lutter contre les idées suicidaires
                  </Text>
                </View>
              </SquircleButton>
            )}
          </View>
        </View>
      </View>
      <View className="bg-[#F7FCFE]">
        <View className="w-full border border-cnam-primary-300 border-b-0">
          <TouchableOpacity
            className="h-[110] items-center justify-between flex-row w-full px-4"
            onPress={() => {
              if (!sectionListenVisible) {
                logEvents.logOpenHelplinesSection();
              }
              setSectionListenVisible(!sectionListenVisible);
            }}
          >
            <View className="flex-row items-center">
              <HeartHand width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
              <Text className={mergeClassNames(typography.textXlBold, "ml-4 text-cnam-primary-950")}>Écoute et soutien</Text>
            </View>
            <View className="flex-row">
              {sectionListenVisible ? (
                <ArrowUpSvg color={TW_COLORS.CNAM_PRIMARY_900} />
              ) : (
                <ArrowUpSvg
                  style={{
                    transform: [{ rotateX: "180deg" }],
                  }}
                  color={TW_COLORS.CNAM_PRIMARY_900}
                />
              )}
            </View>
          </TouchableOpacity>
          {sectionListenVisible && (
            <View className="px-4">
              <View className="pb-8">
                <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 space-y-4")}>
                  Vous traversez une période difficile ?{"\n\n"}Des lignes d’écoute gratuites et anonymes sont disponibles pour vous aider :
                </Text>
              </View>
              <View className="flex-col space-y-4 mb-8">
                {numbers.map((item, index) => {
                  return (
                    <SquircleButton
                      key={index}
                      onPress={() => handleCall(item.number)}
                      cornerSmoothing={100}
                      style={{ borderRadius: 12 }}
                      preserveSmoothing={true}
                      className="flex-row px-4 py-2 items-center bg-cnam-cyan-50-lighten-90"
                    >
                      <PhoneIcon color={TW_COLORS.CNAM_PRIMARY_800} width={24} height={24} />
                      <View className="flex-col ml-4">
                        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.name}</Text>
                        <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800")}>{item.description}</Text>
                      </View>
                    </SquircleButton>
                  );
                })}
              </View>
              <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 mb-4")}>
                👉 Consultez le guide complet des lignes d’écoute sur le site de Psycom :
              </Text>
              <SquircleButton
                onPress={() => handleOpenLink("https://www.psycom.org/sorienter/les-lignes-decoute")}
                cornerSmoothing={100}
                style={{ borderRadius: 12 }}
                preserveSmoothing={true}
                className="flex-row px-4 py-2 items-center bg-cnam-cyan-50-lighten-90 mb-8"
              >
                <LinkIcon color={TW_COLORS.CNAM_PRIMARY_800} width={24} height={24} />
                <View className="flex-col ml-4">
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>Psycom.org</Text>
                  <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800")}>Le site d'informations sur la santé mentale</Text>
                </View>
              </SquircleButton>
            </View>
          )}
        </View>
        <View className="border border-cnam-primary-300 w-full">
          <TouchableOpacity
            onPress={() => {
              if (!sectionStartFollowUpVisible) {
                logEvents.logOpenCounsellingSection();
              }
              setSectionListenStartFollowUpVisible(!sectionStartFollowUpVisible);
            }}
            className="h-[110] items-center justify-between flex-row w-full px-4"
          >
            <View className="flex-row items-center">
              <UserIcon width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
              <Text className={mergeClassNames(typography.textXlBold, "ml-4 text-cnam-primary-900")}>Démarrer un suivi</Text>
            </View>
            <View className="flex-row">
              {sectionStartFollowUpVisible ? (
                <ArrowUpSvg color={TW_COLORS.CNAM_PRIMARY_950} />
              ) : (
                <ArrowUpSvg
                  style={{
                    transform: [{ rotateX: "180deg" }],
                  }}
                  color={TW_COLORS.CNAM_PRIMARY_900}
                />
              )}
            </View>
          </TouchableOpacity>
          {sectionStartFollowUpVisible && (
            <View className="px-4 pb-8">
              <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 space-y-4 mb-8")}>
                Si vous souhaitez démarrer un suivi psychologique avec un professionnel, des dispositifs nationaux peuvent vous accompagner :
              </Text>
              <View className="flex-col space-y-4">
                {[
                  {
                    title: "Séances psy remboursées",
                    description:
                      "**Mon soutien psy** permet aux personnes en mal-être de bénéficier de 12 séances avec un psychologue, prises en charge à 100 % par l’Assurance Maladie et les complémentaires santé.",
                    text: "👉 Trouver un psychologue affilié :",
                    link: {
                      label: "Monsoutienpsy.ameli.fr",
                      url: "https://monsoutienpsy.ameli.fr",
                    },
                  },
                  {
                    title: "Santé psy étudiant",
                    description:
                      "**Santé psy étudiant** permet aux étudiants de bénéficier de 12 séances gratuites avec un psychologue, sans avance de frais.",
                    text: "👉 Vérifier son éligibilité et prendre rdv :",
                    link: {
                      label: "Santepsy.etudiant.gouv.fr",
                      url: "https://santepsy.etudiant.gouv.fr/eligibilite",
                    },
                  },
                ].map((item, index) => (
                  <View className="rounded-xl p-4 bg-white border border-gray-300" key={index}>
                    <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-800 mb-6")}>{item.title}</Text>
                    <View className={"mb-4 text-left"}>
                      <Markdown style={markdownStyles}>{item.description}</Markdown>
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mb-4")}>{item.text}</Text>
                    <SquircleButton
                      cornerSmoothing={100}
                      style={{ borderRadius: 12, minHeight: 60 }}
                      preserveSmoothing={true}
                      onPress={() => handleOpenLink(item.link.url)}
                      className="flex-row px-4 py-2 items-center bg-cnam-cyan-50-lighten-90"
                    >
                      <LinkIcon color={TW_COLORS.CNAM_PRIMARY_800} width={24} height={24} />
                      <View className="flex-col ml-4">
                        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.link.label}</Text>
                      </View>
                    </SquircleButton>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
}

const markdownStyles = {
  body: {
    fontFamily: "SourceSans3",
    fontSize: 16,
    color: TW_COLORS.CNAM_PRIMARY_800,
    lineHeight: 24,
    marginBottom: 20,
  },
  strong: {
    fontWeight: "bold" as "bold",
    color: TW_COLORS.CNAM_PRIMARY_800,
  },
};
