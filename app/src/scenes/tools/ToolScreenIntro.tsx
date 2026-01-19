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
import { ToolBottomSheet } from "./ToolBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { ToolThemeFilter } from "@/entities/ToolItem";
import Bookmark from "@assets/svg/icon/Bookmark";
import DropPoint from "@assets/svg/icon/DropPoint";
import localStorage from "@/utils/localStorage";
import HeartFull from "@assets/svg/icon/HeartFull";
import HeartActivity from "@assets/svg/icon/HeartActivity";
import ChevronIcon from "@assets/svg/icon/chevron";
import BookmarkMinus from "@assets/svg/icon/BookmarkMinus";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ToolsScreenIntroProps {
  navigation: any;
  route: {
    params?: {
      themeFilter: ToolThemeFilter;
    };
  };
}

const ToolsScreenIntro: React.FC<ToolsScreenIntroProps> = ({ navigation, route }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [formatFilters, setFormatFilters] = useState<ToolItemType[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<ToolItemAudience[]>([]);
  const [themeFilter, setThemeFilter] = useState<ToolThemeFilter>(route.params?.themeFilter || "Tout");
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<string[]>([]);
  const [showCrisisPlanButton, setShowCrisisPlanButton] = useState<boolean>(false);
  // Scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;

  // Ref for horizontal ScrollView
  const horizontalScrollViewRef = useRef<ScrollView>(null);

  const flatlistScrollRef = useRef<FlatList>(null);

  // Store button positions for accurate scrolling
  const buttonPositions = useRef<Map<ToolThemeFilter, number>>(new Map()).current;

  // Interpolate opacity for info button
  const infoButtonOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Interpolate height scale for info button
  const infoButtonScale = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [90, 0],
    extrapolate: "clamp",
  });

  // Interpolate height scale for info button
  const infoMargin = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [2, 0],
    extrapolate: "clamp",
  });

  // Interpolate font size for title
  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [24, 18],
    extrapolate: "clamp",
  });

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

  useEffect(() => {
    const cb = async () => {
      const keys = await AsyncStorage.getAllKeys();
      // if the key of crisis plan's first screen exist, show crisis plan
      const crisisPlanStarted = keys.includes("@CRISIS_PLAN_ALERT");
      setShowCrisisPlanButton(crisisPlanStarted);
    };
    cb();
  }, []);

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

  const favoriteTools = React.useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      let matchesTheme = true;
      matchesTheme = bookmarkedToolIds.includes(tool.id);
      return matchesTheme;
    });
  }, [bookmarkedToolIds]);

  const renderItem = ({ item }) => {
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
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-cnam-primary-50 ">
      <View className=" z-2 w-full bg-cnam-primary-50">
        <View className="bg-cnam-primary-800 flex flex-row justify-between pb-0">
          <Header navigation={navigation} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className=" flex-col space-y-4 pt-6">
            <Animated.View
              style={{
                opacity: infoButtonOpacity,
                height: infoButtonScale,
                marginTop: infoMargin,
                overflow: "hidden",
              }}
            >
              <View className="px-4">
                <Animated.Text
                  className="text-cnam-primary-950 font-semibold mb-3"
                  style={{
                    fontSize: titleFontSize,
                  }}
                >
                  Explorez les outils pour agir
                </Animated.Text>
              </View>
              <Animated.View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("tool-selection-info");
                  }}
                  className="flex-row bg-cnam-cyan-lighten-80 items-center mb-8 space-x-1 rounded-full px-3 self-start mx-4"
                >
                  <ValidatedStampIcon />
                  <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                    Comment ces outils sont-ils séléctionnés ?
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
            <View className="rounded-2xl bg-cnam-mauve-lighten-90 p-4 mx-2 mb-4 space-y-4 flex-col">
              <View className="flex-row items-center justify-start space-x-2">
                <HeartFull color={TW_COLORS.CNAM_PRIMARY_800} />
                <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-950")}>Support immédiat</Text>
              </View>
              <View className="flex-row flex-1 space-x-2 items-stretch">
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("coherence-cardiaque-video");
                    }}
                    className=" border-cnam-mauve-0 border-2 bg-[#FCFAFD] p-6 items-center rounded-2xl mt-2 flex-col space-y-2 justify-center"
                  >
                    <HeartActivity color={TW_COLORS.CNAM_PRIMARY_800} />
                    <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950 text-center")}>Cohérence cardiaque</Text>
                  </TouchableOpacity>
                </View>

                {showCrisisPlanButton && (
                  <View className="flex-1">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("crisis-plan-slide-sumup-list");
                      }}
                      className="flex-1 border-cnam-mauve-0 border-2 bg-[#FCFAFD] p-6 items-center rounded-2xl mt-2 flex-col space-y-2 justify-center"
                    >
                      <LifeBuoy width={32} height={32} color={TW_COLORS.CNAM_PRIMARY_800} />
                      <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950 text-center")}>Plan de crise</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row items-center justify-between mx-4 my-4">
                <View className="flex-row space-x-2 items-center justify-start">
                  <BookmarkMinus color={TW_COLORS.CNAM_PRIMARY_900} />
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>Vos outils favoris</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("tool-screen", {
                      themeFilter: "Favoris",
                    });
                  }}
                  className="flex-row space-x-2 items-center justify-start"
                >
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Tous</Text>
                  <View>
                    <ChevronIcon width={12} height={12} direction="right" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
                  </View>
                </TouchableOpacity>
              </View>
              <ToolItemList data={favoriteTools} renderItem={renderItem} themeFilter={"Favoris"} />
            </View>
            <View className="flex-col">
              <View className="flex-row items-center justify-between mx-4 my-4">
                <View className="flex-row space-x-2 items-center justify-start">
                  <DropPoint />
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>Tous les outils ({TOOLS_DATA.length})</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("tool-screen");
                  }}
                  className="flex-row space-x-2 items-center justify-start"
                >
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Explorer</Text>
                  <View>
                    <ChevronIcon width={12} height={12} direction="right" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                className="px-4 z-0"
                data={TOOLS_DATA.slice(0, 3)}
                ref={flatlistScrollRef}
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
                          <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                            Aucun outil ne correspond à vos filtres.{" "}
                          </Text>
                          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                            Essayez d’élargir la recherche pour découvrir plus d’outils.
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setFormatFilters([]);
                              setAudienceFilters([]);
                              setThemeFilter("Tout");
                            }}
                          >
                            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 text-center px-4 mt-4")}>
                              Réinitialiser les filtres
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {themeFilter === "Favoris" && (
                        <>
                          <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                            Il n’y a pas de favoris pour l’instant
                          </Text>
                          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                            Explorez les outils et ajoutez vos contenus préférés en favoris pour y accéder rapidement.
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                }
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ToolItemList = ({ data, renderItem, themeFilter }) => {
  return (
    <FlatList
      className="px-4 z-0"
      data={data}
      scrollEventThrottle={16}
      renderItem={renderItem}
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
            className={mergeClassNames("border border-cnam-primary-200 rounded-2xl p-4 py-6 bg-white", themeFilter === "Favoris" ? "mt-32" : "mt-12")}
            style={{ borderWidth: 0.5 }}
          >
            {themeFilter !== "Favoris" && (
              <>
                <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                  Aucun outil ne correspond à vos filtres.{" "}
                </Text>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                  Essayez d’élargir la recherche pour découvrir plus d’outils.
                </Text>
              </>
            )}
            {themeFilter === "Favoris" && (
              <>
                <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                  Il n’y a pas de favoris pour l’instant
                </Text>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                  Explorez les outils et ajoutez vos contenus préférés en favoris pour y accéder rapidement.
                </Text>
              </>
            )}
          </View>
        </View>
      }
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      nestedScrollEnabled={false}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ToolsScreenIntro;
