import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Dimensions, Animated, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { colors } from "../../utils/colors";
import { useContext } from "react";
import { DiaryDataContext } from "../../context/diaryData";
import localStorage from "../../utils/localStorage";
import NPSManager from "../../services/NPS/NPSManager";
import Bubble from "../../components/bubble";
import BannerProNPS from "./bannerProNPS";
import TabPicker from "./TabPicker";
import RecapCompletion from "./recapCompletion";
import NoData from "./NoData";
import Diary from "../diary";
import ContributeCard from "../contribute/contributeCard";
import FloatingPlusButton from "../../components/FloatingPlusButton";
import { DiaryList } from "./DiaryList";
import { updateInactivityReminder } from "../reminder/inactivityReminder";
import { checkOldReminderBefore154, checkOldReminderBefore193 } from "../reminder/checkOldReminder";
import { useLatestChangesModal } from "../news/latestChangesModal";
import { VALID_SCREEN_NAMES } from "@/scenes/onboarding-v2/index";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import JMButton from "@/components/JMButton";
import { shouldShowChecklistBanner, handlePlusTardClick as handleBannerDismiss } from "../../utils/checklistBanner";
import { TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import { SquircleView } from "expo-squircle-view";
import { interpolate, useAnimatedScrollHandler, useDerivedValue, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useStatusBar } from "@/context/StatusBarContext";
import logEvents from "@/services/logEvents";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BookOpenIcon from "@assets/svg/icon/BookOpen";
import Film from "@assets/svg/icon/Film";
import PlayCircleIcon from "@assets/svg/icon/PlayCircle";
import HeadphonesIcon from "@assets/svg/icon/Headphones";
import BriefcaseIcon from "@assets/svg/icon/Briefcase";
import CloseCross from "@assets/svg/icon/CloseCross";
import ArrowCircleRightIcon from "@assets/svg/icon/ArrowCircleRight";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { BeckBottomSheet } from "../tools/BeckBottomSheet";
import { TOOL_BECK_ID } from "../tools/toolsData";

const Status = ({ navigation, startSurvey }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [bannerProNPSVisible, setBannerProNPSVisible] = useState(true);
  const [ongletActif, setOngletActif] = useState("all");
  const [checklistBannerVisible, setChecklistBannerVisible] = useState<boolean | null>(null); // null = loading, boolean = determined
  const checklistBannerOpacity = React.useRef(new Animated.Value(1)).current;
  const scrollRef = React.useRef();
  const { showLatestChangesModal } = useLatestChangesModal();
  const insets = useSafeAreaInsets();
  const { showBottomSheet } = useBottomSheet();
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );

  React.useEffect(() => {
    const initializeReminder = async () => {
      const onboardingIsDone = await localStorage.getOnboardingDone();
      if (onboardingIsDone) {
        updateInactivityReminder();
      }
    };
    initializeReminder();
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo?.({
      y: 0,
      animated: false,
    });
  }, [ongletActif]);

  const scrollY = useSharedValue(0);
  const scrollHandler = (event) => {
    "worklet";
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  // Animated value for floating button translateX
  const plusPosition = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, 100], [80, 0], "clamp");
  });

  const [resourceModalVisible, setResourceModalVisible] = useState<boolean | null>(null);
  const resourceModalOpacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const onboardingStep = await localStorage.getOnboardingStep();
      const onboardingIsDone = await localStorage.getOnboardingDone();

      //if ONBOARDING_DONE is true, do nothing
      if (onboardingIsDone) {
        return;
      } else {
        const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
        await localStorage.setIsNewUser(true);
        if (isFirstAppLaunch !== "false") {
          const onboardingStep = await localStorage.getOnboardingStep();
          let state;
          if (onboardingStep && VALID_SCREEN_NAMES.includes(onboardingStep)) {
            const index = VALID_SCREEN_NAMES.indexOf(onboardingStep);
            const routes = VALID_SCREEN_NAMES.slice(0, index + 1).map((name) => ({ name: name, key: name }));
            state = {
              index,
              routes,
            };
          }
          navigation.reset({
            routes: [
              {
                name: "onboarding",
                params: { screen: onboardingStep || "OnboardingPresentation" },
                state,
              },
            ],
          });
        }
      }
    })();
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const bannerProNPSDone = await localStorage.getNpsProContact();
        const supported = await localStorage.getSupported();
        setBannerProNPSVisible(supported === "PRO" && !bannerProNPSDone);

        // Check if checklist banner should be shown using new logic
        const shouldShow = await shouldShowChecklistBanner();
        setChecklistBannerVisible(shouldShow);
        checklistBannerOpacity.setValue(shouldShow ? 1 : 0);
        const userIsNew = await localStorage.getIsNewUser();
        const resourceModalDismissed = await localStorage.getIsInfoModalDismissed();
        setResourceModalVisible(!resourceModalDismissed && !shouldShow);
        showLatestChangesModal();
        // The following block can be deleted once most of the users are using 1.13.15
        const beckAsFavorite = await localStorage.getBeckHasBeenAutomaticallySetAsFavoriteAfterAppUpdate();
        const hasBeckHistory = !!Object.keys(diaryData).find((date) => {
          return (diaryData[date] || {})["becks"];
        });
        if (hasBeckHistory && !beckAsFavorite) {
          await localStorage.setBeckAutomaticallyAsFavorite();
          await localStorage.bookmarkToolItem(TOOL_BECK_ID);
          showBottomSheet(<BeckBottomSheet navigation={navigation} />);
        }
      })();
    }, [])
  );

  const noData = () => !Object.keys(diaryData).some((key) => diaryData[key]);

  const handleDismissResourceModal = async () => {
    // Animate the banner to fade out smoothly
    Animated.timing(resourceModalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      localStorage.setIsInfoModalDismissed(true);
      // After animation completes, hide the banner
      setResourceModalVisible(false);
    });
  };

  const handlePlusTardClick = async () => {
    // Animate the banner to fade out smoothly
    Animated.timing(checklistBannerOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // After animation completes, hide the banner
      setChecklistBannerVisible(false);
    });

    // Use the new enhanced banner dismiss logic
    await handleBannerDismiss();
    logEvents.logPassChecklist();
  };

  const renderScrollContent = (onglet) => {
    if (onglet === "all") {
      // display only LIMIT_PER_PAGE days
      // button that will display LIMIT_PER_PAGE more each time
      return <View style={styles.container}>{bannerProNPSVisible && <BannerProNPS onClose={() => setBannerProNPSVisible(false)} />}</View>;
    }
    if (onglet === "NOTES") {
      return <Diary hideDeader />;
    }
    return null;
  };

  const renderHeader = useCallback(() => {
    return (
      <>
        {checklistBannerVisible && (
          <Animated.View
            style={{
              opacity: checklistBannerOpacity,
            }}
          >
            <SquircleView
              className="p-8 bg-cnam-cyan-lighten-80 mb-4 rounded-xl"
              cornerSmoothing={100} // 0-100
              preserveSmoothing={true} // false matches figma, true has more rounding
              style={{
                borderRadius: 20,
              }}
            >
              <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900 mb-6")}>
                Il vous reste quelques étapes pour bien démarrer
              </Text>
              <Text className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-900")}>
                Faites de Jardin Mental un espace qui vous ressemble, pour un suivi plus juste et plus utile.
              </Text>
              <View className="flex-row mt-6">
                <JMButton onPress={handlePlusTardClick} width="adapt" variant="text" title="Plus tard" />
                <JMButton
                  onPress={() => {
                    navigation.navigate("checklist");
                    logEvents.logOpenChecklist();
                  }}
                  width="adapt"
                  title="C'est parti"
                />
              </View>
            </SquircleView>
          </Animated.View>
        )}
        {resourceModalVisible && (
          <Animated.View
            style={{
              opacity: resourceModalOpacity,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("tabs", { initialTab: "Resources" });
              }}
            >
              <SquircleView
                className="mb-4"
                cornerSmoothing={100} // 0-100
                preserveSmoothing={true} // false matches figma, true has more rounding
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#66CDBB", "#66C9EC", "#FCF0D3", "#F9D1E6", "#D9BDE2", "#9EB3D7"]}
                  locations={[0.0379, 0.168, 0.402, 0.6448, 0.7792, 0.9136]}
                  start={{ x: 0.06, y: 0.73 }}
                  end={{ x: 0.94, y: 0.27 }}
                  style={{ padding: 2 }}
                >
                  <View className="bg-cnam-primary-50" style={{ padding: 20, borderRadius: 20 }}>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row space-x-2">
                        <View style={{ transform: [{ rotate: "-10deg" }] }}>
                          <BookOpenIcon color={TW_COLORS.CNAM_PRIMARY_300} width={15} height={15} />
                        </View>
                        <View style={{ transform: [{ rotate: "10deg" }] }}>
                          <PlayCircleIcon color={TW_COLORS.CNAM_PRIMARY_300} width={15} height={15} />
                        </View>
                        <View style={{ transform: [{ rotate: "-10deg" }] }}>
                          <Film color={TW_COLORS.CNAM_PRIMARY_300} width={15} height={15} />
                        </View>
                        <View style={{ transform: [{ rotate: "10deg" }] }}>
                          <HeadphonesIcon color={TW_COLORS.CNAM_PRIMARY_300} width={15} height={15} />
                        </View>

                        <View style={{ transform: [{ rotate: "10deg" }] }}>
                          <BriefcaseIcon color={TW_COLORS.CNAM_PRIMARY_300} width={15} height={15} />
                        </View>
                      </View>
                      <TouchableOpacity onPress={handleDismissResourceModal}>
                        <CloseCross color={TW_COLORS.CNAM_PRIMARY_900} />
                      </TouchableOpacity>
                    </View>
                    <Text className={mergeClassNames(typography.textLgSemibold, "text-left text-cnam-primary-950 mb-2 mt-3")}>
                      Mieux comprendre la santé mentale{" "}
                    </Text>
                    <Text className={mergeClassNames(typography.textSmMedium, "text-left text-cnam-primary-800")}>
                      Découvrez le guide complet pour comprendre, repérer et agir.
                    </Text>
                    <View className="flex-row self-end items-center">
                      <View className="mt-4 flex-row items-center">
                        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 mr-2")}>S'informer</Text>
                        <ArrowCircleRightIcon />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </SquircleView>
            </TouchableOpacity>
          </Animated.View>
        )}
        <RecapCompletion />
        <View style={styles.divider} />
      </>
    );
  }, [diaryData, checklistBannerVisible, checklistBannerOpacity, handlePlusTardClick]);

  const renderFooter = useCallback(() => {
    return (
      <>
        <Bubble diaryData={diaryData} />
        <ContributeCard onPress={() => NPSManager.showNPS()} />
      </>
    );
  }, [diaryData]);

  return (
    <>
      <SafeAreaView edges={["left", "right"]} style={[styles.safe]}>
        <Animated.View style={{ flex: 1 }}>
          <Header title={"Mes observations 🌱"} navigation={navigation} scrollY={scrollY} scrollThreshold={75} />
          <TabPicker ongletActif={ongletActif} onChange={setOngletActif} />
          {ongletActif === "all" && !bannerProNPSVisible ? (
            <DiaryList
              ListHeaderComponent={renderHeader}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              style={[styles.scrollView]}
              contentContainerStyle={[
                styles.container,
                {
                  paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
                },
              ]}
              ref={scrollRef}
              onScroll={scrollHandler}
            />
          ) : (
            <Animated.ScrollView
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}
              ref={scrollRef}
              bounces={false}
              style={[styles.scrollView]}
              contentContainerStyle={{
                paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
              }}
              onScroll={scrollHandler}
              showsVerticalScrollIndicator={false}
            >
              {renderScrollContent(ongletActif)}
            </Animated.ScrollView>
          )}
        </Animated.View>
      </SafeAreaView>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={plusPosition} />
    </>
  );
};

const styles = StyleSheet.create({
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  arrowDownLabel: {
    color: colors.BLUE,
  },
  versionContainer: {
    marginTop: 20,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  safe: {
    flex: 1,
    backgroundColor: colors.LIGHT_BLUE,
  },
  scrollView: {
    backgroundColor: "white",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: "700",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  verticalBorder: {
    borderLeftWidth: 1,
    borderColor: "#00CEF7",
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 350 ? 19 : 15,
    flexWrap: "wrap",
    textAlign: "center",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
});

export default Status;
