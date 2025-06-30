import React, { useRef, useEffect, useState, useContext, createContext, useCallback } from "react";
import { View, StyleSheet, Animated, Easing, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import BackButton from "../../components/BackButton";
import { TransitionPresets } from "@react-navigation/stack";
import { colors } from "../../utils/colors";

export const PROGRESS_HEADER_HEIGHT = 60;
export const PROGRESS_HEADER_PADDING_HORIZONTAL = 0;

const ProgressHeaderContext = createContext();

export const useOnboardingProgressHeader = () => useContext(ProgressHeaderContext);

export const OnboardingProgressHeaderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(-1);

  const value = {
    slideIndex,
    setSlideIndex,
    isVisible,
    setIsVisible,
  };

  return <ProgressHeaderContext.Provider value={value}>{children}</ProgressHeaderContext.Provider>;
};

export const progressHeaderOptions = ({ insets, slidesCount }) => {
  return {
    headerShown: true,
    headerStyle: {
      height: insets.top + PROGRESS_HEADER_HEIGHT,
    },
    headerMode: "float",
    headerTransparent: true,
    header: ProgressHeader({ insets, slidesCount }),
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export const ProgressScreen =
  ({ slideIndex: _slideIndex, Component }) =>
    ({ ...props }) => {
      const { setSlideIndex } = useOnboardingProgressHeader();

      useFocusEffect(
        useCallback(() => {
          setSlideIndex(_slideIndex);

          return () => { };
        }, [])
      );

      return <Component {...props} />;
    };

export const SafeAreaViewWithOptionalHeader = ({ children, style, ...props }) => {
  const insets = useSafeAreaInsets();
  const { isVisible } = useOnboardingProgressHeader();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top + (isVisible ? PROGRESS_HEADER_HEIGHT : 0),
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const ProgressHeader = ({ insets, slidesCount }) => {
  const { slideIndex } = useOnboardingProgressHeader();

  const animatedProgressValue = useRef(new Animated.Value(0)).current;
  const animatedProgressWidth = animatedProgressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  useEffect(() => {
    if (slideIndex >= 0) {
      Animated.timing(animatedProgressValue, {
        toValue: Math.max(0, Math.min(1, slideIndex / slidesCount)),
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [slideIndex]);

  const animatedVisibleValue = useRef(new Animated.Value(0)).current;
  const animatedVisibleY = animatedVisibleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-(insets.top + PROGRESS_HEADER_HEIGHT), 0],
  });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (slideIndex >= 0 && !visible) {
      setVisible(true);
      Animated.timing(animatedVisibleValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if ((slideIndex === slidesCount || slideIndex === -1) && visible) {
      Animated.timing(animatedVisibleValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [slideIndex]);

  const Ghost = () => (
    <View
      style={{
        height: insets.top + PROGRESS_HEADER_HEIGHT,
        width: "100%",
      }}
      collapsable={false}
    />
  );

  return ({ navigation }) => {
    // if (!visible) return null;

    return (
      <View
        style={[
          styles.frame,
          {
            height: insets.top + PROGRESS_HEADER_HEIGHT,
            width: "100%",
            backgroundColor: 'transparent',
          },
        ]}
        collapsable={false}
      >
        <Animated.View
          style={[{ paddingTop: insets.top }, { transform: [{ translateY: animatedVisibleY }] }]}
        >
          <View style={styles.container}>
            <View style={{ opacity: navigation.canGoBack() ? 1 : 0 }}>
              <BackButton onPress={navigation.goBack} />
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[styles.progressBar, { width: animatedProgressWidth }]}
                collapsable={false}
              />
            </View>
            <View style={{ opacity: 0 }} pointerEvents="none">
              <BackButton onPress={() => { }} />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  frame: {
    //backgroundColor: "white",
    width: "100%",
  },
  container: {
    height: PROGRESS_HEADER_HEIGHT,
    marginHorizontal: PROGRESS_HEADER_PADDING_HORIZONTAL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    top: 50,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
  },
  progressBar: {
    height: "100%",
    minWidth: 16,
    borderRadius: 8,
    backgroundColor: colors.LIGHT_BLUE_TRANS,
  },
});
