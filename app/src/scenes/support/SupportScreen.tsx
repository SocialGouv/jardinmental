import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import PhoneIcon from "@assets/svg/icon/Phone";
import Accordion from "@/components/Accordion";
import MessageHeartCircleIcon from "@assets/svg/icon/MessageHeartCircle";
import colors from "tailwindcss/colors";
import HeartHand from "@assets/svg/icon/HeartHand";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import LinkIcon from "@assets/svg/icon/Link";

export default function SupportScreen({ navigation, route }) {
  const [sectionListenVisible, setSectionListenVisible] = useState(false);
  const [sectionStartFollowUpVisible, setSectionListenStartFollowUpVisible] = useState(false);
  const numbers = [
    {
      name: "SOS Amitié",
      description: "24h/24, 7j/7",
    },
    {
      name: "Fil Santé Jeunes",
      description: "7j/7, de 9h à 23h",
    },
    {
      name: "Femmes victimes de violences",
      description: "Numéro national 7j/7",
    },
  ];

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
            <MessageHeartCircleIcon width={"24"} height={"24"} color={TW_COLORS.CNAM_PRIMARY_800} />
            <Text className={mergeClassNames(typography.textXlSemibold, "ml-2 text-cnam-primary-950 text-left")}>Urgence Immédiate</Text>
          </View>
          <View className="flex-col space-y-5">
            <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
              Si vous êtes en détresse, appelez le 3114 (24h/24, 7j/7, appel gratuit).
            </Text>
            <SquircleButton
              style={{
                borderRadius: 20,
              }}
              preserveSmoothing={true}
              cornerSmoothing={100}
              className="border border-cnam-jaune-500 bg-cnam-jaune-100 h-[60] flex-row px-6 py-4 justify-content items-center mt-0"
            >
              <PhoneIcon width={24} height={24} />
              <Text className={mergeClassNames(typography.textLgSemibold, "ml-3 text-cnam-primary-900 text-left")}>Appeler le 3114</Text>
            </SquircleButton>
            <SquircleButton
              preserveSmoothing={true}
              cornerSmoothing={100}
              style={{
                borderRadius: 20,
              }}
              className="border border-cnam-primary-800 h-[60] flex-row px-6 py-4 bg-white justify-content items-center"
            >
              <PhoneIcon width={24} height={24} />
              <Text className={mergeClassNames(typography.textLgSemibold, "ml-3 text-cnam-primary-900 text-left")}>Écrire au 114 par SMS</Text>
            </SquircleButton>
          </View>
        </View>
      </View>
      <View className="bg-[#F7FCFE]">
        <View className="w-full border border-cnam-primary-300 border-b-0">
          <TouchableOpacity
            className="h-[110] items-center justify-between flex-row w-full px-4"
            onPress={() => setSectionListenVisible(!sectionListenVisible)}
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
                {numbers.map((item) => {
                  return (
                    <SquircleView
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
                    </SquircleView>
                  );
                })}
              </View>
              <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 mb-4")}>
                👉 Retrouvez un guide complet sur les lignes d’écoute sur le site de Psycom :
              </Text>
              <SquircleView
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
              </SquircleView>
            </View>
          )}
        </View>
        <View className="border border-cnam-primary-300 w-full">
          <TouchableOpacity
            onPress={() => setSectionListenStartFollowUpVisible(!sectionStartFollowUpVisible)}
            className="h-[110] items-center justify-between flex-row w-full px-4"
          >
            <View className="flex-row items-center">
              <HeartHand width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
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
                      "Mon soutien psy permet aux personnes en mal-être de bénéficier de 12 séances avec un psychologue, prises en charge à 100 % par l’Assurance Maladie et les complémentaires santé.",
                    text: "👉 Trouver un psychologue affilié :",
                    link: {
                      label: "Monsoutienpsy.org",
                      url: "https://monsoutienpsy.org",
                    },
                  },
                  {
                    title: "Santé psy étudiant",
                    description:
                      "Santé psy étudiant permet aux étudiants de bénéficier de 12 séances gratuites avec un psychologue, sans avance de frais (le psychologue est rémunéré par l’université).",
                    text: "👉 Vérifier son éligibilité et prendre rdv :",
                    link: {
                      label: "Santepsy.etudiant.gouv.fr",
                      url: "Santepsy.etudiant.gouv.fr/eligibilite",
                    },
                  },
                ].map((item) => (
                  <View className="rounded-xl p-4 bg-white border border-gray-300">
                    <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-800 mb-6")}>{item.title}</Text>
                    <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 mb-4 text-left")}>{item.description}</Text>
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mb-4")}>{item.text}</Text>
                    <SquircleView
                      cornerSmoothing={100}
                      style={{ borderRadius: 12, minHeight: 60 }}
                      preserveSmoothing={true}
                      className="flex-row px-4 py-2 items-center bg-cnam-cyan-50-lighten-90"
                    >
                      <LinkIcon color={TW_COLORS.CNAM_PRIMARY_800} width={24} height={24} />
                      <View className="flex-col ml-4">
                        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.link.label}</Text>
                      </View>
                    </SquircleView>
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
