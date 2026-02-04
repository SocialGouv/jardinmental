import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Animated } from "react-native";
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
import ChevronIcon from "@assets/svg/icon/chevron";
import BannerHeader from "../onboarding-v2/BannerHeader";
import { Typography } from "@/components/Typography";

interface ToolsScreenProps {
  navigation: any;
  route: {
    params?: {
      themeFilter: ToolThemeFilter;
    };
  };
}

const ToolsScreen: React.FC<ToolsScreenProps> = ({ navigation, route }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [formatFilters, setFormatFilters] = useState<ToolItemType[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<ToolItemAudience[]>([]);
  const [themeFilter, setThemeFilter] = useState<ToolThemeFilter>(route.params?.themeFilter || "Tout");
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<string[]>([]);

  // Scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;

  // Ref for horizontal ScrollView
  const horizontalScrollViewRef = useRef<ScrollView>(null);

  const flatlistScrollRef = useRef<FlatList>(null);

  // Store button positions for accurate scrolling
  const buttonPositions = useRef<Map<ToolThemeFilter, number>>(new Map()).current;

  // Load bookmarked tool items on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const bookmarks = await localStorage.getBookmarkedToolItems();
    setBookmarkedToolIds(bookmarks);
  };

  // Function to store button layout position
  const onButtonLayout = (theme: ToolThemeFilter, event: any) => {
    const { x } = event.nativeEvent.layout;
    buttonPositions.set(theme, x);
  };

  // Function to scroll to selected theme
  const scrollToSelectedTheme = (theme: ToolThemeFilter) => {
    if (horizontalScrollViewRef.current) {
      const position = buttonPositions.get(theme);

      if (position !== undefined) {
        // Scroll to the measured position, with some offset to center it better
        horizontalScrollViewRef.current.scrollTo({
          x: Math.max(0, position - 20),
          animated: true,
        });
      }
    }
  };

  // Scroll to selected theme when themeFilter changes
  useEffect(() => {
    // Small timeout to ensure the UI has updated
    const timer = setTimeout(() => {
      scrollToSelectedTheme(themeFilter);
      if (flatlistScrollRef.current) {
        flatlistScrollRef.current.scrollToOffset({
          offset: 0,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [themeFilter]);

  const filters = React.useMemo(() => {
    const combinedFilters = [...formatFilters, ...audienceFilters];
    return combinedFilters;
  }, [formatFilters, audienceFilters]);

  const filteredTools = React.useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      // Apply format and audience filters (existing filters)
      const matchesFormat = formatFilters.length === 0 || tool.type.some((t) => formatFilters.includes(t));
      const matchesAudience =
        audienceFilters.length === 0 ||
        tool.audience.every((aud) => {
          return audienceFilters.includes(aud);
        });

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
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{
        backgroundColor: TW_COLORS.CNAM_PRIMARY_50,
      }}
    >
      <BannerHeader
        handlePrevious={async () => {
          navigation.goBack();
        }}
        bannerContainerStyle={{
          paddingVertical: 16,
          paddingBottom: 0,
          paddingHorizontal: 0,
        }}
        header={null}
        leftComponent={
          <TouchableOpacity
            onPress={async () => {
              navigation.goBack();
            }}
            className="flex-row space-x-2 items-center justify-center"
          >
            <ChevronIcon direction="left" color={TW_COLORS.CNAM_PRIMARY_25} />
            <Typography className="text-cnam-primary-25">Tous les outils</Typography>
          </TouchableOpacity>
        }
        small={true}
        title={""}
      />
      <View className="z-2 w-full bg-cnam-primary-50 pt-4">
        <View>
          <View className="flex-row mb-6">
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
              className="p-2 ml-2"
            >
              <MenuIcon />
            </TouchableOpacity>
            <ScrollView ref={horizontalScrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} className="space-x-1">
              <View className="flex-row space-x-2 items-center mx-4">
                <View onLayout={(e) => onButtonLayout("Tout", e)}>
                  <ToolFilterButton label="Tout" selected={themeFilter === "Tout"} onPress={() => setThemeFilter("Tout")} />
                </View>
                <View onLayout={(e) => onButtonLayout("Favoris", e)}>
                  <ToolFilterButton
                    label="Favoris"
                    selected={themeFilter === "Favoris"}
                    onPress={() => setThemeFilter("Favoris")}
                    icon={<Bookmark width={16} height={16} color={themeFilter === "Favoris" ? TW_COLORS.WHITE : TW_COLORS.CNAM_PRIMARY_900} />}
                  />
                </View>
                {ToolItemThemes.map((theme) => (
                  <View key={theme} onLayout={(e) => onButtonLayout(theme, e)}>
                    <ToolFilterButton label={theme} selected={themeFilter === theme} onPress={() => setThemeFilter(theme)} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="flex-row justify-between items-center mb-4 px-4">
            <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-800 text-base flex-1")}>
              {filteredTools.length} {filteredTools.length === 1 ? "outil" : "outils"}
            </Typography>
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
                      }
                      closeBottomSheet();
                    }}
                  />
                );
              }}
              className="flex-row items-center"
            >
              <Tune width={16} height={16} color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
              <Typography className="text-cnam-cyan-700-darken-40 text-base ml-2">Filtres ({filters.length})</Typography>
            </TouchableOpacity>
            {filters.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setFormatFilters([]);
                  setAudienceFilters([]);
                }}
              >
                <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800 ml-2")}>{"Effacer"}</Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <FlatList
        className="px-4 z-0"
        data={filteredTools}
        ref={flatlistScrollRef}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          return (
            <ToolItemCard
              toolItem={item}
              isBookmarked={bookmarkedToolIds.includes(item.id)}
              onPress={(toolItem) => {
                // Log when opening a tool
                logEvents.logOutilsOpen(toolItem.matomoId);
                showBottomSheet(
                  <ToolBottomSheet navigation={navigation} toolItem={toolItem} onBookmarkChange={loadBookmarks} onClose={closeBottomSheet} />,
                  loadBookmarks
                );
              }}
              onBookmarkChange={loadBookmarks}
            />
          );
        }}
        ListEmptyComponent={
          <View className=" z-10 w-full items-center">
            <View className="absolute w-full flex-column space-y-2">
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20 h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20  h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20  h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20  h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20  h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
              <View className="flex-row w-full space-x-2 opacity-30">
                <View className="bg-white rounded-2xl w-20  h-24"></View>
                <View className="bg-white rounded-2xl  h-24 flex-1"></View>
              </View>
            </View>
            <View className="absolute -z-1 w-full items-center">
              <View
                className={"bg-cnam-primary-100 h-[150] w-[150] rounded-full items-center justify-center"}
                style={{ top: themeFilter !== "Favoris" ? 20 : 20 }}
              >
                {themeFilter === "Favoris" && <Bookmark width={31} height={31} color={"#84BECD"} />}
              </View>
            </View>
            {themeFilter !== "Favoris" && (
              <View className="px-4 z-20">
                <Image
                  style={{ width: 80, height: 80, left: 40, top: 60, resizeMode: "contain" }}
                  source={require("../../../assets/imgs/illustration-no-note.png")}
                />
              </View>
            )}
            <View
              className={mergeClassNames(
                "border border-cnam-primary-200 rounded-2xl p-4 py-6 bg-white",
                themeFilter === "Favoris" ? "mt-32" : "mt-12"
              )}
              style={{ borderWidth: 0.5 }}
            >
              {themeFilter !== "Favoris" && (
                <>
                  <Typography className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                    Aucun outil ne correspond à vos filtres.{" "}
                  </Typography>
                  <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                    Essayez d’élargir la recherche pour découvrir plus d’outils.
                  </Typography>
                  <TouchableOpacity
                    onPress={() => {
                      setFormatFilters([]);
                      setAudienceFilters([]);
                      setThemeFilter("Tout");
                    }}
                  >
                    <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 text-center px-4 mt-4")}>
                      Réinitialiser les filtres
                    </Typography>
                  </TouchableOpacity>
                </>
              )}
              {themeFilter === "Favoris" && (
                <>
                  <Typography className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                    Il n’y a pas de favoris pour l’instant
                  </Typography>
                  <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                    Explorez les outils et ajoutez vos contenus préférés en favoris pour y accéder rapidement.
                  </Typography>
                </>
              )}
            </View>
          </View>
        }
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        nestedScrollEnabled={false}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </SafeAreaView>
  );
};

export default ToolsScreen;
