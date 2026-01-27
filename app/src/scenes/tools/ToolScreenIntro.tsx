import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Animated } from "react-native";
import Header from "../../components/Header";
import logEvents from "../../services/logEvents";
import { TW_COLORS } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ValidatedStampIcon from "@assets/svg/icon/ValidatedStamp";
import { TOOL_COHERENCE_CARDIAQUE_ID, TOOLS_DATA } from "./toolsData";
import ToolItemCard from "./ToolItem";
import { ToolBottomSheet } from "./ToolBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { ToolThemeFilter } from "@/entities/ToolItem";
import DropPoint from "@assets/svg/icon/DropPoint";
import localStorage from "@/utils/localStorage";
import HeartFull from "@assets/svg/icon/HeartFull";
import HeartActivity from "@assets/svg/icon/HeartActivity";
import ChevronIcon from "@assets/svg/icon/chevron";
import BookmarkMinus from "@assets/svg/icon/BookmarkMinus";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Typography } from "@/components/Typography";

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
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<string[]>([]);
  const [showCrisisPlanButton, setShowCrisisPlanButton] = useState<boolean>(false);
  // Scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;

  const flatlistScrollRef = useRef<FlatList>(null);

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

  useEffect(() => {
    const cb = async () => {
      const keys = await AsyncStorage.getAllKeys();
      // if the key of crisis plan's first screen exist, show crisis plan
      const crisisPlanStarted = keys.includes("@CRISIS_PLAN_ALERT");
      setShowCrisisPlanButton(crisisPlanStarted);
    };
    cb();
  }, []);

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
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
                  <Typography className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                    Comment ces outils sont-ils séléctionnés ?
                  </Typography>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
            <View className="rounded-2xl bg-cnam-mauve-lighten-90 p-4 mx-2 mb-4 space-y-4 flex-col">
              <View className="flex-row items-center justify-start space-x-2">
                <HeartFull color={TW_COLORS.CNAM_PRIMARY_800} />
                <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-950")}>Support immédiat</Typography>
              </View>
              <View className="flex-row flex-1 space-x-2 items-stretch">
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={() => {
                      showBottomSheet(
                        <ToolBottomSheet
                          navigation={navigation}
                          toolItem={TOOLS_DATA[TOOL_COHERENCE_CARDIAQUE_ID]}
                          onBookmarkChange={loadBookmarks}
                          onClose={closeBottomSheet}
                        />,
                        loadBookmarks
                      );
                    }}
                    className=" border-cnam-mauve-0 border-2 bg-[#FCFAFD] p-6 items-center rounded-2xl mt-2 flex-col space-y-2 justify-center"
                  >
                    <HeartActivity color={TW_COLORS.CNAM_PRIMARY_800} />
                    <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950 text-center")}>
                      Cohérence cardiaque
                    </Typography>
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
                      <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950 text-center")}>
                        Plan de crise
                      </Typography>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row items-center justify-between mx-4 my-4">
                <View className="flex-row space-x-2 items-center justify-start">
                  <BookmarkMinus color={TW_COLORS.CNAM_PRIMARY_900} />
                  <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-950")}>
                    Vos outils favoris ({favoriteTools.length})
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("tool-screen", {
                      themeFilter: "Favoris",
                    });
                  }}
                  disabled={!favoriteTools.length}
                  className="flex-row space-x-2 items-center justify-start"
                >
                  <Typography
                    className={mergeClassNames(typography.textMdSemibold, !!favoriteTools.length ? "text-cnam-cyan-700-darken-40" : "text-gray-400")}
                  >
                    Tous
                  </Typography>
                  <View>
                    <ChevronIcon
                      width={12}
                      height={12}
                      direction="right"
                      color={!!favoriteTools.length ? TW_COLORS.CNAM_CYAN_700_DARKEN_40 : TW_COLORS.GRAY_400}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <ToolItemList data={favoriteTools} renderItem={renderItem} />
            </View>
            <View className="flex-col">
              <View className="flex-row items-center justify-between mx-4 my-4">
                <View className="flex-row space-x-2 items-center justify-start">
                  <DropPoint />
                  <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-950")}>
                    Tous les outils ({TOOLS_DATA.length})
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("tool-screen");
                  }}
                  className="flex-row space-x-2 items-center justify-start"
                >
                  <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Explorer</Typography>
                  <View>
                    <ChevronIcon width={12} height={12} direction="right" color={TW_COLORS.CNAM_PRIMARY_700} />
                  </View>
                </TouchableOpacity>
              </View>
              <ToolItemList data={TOOLS_DATA.slice(0, 3)} renderItem={renderItem} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ToolItemList = ({ data, renderItem }) => {
  return (
    <FlatList
      className="px-4 z-0"
      data={data}
      scrollEventThrottle={16}
      renderItem={renderItem}
      ListEmptyComponent={
        <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left")}>
          Explorez les outils et ajoutez vos contenus préférés en favoris pour y accéder rapidement.
        </Typography>
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
