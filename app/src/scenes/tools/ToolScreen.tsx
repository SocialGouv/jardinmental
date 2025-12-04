import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/Header";
import logEvents from "../../services/logEvents";
import { TW_COLORS } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ValidatedStampIcon from "@assets/svg/icon/ValidatedStamp";
import { ToolItemAudience, ToolItemType, TOOLS_DATA } from "./toolsData";
import ToolItemCard from "./ToolItem";
import Tune from "@assets/svg/icon/Tune";
import { ToolBottomSheet } from "./ToolBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { ToolFilterBottomSheet } from "./ToolFilterBottomSheet";
import { ToolItemThemes, ToolItemTheme, ToolThemeFilter } from "@/entities/ToolItem";
import Bookmark from "@assets/svg/icon/Bookmark";
import MenuIcon from "@assets/svg/icon/Menu";
import { ToolFilterButton } from "./ToolFilterButton";
import localStorage from "@/utils/localStorage";
import { ToolThemeFilterBottomSheet } from "./ToolThemeFilterBottomSheet";

interface ToolsScreenProps {
  navigation: any;
}

const ToolsScreen: React.FC<ToolsScreenProps> = ({ navigation }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [formatFilters, setFormatFilters] = useState<ToolItemType[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<ToolItemAudience[]>([]);
  const [themeFilter, setThemeFilter] = useState<ToolThemeFilter>("Tout");
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<string[]>([]);
  // Load bookmarked tool items on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      const bookmarks = await localStorage.getBookmarkedToolItems();
      setBookmarkedToolIds(bookmarks);
    };
    loadBookmarks();
  }, []);

  const filters = React.useMemo(() => {
    const combinedFilters = [...formatFilters, ...audienceFilters];
    return combinedFilters;
  }, [formatFilters, audienceFilters]);

  const filteredTools = React.useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      // Apply format and audience filters (existing filters)
      const matchesFormat = formatFilters.length === 0 || tool.type.some((t) => formatFilters.includes(t));
      const matchesAudience = audienceFilters.length === 0 || tool.audience.some((aud) => audienceFilters.includes(aud));

      // Apply theme filter (new filter)
      let matchesTheme = true;
      if (themeFilter === "Favoris") {
        matchesTheme = bookmarkedToolIds.includes(tool.id);
      } else if (themeFilter !== "Tout") {
        // If a specific theme is selected, only show tools with that theme
        matchesTheme = tool.themes.includes(themeFilter);
      }

      return matchesFormat && matchesAudience && matchesTheme;
    });
  }, [formatFilters, audienceFilters, themeFilter, bookmarkedToolIds]);

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1">
      <View className="bg-cnam-primary-800 flex flex-row justify-between pb-0">
        <Header title="Ressources" navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="mt-4">
          <View className="mb-6 px-4">
            <Text className="text-cnam-primary-950 text-2xl font-semibold mb-3">Explorez les outils pour agir</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("tool-selection-info");
            }}
            className="flex-row bg-cnam-cyan-lighten-80 items-center mb-8 space-x-1 rounded-full px-3 self-start mx-4"
          >
            <ValidatedStampIcon />
            <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Comment ces outils sont-ils séléctionnés ?</Text>
          </TouchableOpacity>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mb-6 space-x-1">
            <View className="flex-row space-x-2 items-center mx-4">
              <TouchableOpacity
                onPress={() => {
                  showBottomSheet(
                    <ToolThemeFilterBottomSheet
                      initialThemeFilter={themeFilter}
                      onClose={({ selectedThemeFilter }) => {
                        if (selectedThemeFilter) {
                          setThemeFilter(selectedThemeFilter);
                        }
                        closeBottomSheet();
                      }}
                    />
                  );
                }}
                className="p-2"
              >
                <MenuIcon />
              </TouchableOpacity>
              <ToolFilterButton label="Tout" selected={themeFilter === "Tout"} onPress={() => setThemeFilter("Tout")} />
              <ToolFilterButton
                label="Favoris"
                selected={themeFilter === "Favoris"}
                onPress={() => setThemeFilter("Favoris")}
                icon={<Bookmark width={16} height={16} color={themeFilter === "Favoris" ? TW_COLORS.WHITE : TW_COLORS.CNAM_PRIMARY_900} />}
              />
              {ToolItemThemes.map((theme) => (
                <ToolFilterButton key={theme} label={theme} selected={themeFilter === theme} onPress={() => setThemeFilter(theme)} />
              ))}
            </View>
          </ScrollView>
          <View className="flex-row justify-between items-center mb-4 px-4">
            <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-800 text-base flex-1")}>
              {filteredTools.length} outils
            </Text>
            <TouchableOpacity
              onPress={() => {
                showBottomSheet(
                  <ToolFilterBottomSheet
                    initialAudienceFilters={audienceFilters}
                    initialFormatFilters={formatFilters}
                    onClose={(filters) => {
                      if (filters) {
                        setFormatFilters(filters.formatFilters);
                        setAudienceFilters(filters.audienceFilters);
                        console.log("Format filters:", filters.formatFilters);
                        console.log("Audience filters:", filters.audienceFilters);
                      }
                      closeBottomSheet();
                    }}
                  />
                );
              }}
              className="flex-row items-center"
            >
              <Tune width={16} height={16} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
              <Text className="text-cnam-cyan-700-darken-40 text-base ml-2">Filtres ({filters.length})</Text>
            </TouchableOpacity>
            {filters.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setFormatFilters([]);
                  setAudienceFilters([]);
                }}
              >
                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800 ml-2")}>{"Effacer"}</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            className="px-4"
            data={filteredTools}
            renderItem={({ item }) => {
              return (
                <ToolItemCard
                  toolItem={item}
                  onPress={(toolItem) => {
                    // TODO: Implement navigation to tool detail or open URL
                    showBottomSheet(
                      <ToolBottomSheet
                        navigation={navigation}
                        toolItem={toolItem}
                        onClose={async () => {
                          closeBottomSheet();
                          // Refresh bookmarks after closing the bottom sheet
                          const bookmarks = await localStorage.getBookmarkedToolItems();
                          setBookmarkedToolIds(bookmarks);
                        }}
                      />
                    );
                  }}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // ← disables FlatList scrolling
            nestedScrollEnabled={false} // ← not needed, but clean
            removeClippedSubviews={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToolsScreen;
