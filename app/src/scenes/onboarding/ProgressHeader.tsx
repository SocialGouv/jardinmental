import React, { useRef, useEffect, useState, useContext, createContext, useCallback, ReactNode } from "react";
import { View, StyleSheet, Animated, Easing, Text, Platform, ViewStyle } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import BackButton from "../../components/BackButton";
import { StackNavigationOptions, TransitionPresets } from "@react-navigation/stack";
import { colors } from "../../utils/colors";
import BannerHeader from "../onboarding-v2/BannerHeader";
import { useAnimatedStyle } from "react-native-reanimated";
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from "@/utils/constants";
import CheckInHeader from "@/components/onboarding/CheckInHeader";
import BannerAnimatedHeader from "../onboarding-v2/BannerAnimatedHeader";
import { set } from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export const PROGRESS_HEADER_HEIGHT = 60;
export const PROGRESS_HEADER_PADDING_HORIZONTAL = 0;

interface ProgressHeaderContextType {
  slideIndex: number;
  setSlideIndex: (index: number) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setTitle: (title: string) => void;
  title: string;
  showProgressbar: boolean;
  setShowProgressbar: (show: boolean) => void;
  setNextPath: (func: () => void) => void;
  nextPath: React.MutableRefObject<(() => void) | null>;
}

const ProgressHeaderContext = createContext<ProgressHeaderContextType | undefined>(undefined);

export const useOnboardingProgressHeader = () => {
  const context = useContext(ProgressHeaderContext);
  if (!context) {
    throw new Error('useOnboardingProgressHeader must be used within OnboardingProgressHeaderProvider');
  }
  return context;
};

export const OnboardingProgressHeaderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(-1);
  const [title, setTitle] = useState<string>('')
  const [showProgressbar, setShowProgressbar] = useState<boolean>(false);
  const nextPathRef = useRef<(() => void) | null>(null);
  // const animatedStatusBarColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: route.params?.mood !== null ? moodBackgroundColors[route.params?.mood] : TW_COLORS.WHITE,
  //   };
  // })

  // const animatedTextColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: 'transparent',
  //     color: TW_COLORS.PRIMARY
  //   };
  // })
  const setNextCallback = useCallback((func: () => void) => {
    nextPathRef.current = func;
  }, [])

  const value = {
    slideIndex,
    setSlideIndex,
    isVisible,
    setIsVisible,
    setTitle,
    title,
    showProgressbar,
    setShowProgressbar,
    setNextPath: setNextCallback,
    nextPath: nextPathRef
    // animatedStatusBarColor,
    // animatedTextColor
  };

  return <ProgressHeaderContext.Provider value={value}>{children}</ProgressHeaderContext.Provider>;
};

export const progressHeaderOptions = ({ insets, slidesCount, navigation }): StackNavigationOptions => {
  return {
    headerShown: true,
    headerStyle: {
      height: insets.top + PROGRESS_HEADER_HEIGHT,
    },
    headerMode: "float",
    headerTransparent: true,
    header: ProgressHeader({ insets, slidesCount, navigation }),
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export const ProgressScreen =
  ({ slideIndex: _slideIndex, Component, title, showProgressbar }) =>
    ({ ...props }) => {
      const { setSlideIndex, setTitle, setShowProgressbar } = useOnboardingProgressHeader();

      useFocusEffect(
        useCallback(() => {
          // console.log('FOCUS')
          setSlideIndex(_slideIndex);
          setTimeout(() => {
            setTitle(title)
            setShowProgressbar(showProgressbar)
          })
        }, [])
      );

      return <Component {...props} />;
    };

export const SafeAreaViewWithOptionalHeader = ({ children, style, ...props }: {
  style?: ViewStyle,
  children: ReactNode,
  className?: string,
}) => {
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

const ProgressHeader = ({ insets, slidesCount, navigation }) => {
  const { slideIndex, showProgressbar, nextPath } = useOnboardingProgressHeader();
  const [hideHeader, setHideHeader] = useState(false)
  const animatedProgressValue = useRef(new Animated.Value(0)).current;
  const animatedProgressWidth = animatedProgressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  })

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      color: TW_COLORS.WHITE
    };
  })

  useEffect(() => {
    if (slideIndex >= 0) {
      Animated.timing(animatedProgressValue, {
        toValue: Math.max(0, Math.min(1, (slideIndex) / (slidesCount))),
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
        delay: 200,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if ((slideIndex === slidesCount || slideIndex === -1) && visible) {
      setVisible(false)
      Animated.timing(animatedVisibleValue, {
        toValue: 0,
        delay: 0,
        duration: 0,
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
    if (!visible) return null;
    const content = (<View style={styles.container}>
      <View style={{ opacity: 0 }}>
        <BackButton onPress={navigation.goBack} />
      </View>
      {showProgressbar &&
        <View className="flex-row items-center px-6" >
          <View
            className="h-2 rounded-full overflow-hidden flex-1"
            style={{ backgroundColor: TW_COLORS.GRAY_LIGHT }}
          >
            <Animated.View
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: TW_COLORS.BRAND_500,
                width: animatedProgressWidth
              }}
            />
          </View>
          <Text
            className="text-sm font-medium ml-2"
            style={{ color: TW_COLORS.WHITE }}
          >
            {slideIndex}/{slidesCount}
          </Text>
        </View>}

      <View style={{ opacity: 0 }} pointerEvents="none">
        <BackButton onPress={() => { }} />
      </View>
    </View>)

    return (
      <View
        style={[
          styles.frame,
          {
            height: PROGRESS_BAR ? 0 : insets.top + PROGRESS_HEADER_HEIGHT,
            width: "100%",
          },
        ]}
        collapsable={false}
      >
        <Animated.View
          style={[
            (PROGRESS_BAR && !PROGRESS_BAR_AND_HEADER) ? { top: insets.top + PROGRESS_HEADER_HEIGHT - 20 } : { paddingTop: insets.top },
            { opacity: animatedVisibleValue },
          ]}
        >
          {HEADER_WITH_BANNER && !hideHeader && <BannerAnimatedHeader
            animatedStatusBarColor={animatedStatusBarColor}
            animatedTextColor={animatedTextColor}
            header={content}
            title={title || ''}
            handlePrevious={() => {
              if (slideIndex === 0) {
                setHideHeader(true)
              }
              setTimeout(() => {
                navigation.goBack()
                setHideHeader(false)
              }, 0)
            }}
            handleSkip={() => { }}
          >
          </BannerAnimatedHeader>}
          {!HEADER_WITH_BANNER && !hideHeader && (SHARED_HEADER || PROGRESS_BAR_AND_HEADER) && <CheckInHeader
            withMargin={false}
            onSkip={() => {
              if (nextPath && nextPath.current) {
                nextPath.current();
              }
            }}
            onPrevious={() => {
              navigation.goBack();
            }}
            showPrevious={true}
            animatedTextColor={animatedTextColor}
            showSkip={true}
            title={""} />}

          {!HEADER_WITH_BANNER && !hideHeader && content}
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
    padding: 0,
    display: "flex",
    height: 40,
    // height: PROGRESS_HEADER_HEIGHT,
    // marginHorizontal: PROGRESS_HEADER_PADDING_HORIZONTAL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    top: -25,
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
