import JMButton from "@/components/JMButton";
import logEvents from "@/services/logEvents";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import ArrowIcon from "@assets/svg/icon/Arrow";
import Arrow from "@assets/svg/icon/Arrow";
import ChevronIcon from "@assets/svg/icon/chevron";
import { useState } from "react";
import { View, Text, Touchable, TouchableOpacity, Linking, ScrollView, Dimensions } from "react-native";
import Markdown from "react-native-markdown-display";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;
interface Props {
  title: string;
  description: string;
  link?: string;
  isMd?: boolean;
}

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_800,
    fontFamily: "SourceSans3",
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 12,
    fontFamily: "SourceSans3",
  },
  heading2: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 8,
    fontFamily: "SourceSans3",
  },
  heading3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 6,
    fontFamily: "SourceSans3",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: TW_COLORS.CNAM_PRIMARY_800,
    marginBottom: 8,
    fontFamily: "SourceSans3",
  },
  strong: {
    fontWeight: "600" as const,
    color: TW_COLORS.CNAM_PRIMARY_800,
  },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3D6874",
    marginBottom: 4,
    fontFamily: "SourceSans3",
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
};

const data = {
  longTerm: {
    title: "Période longue : observer les tendances",
    content: `Sur le long terme, vos données peuvent révéler des tendances générales ou des cycles récurrents.
&nbsp;

## Questions à explorer

- Quelle est la tendance globale ? (amélioration, stagnation, baisse)
- Avez-vous vécu des changements impactants ? (travail, routine, traitement)
- Remarquez-vous des saisonnalités ? (ex. : énergie plus basse chaque hiver)`,
  },
  shortTerm: {
    title: "Période courte : comprendre vos variations",
    content: `Regarder vos indicateurs sur quelques jours ou semaines permet d’identifier les déclencheurs de vos variations d’humeur.
&nbsp;

## Questions utiles à vous poser

- Quels jours observez-vous un pic ou une chute ?
- Ces variations sont-elles liées à un événement, une habitude ou un changement ?
- Voyez-vous des schémas récurrents ?
- Certains indicateurs évoluent-ils ensemble ? (ex. : humeur en baisse quand l’anxiété monte)

Gardez en tête qu’une co-variation ne signifie pas forcément une cause directe.  
Par exemple, si votre humeur baisse les jours de pluie, cela peut venir d’une baisse d’activité, pas de la pluie elle-même.

Observez vos données sur plusieurs semaines avant de conclure.  
&nbsp;

  
### **Identifier ce qui influence votre bien-être**

- Quelles situations coïncident avec une amélioration de vos indicateurs ?
- Quelles actions ou inactions semblent les détériorer ?

Repérer ces liens vous aidera à reproduire ce qui vous fait du bien.  
Vous pouvez aussi tester des petits changements et observer leur effet sur vous (par exemple, marcher 30 minutes chaque jour).

**Conseil :** Observez vos données sur plusieurs semaines avant de tirer des conclusions.  
Testez des hypothèses pour valider ou infirmer vos observations.`,
  },
};

const DataMonitoringPeriodHelpView = ({ title, description, link, isMd }: Props) => {
  const [page, setPage] = useState<string>("initial");
  if (page === "initial") {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1 bg-white px-4"
          contentContainerStyle={{ paddingBottom: 100, height: height90vh }}
          showsVerticalScrollIndicator={false}
        >
          <Text className={mergeClassNames(typography.textXlBold, "mb-6 text-cnam-primary-950")}>{title}</Text>
          <Markdown style={markdownStyles}>Tout dépend de ce que vous cherchez à comprendre. </Markdown>
          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => {
                setPage("shortTerm");
              }}
              className="bg-cnam-primary-50 p-4 flex-col rounded-2xl"
            >
              <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-gray-900")}>Période courte</Text>
              <View className="flex-row space-x-2 items-center mt-2">
                <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800")}>Pour comprendre vos variations</Text>
                <Arrow color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPage("longTerm");
              }}
              className="bg-cnam-primary-50 p-4 flex-col rounded-2xl"
            >
              <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-gray-900")}>Période longue</Text>
              <View className="flex-row space-x-2 items-center mt-2">
                <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800")}>Pour observer des tendances</Text>
                <Arrow color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
              </View>
            </TouchableOpacity>
          </View>
          {link && (
            <TouchableOpacity
              onPress={() => {
                logEvents.logInfoClick(link);
                Linking.openURL(link);
              }}
            >
              <Text className="text-base text-center mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
                {link}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  } else if (page === "shortTerm") {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 200 }}
          className="px-4"
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 20, height: height90vh }}
        >
          <TouchableOpacity
            className="pb-4 pl-0"
            onPress={() => {
              setPage("initial");
            }}
          >
            <ChevronIcon />
          </TouchableOpacity>
          <Text className={mergeClassNames(typography.textXlBold, "mb-6 text-cnam-primary-950")}>{data["shortTerm"].title}</Text>
          <Markdown style={markdownStyles}>{data["shortTerm"].content}</Markdown>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 200 }}
          className="px-4"
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 20, height: height90vh }}
        >
          <TouchableOpacity
            className="pb-4 pl-0"
            onPress={() => {
              setPage("initial");
            }}
          >
            <ChevronIcon />
          </TouchableOpacity>
          <Text className={mergeClassNames(typography.textXlBold, "mb-6 text-cnam-primary-950")}>{data["longTerm"].title}</Text>
          <Markdown style={markdownStyles}>{data["longTerm"].content}</Markdown>
        </ScrollView>
      </View>
    );
  }
};

export default DataMonitoringPeriodHelpView;
