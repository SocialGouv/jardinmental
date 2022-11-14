import React, { createContext, useCallback, useContext } from "react";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useLayout } from "@react-native-community/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const latestChanges = {
  appversion: 155,
  title: "Fixez vous des objectifs",
  description:
    "Sélectionnez vos objectifs dans le menu ⚙️ ou créez les vôtres. Choisissez les jours de la semaine et un rappel pour chacun de vos objectifs à réaliser !",
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

  const showLatestChangesModal = useCallback(async () => {
    const lastDisplayed = await AsyncStorage.getItem(STORAGE_LATEST_CHANGES_DISPLAYED);
    if (!lastDisplayed || parseInt(lastDisplayed) < latestChanges.appversion) {
      //await AsyncStorage.setItem(STORAGE_LATEST_CHANGES_DISPLAYED, latestChanges.appversion.toString());
      setVisible(true);
      visibleAnim.value = withTiming(1);
    }
  }, []);

  const hide = useCallback(() => {
    visibleAnim.value = withTiming(0, undefined, () => {
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
            blurType="light"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <Pressable onPress={hide} style={{ flex: 1 }} />
          <View style={[styles.frameArea]} pointerEvents="box-none" onLayout={onAreaLayout}>
            <View style={[styles.frameContainer]}>
              <ScrollView bounces={contentLayout.height > areaLayout.height}>
                <View style={[styles.contentContainer]} onLayout={onContentLayout}>
                  <Text>{latestChanges?.title}</Text>
                  <Text>{latestChanges?.description}</Text>
                </View>
              </ScrollView>

              <TouchableOpacity onPress={hide} style={[styles.closeButton]}>
                <Icon icon="CrossSvg" width={15} height={15} color="#bec1c8" />
              </TouchableOpacity>
            </View>
          </View>
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
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  frameContainer: {
    backgroundColor: "#FFF",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: "100%",
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 15,
  },
  text: {
    color: "#222",
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 5,
  },
});
