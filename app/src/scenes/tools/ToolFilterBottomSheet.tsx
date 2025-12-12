import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React, { useEffect, useState } from "react";
import JMButton from "@/components/JMButton";
import { ToolItemAudience, ToolItemEntity, ToolItemType } from "./toolsData";
import CheckMarkIcon from "@assets/svg/icon/check";
import SimplePlusIcon from "@assets/svg/icon/SimplePlus";
import { ToolItemIcon } from "./toolUtils";
import { TW_COLORS } from "@/utils/constants";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const TOOL_ITEM_TYPES = [
  "Article",
  "Vidéo",
  "Questionnaire",
  "App",
  "Chatbot",
  "Fichier",
  "Jeu",
  "Audio",
  "Carte",
  "Formation",
  "Exercice",
  "Observation",
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
  // {
  //   id: "student",
  //   title: "Les étudiants",
  // },
];

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
                      <CheckMarkIcon color={"white"} width={16} height={16} />
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
                      <CheckMarkIcon color={"white"} width={16} height={16} />
                    </View>
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1 mr-1", isSelected ? "text-white" : "text-cnam-primary-800")}>
                      {type}
                    </Text>
                    <ToolItemIcon type={type} color={TW_COLORS.WHITE} width={16} height={16} />
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
                    <Text className={mergeClassNames(typography.textMdMedium, "ml-1 mr-1", isSelected ? "text-white" : "text-cnam-primary-800")}>
                      {type}
                    </Text>
                    <ToolItemIcon type={type} color={TW_COLORS.CNAM_PRIMARY_800} width={16} height={16} />
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
        <JMButton onPress={applyFilters} title={"Voir les résultats"} className="mb-4" />
      </View>
    </View>
  );
};
