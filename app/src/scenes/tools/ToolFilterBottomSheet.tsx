import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity } from "react-native";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import React, { useEffect, useState } from "react";
import Drugs from "@/scenes/drugs/drugs-list";
import { useBottomSheet } from "@/context/BottomSheetContext";
import localStorage from "@/utils/localStorage";
import { HELP_POSOLOGY } from "@/scenes/onboarding-v2/data/helperData";
import { Drug } from "@/entities/Drug";
import HelpView from "@/components/HelpView";
import JMButton from "@/components/JMButton";
import HealthIcon from "@assets/svg/icon/Health";
import { InputText } from "@/components/InputText";
import { ToolItemAudience, ToolItemEntity, ToolItemType } from "./toolsData";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import DownloadIcon from "@assets/svg/icon/Download";
import LinkIcon from "@assets/svg/icon/Link";
import LinkExternal from "@assets/svg/icon/LinkExternal";
import BookmarkAddIcon from "@assets/svg/icon/BookmarkAdd";
import BookmarkMinusIcon from "@assets/svg/icon/BookmarkMinus";
import PlusIcon from "@assets/svg/icon/plus";
import CheckMarkIcon from "@assets/svg/icon/check";
import AppMobileIcon from "@assets/svg/icon/AppMobile";
import BookOpenIcon from "@assets/svg/icon/BookOpen";
import BriefcaseIcon from "@assets/svg/icon/Briefcase";
import ChatbotIcon from "@assets/svg/icon/Chatbot";
import FormationIcon from "@assets/svg/icon/Formation";
import HeadphonesIcon from "@assets/svg/icon/Headphones";
import InstagramIcon from "@assets/svg/icon/Instagram";
import MapIcon from "@assets/svg/icon/Map";
import PencilIcon from "@assets/svg/icon/Pencil";
import PlayCircleIcon from "@assets/svg/icon/PlayCircle";
import QuizzIcon from "@assets/svg/icon/Quizz";
import SurveyIcon from "@assets/svg/icon/Survey";
import WaveIcon from "@assets/svg/icon/Wave";
import SimplePlusIcon from "@assets/svg/icon/SimplePlus";
import PuzzlePieceIcon from "@assets/svg/icon/PuzzlePiece";
import FileIcon from "@assets/svg/icon/File";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const TOOL_ITEM_TYPES = [
  "Article",
  "Vidéo",
  // "Podcast",
  // "Guide",
  // "Site",
  // "Fiche pratique",
  // "Série",
  // "BD",
  // "Livre",
  "Questionnaire",
  // "Outils",
  "App",
  "Chatbot",
  "Fichier",
  "Jeu",
  "Audio",
  "Carte",
  "Formation",
  "Exercice",
  "Observation",
  "PDF",
  "Quizz",
];

const AUDIENCE_TYPES = [
  {
    id: "parent",
    title: "Les parents",
  },
  {
    id: "child",
    title: "Les enfants/ado",
  },
  {
    id: "student",
    title: "Les étudiants",
  },
];

function ToolItemIcon({ type }: { type: ToolItemType | ToolItemType[] }) {
  // If type is an array, use the first type for the icon
  const displayType = Array.isArray(type) ? type[0] : type;

  switch (displayType) {
    case "Article":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Vidéo":
      return <PlayCircleIcon color="#3D6874" width={20} height={20} />;
    case "Podcast":
      return <HeadphonesIcon color="#3D6874" width={20} height={20} />;
    case "Guide":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Site":
      return <LinkIcon strokeColor="#3D6874" size={20} />;
    case "Fiche pratique":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    // case "Série":
    //   return <FilmIcon color="#3D6874" width={20} height={20} />;
    case "BD":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Livre":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Outils":
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
    case "App":
      return <AppMobileIcon color="#3D6874" width={20} height={20} />;
    case "Questionnaire":
      return <SurveyIcon color="#3D6874" width={20} height={20} />;
    case "Chatbot":
      return <ChatbotIcon color="#3D6874" width={20} height={20} />;
    case "PDF":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Carte":
      return <MapIcon color="#3D6874" width={20} height={20} />;
    case "Fichier":
      return <FileIcon color="#3D6874" width={20} height={20} />;
    case "Jeu":
      return <PuzzlePieceIcon color="#3D6874" width={20} height={20} />;
    case "Audio":
      return <HeadphonesIcon color="#3D6874" width={20} height={20} />;
    case "Carte":
      return <LinkIcon strokeColor="#3D6874" size={20} />;
    case "Formation":
      return <FormationIcon color="#3D6874" width={20} height={20} />;
    case "Exercice":
      return <PencilIcon color="#3D6874" width={20} height={20} />;
    case "Observation":
      return <WaveIcon color="#3D6874" width={20} height={20} />;
    case "Quizz":
      return <QuizzIcon color="#3D6874" width={20} height={20} />;
    default:
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
  }
}

export const ToolFilterBottomSheet = ({
  initialAudienceFilters,
  initialFormatFilters,
  onClose,
}: {
  initialFormatFilters: ToolItemType[];
  initialAudienceFilters: ToolItemAudience[];
  onClose: (filters?: { formatFilters: ToolItemType[]; audienceFilters: ToolItemAudience[] }) => void;
}) => {
  const [formatFilters, setFormatFilters] = useState<ToolItemType[]>(initialFormatFilters || []);
  const [audienceFilters, setAudienceFilters] = useState<ToolItemAudience[]>(initialAudienceFilters || []);

  const toggleAudienceFilter = (filterId: ToolItemAudience) => {
    setAudienceFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId);
      }
      return [...prev, filterId];
    });
  };

  const toggleFormatFilter = (filterType: ToolItemType) => {
    setFormatFilters((prev) => {
      if (prev.includes(filterType)) {
        return prev.filter((type) => type !== filterType);
      }
      return [...prev, filterType];
    });
  };

  const clearAllFilters = () => {
    setFormatFilters([]);
    setAudienceFilters([]);
  };

  const applyFilters = () => {
    onClose({ formatFilters, audienceFilters });
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="px-4">
          <View className="flex-row justify-between items-center">
            <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-900")}>Filtrer les outils</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Tout effacer</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center mb-4 mt-4">
            <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900")}>Des outils pour...</Text>
          </View>
          <View className="flex-row flex-wrap items-center">
            {AUDIENCE_TYPES.map((filter) => {
              const isSelected = audienceFilters.includes(filter.id as ToolItemAudience);
              // CNAM - secondary/Cyan (Accent)/700 darken 40
              if (isSelected) {
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => toggleAudienceFilter(filter.id as ToolItemAudience)}
                    className={mergeClassNames(
                      "px-4 py-2 border border-cnam-primary-400 rounded-xl mr-2 mb-2 flex-row items-center",
                      isSelected ? "bg-cnam-cyan-700-darken-40" : ""
                    )}
                  >
                    <View className={"w-5 h-4"}>
                      <CheckMarkIcon color={"white"} />
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1", "text-white")}>{filter.title}</Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => toggleAudienceFilter(filter.id as ToolItemAudience)}
                    className={mergeClassNames("px-4 py-2 border border-cnam-primary-400 rounded-xl mr-2 mb-2 flex-row items-center")}
                  >
                    <View className={"w-5 h-4"}>
                      <SimplePlusIcon />
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1", "text-cnam-primary-800")}>{filter.title}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          <View className="flex-row justify-between items-center mb-4 mt-4">
            <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900")}>Format</Text>
          </View>
          <View className="flex-row flex-wrap items-center">
            {TOOL_ITEM_TYPES.map((type) => {
              const isSelected = formatFilters.includes(type as ToolItemType);

              if (isSelected) {
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleFormatFilter(type as ToolItemType)}
                    className={mergeClassNames(
                      "px-4 py-2 border border-cnam-primary-400 rounded-xl mr-2 mb-2 flex-row items-center",
                      isSelected ? "bg-cnam-cyan-700-darken-40" : ""
                    )}
                  >
                    <View className={"w-5 h-4"}>
                      <CheckMarkIcon color={"white"} />
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1", isSelected ? "text-white" : "text-cnam-primary-800")}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleFormatFilter(type as ToolItemType)}
                    className={mergeClassNames("px-4 py-2 border border-cnam-primary-400 rounded-xl mr-2 mb-2 flex-row items-center")}
                  >
                    <View className={"w-5 h-4"}>
                      <SimplePlusIcon />
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1", isSelected ? "text-white" : "text-cnam-primary-800")}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`flex-column justify-between items-center p-6 px-6 bg-white/90 pb-10 w-full`}
      >
        <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 mb-2")}>Vous pourrez modifier cette sélection plus tard</Text>
        <JMButton onPress={applyFilters} title={"Voir les résultats"} />
      </View>
    </View>
  );
};
