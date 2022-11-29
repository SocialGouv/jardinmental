import React, { createContext, useCallback, useContext, useState } from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useLayout } from "@react-native-community/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button2 } from "../../components/Button2";
import Svg, { Path } from "react-native-svg";
import Lottie from "lottie-react-native";
import localStorage from "../../utils/localStorage";

const latestChanges = {
  appversion: 169,
  content: [
    { title: "1. Fixez vous des objectifs" },
    {
      paragraph: `Sélectionnez vos objectifs dans le menu ⚙️ ou créez les vôtres.

Choisissez les jours de la semaine et un rappel pour chacun de vos objectifs à réaliser !`,
    },
    { title: "2. Réorganisez l’ordre de vos indicateurs dans votre questionnaire" },
    { paragraph: `En allant dans le menu ⚙️ puis “personnaliser mes indicateurs”` },
  ],
  button: {
    title: "Super !",
  },
};

const STORAGE_LATEST_CHANGES_DISPLAYED = "LATEST_CHANGES_DISPLAYED";

const LatestChangesModalContext = createContext();

export const useLatestChangesModal = () => useContext(LatestChangesModalContext);

export const LatestChangesModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const { onLayout: onAreaLayout, ...areaLayout } = useLayout();
  const { onLayout: onContentLayout, ...contentLayout } = useLayout();

  const visibleAnim = useSharedValue(0);
  const opacityAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: visibleAnim.value,
    };
  });
  const translateAnimStyle = useAnimatedStyle(() => {
    const translateY = interpolate(visibleAnim.value, [0, 1], [-1000, 0]);
    return {
      transform: [{ translateY }],
    };
  });

  const showLatestChangesModal = useCallback(async () => {
    const lastDisplayed = await AsyncStorage.getItem(STORAGE_LATEST_CHANGES_DISPLAYED);
    let shouldDisplay = false;
    if (!lastDisplayed) {
      const lastNotesVersion = await localStorage.getNotesVersion();
      if (lastNotesVersion) shouldDisplay = true;
    } else if (lastDisplayed && parseInt(lastDisplayed) < latestChanges.appversion) {
      shouldDisplay = true;
    }

    if (shouldDisplay) {
      setVisible(true);
      visibleAnim.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
    }
    await AsyncStorage.setItem(STORAGE_LATEST_CHANGES_DISPLAYED, latestChanges.appversion.toString());
  }, []);

  const hide = useCallback(() => {
    visibleAnim.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }, () => {
      runOnJS(setVisible)(false);
    });
  }, []);

  const value = {
    showLatestChangesModal,
    hide,
  };

  return (
    <LatestChangesModalContext.Provider value={value}>
      {children}

      {visible && (
        <Animated.View style={[styles.container, opacityAnimStyle]}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={6}
            reducedTransparencyFallbackColor="black"
          />
          <Pressable onPress={hide} style={{ flex: 1 }} />
          <Animated.View
            style={[styles.frameArea, translateAnimStyle]}
            pointerEvents="box-none"
            onLayout={onAreaLayout}
          >
            <View style={[styles.frameContainer, { height: contentLayout?.height + 110 + 80 }]}>
              <View style={[styles.headerContainer]}>
                <Svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  viewBox={`0 0 ${areaLayout?.width || 320} 110`}
                >
                  <Path
                    style="stroke-linecap:round;stroke-linejoin:round"
                    fill="#5D71BD"
                    d={`M -1,-1 ${(areaLayout?.width || 320) + 1},-1 ${
                      (areaLayout?.width || 320) + 1
                    },110 -1,50`}
                  />
                </Svg>
                <Text style={[styles.headerTitle]}>Nouveautés !</Text>
                <Lottie
                  source={require("../../../assets/lottiefiles/54953-confetti.json")}
                  style={styles.lottieAnim}
                  autoPlay
                  loop
                />
              </View>
              <ScrollView bounces={contentLayout.height > areaLayout.height}>
                <View style={[styles.contentContainer]} onLayout={onContentLayout}>
                  {latestChanges?.content?.map((item) => (
                    <>
                      {item?.title && <Text style={[styles.title]}>{item?.title}</Text>}
                      {item?.paragraph && <Text style={[styles.paragraph]}>{item?.paragraph}</Text>}
                    </>
                  ))}
                </View>
              </ScrollView>
              <Button2
                onPress={hide}
                size="no-size"
                {...latestChanges?.button}
                containerStyle={styles.buttonContainer}
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </LatestChangesModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  blur: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  frameArea: {
    position: "absolute",
    top: 35,
    bottom: 35,
    left: 35,
    right: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  frameContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: "100%",
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    height: 110,
  },
  headerTitle: {
    fontFamily: "Karla",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
  },
  lottieAnim: {
    position: "absolute",
    width: 124,
    height: 150,
    bottom: -10,
    alignSelf: "center",
  },
  contentContainer: {
    paddingHorizontal: 19,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 19,
    height: 80,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Karla",
    color: "black",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 19,
    paddingLeft: 16,
    textAlign: "left",
  },
  paragraph: {
    fontFamily: "Karla",
    color: "black",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 17,
  },
});
