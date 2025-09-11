import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions, Animated, Text, TouchableOpacity } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { colors } from "../../utils/colors";
import { useContext } from "react";
import { DiaryDataContext } from "../../context/diaryData";
import localStorage from "../../utils/localStorage";
import NPS from "../../services/NPS/NPS";
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
import { set } from "date-fns";
import { TW_COLORS } from "@/utils/constants";
import { SquircleView } from "expo-squircle-view";
const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

const Status = ({ navigation, startSurvey }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [bannerProNPSVisible, setBannerProNPSVisible] = useState(true);
  const [ongletActif, setOngletActif] = useState("all");
  const [checklistBannerVisible, setChecklistBannerVisible] = useState<boolean | null>(null); // null = loading, boolean = determined
  const [infoModalVisible, setInfoModalVisible] = useState<boolean | null>(null); // null = loading, boolean = determined
  const checklistBannerOpacity = React.useRef(new Animated.Value(1)).current;
  const infoModalOpacity = React.useRef(new Animated.Value(1)).current;
  const scrollRef = React.useRef();
  const { showLatestChangesModal } = useLatestChangesModal();

  React.useEffect(() => {
    updateInactivityReminder();
    checkOldReminderBefore154(); // can be deleted in few months
    checkOldReminderBefore193(); // can be deleted in few months
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo?.({
      y: 0,
      animated: false,
    });
  }, [ongletActif]);

  // ****************
  // BEGIN - MASQUAGE DU HEADER AU SCROLL
  const headerHeight = 50;
  const scrollY = React.useRef(new Animated.Value(0));
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY.current },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const scrollYClampedForHeader = Animated.diffClamp(scrollY.current, 0, headerHeight);

  let translateX = scrollY.current.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 0],
    extrapolateRight: "clamp",
  });

  const translateY = scrollYClampedForHeader.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });

  const opacity = translateY.interpolate({
    inputRange: [-headerHeight, 0],
    outputRange: [0, 1],
  });

  // FIN - MASQUAGE DU HEADER AU SCROLL
  // ****************

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
        const newModalDismissed = await localStorage.getIsInfoModalDismissed();
        console.log("show user modal", userIsNew, newModalDismissed, shouldShow);
        setInfoModalVisible(!userIsNew && !newModalDismissed && !shouldShow);
        showLatestChangesModal();
      })();
    }, [])
  );

  const noData = () => !Object.keys(diaryData).some((key) => diaryData[key]);

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
  };

  const handleDismissInfoModal = async () => {
    // Animate the banner to fade out smoothly
    Animated.timing(infoModalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      localStorage.setIsInfoModalDismissed(true);
      // After animation completes, hide the banner
      setInfoModalVisible(false);
    });
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

  const displayInfoModal = true;

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
                  }}
                  width="adapt"
                  title="C'est parti"
                />
              </View>
            </SquircleView>
          </Animated.View>
        )}
        {infoModalVisible && (
          <Animated.View
            style={{
              opacity: infoModalOpacity,
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
              <TouchableOpacity onPress={handleDismissInfoModal} style={{ position: "absolute", top: 0, right: 5, padding: 10 }}>
                <Text style={{ fontSize: 22, color: TW_COLORS.CNAM_PRIMARY_900, fontWeight: 700 }}>×</Text>
              </TouchableOpacity>
              <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900 mb-6")}>
                Jardin Mental fait peau neuve, mais rien ne change pour vous !
              </Text>
              <View className="flex-row mt-2">
                <JMButton
                  onPress={() => {
                    navigation.navigate("news");
                  }}
                  width="full"
                  title="En savoir plus"
                />
              </View>
            </SquircleView>
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
        <ContributeCard onPress={() => setNPSvisible(true)} />
      </>
    );
  }, [diaryData]);

  return (
    <>
      <SafeAreaView style={[styles.safe]}>
        <Animated.View style={{ flex: 1 }}>
          <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
          {/* todo : add this 👇 to make this component scrollable
            { transform: [{ translateY }] }
          */}
          <Animated.View style={[styles.headerContainer]}>
            {/* todo : add this 👇 to make this component scrollable
            style={{ opacity }}
          */}
            <Animated.View>
              <Header title="Mes entrées" navigation={navigation} />
            </Animated.View>
            <TabPicker ongletActif={ongletActif} onChange={setOngletActif} />
          </Animated.View>
          {ongletActif === "all" && !bannerProNPSVisible ? (
            <DiaryList
              ListHeaderComponent={renderHeader}
              ListFooterComponent={renderFooter}
              style={[styles.scrollView]}
              contentContainerStyle={[styles.scrollContainer, styles.container]}
              ref={scrollRef}
              onScroll={handleScroll}
            />
          ) : (
            <Animated.ScrollView
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}
              ref={scrollRef}
              bounces={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContainer}
              onScroll={handleScroll}
              showsVerticalScrollIndicator={false}
            >
              {renderScrollContent(ongletActif)}
            </Animated.ScrollView>
          )}
        </Animated.View>
      </SafeAreaView>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={translateX} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,

    paddingTop: 5,
    paddingBottom: 0,
    backgroundColor: colors.LIGHT_BLUE,
  },
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
    marginTop: 90,
  },
  container: {
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 80,
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
    backgroundColor: "#E0E0E0",
    marginVertical: 40,
    width: "50%",
    alignSelf: "center",
  },
});

export default Status;
