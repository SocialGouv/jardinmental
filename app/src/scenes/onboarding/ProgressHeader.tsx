import React, { useRef, useEffect, useState, useContext, createContext, useCallback } from "react";
import { View, StyleSheet, Animated, Easing, Text, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import BackButton from "../../components/BackButton";
import { TransitionPresets } from "@react-navigation/stack";
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

const ProgressHeaderContext = createContext();

export const useOnboardingProgressHeader = () => useContext(ProgressHeaderContext);

export const OnboardingProgressHeaderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(-1);
  const [title, setTitle] = useState<string>('')
  const [showProgressbar, setShowProgressbar] = useState<boolean>(false);
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


  const value = {
    slideIndex,
    setSlideIndex,
    isVisible,
    setIsVisible,
    setTitle,
    title,
    showProgressbar,
    setShowProgressbar,
    // animatedStatusBarColor,
    // animatedTextColor
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

export const SafeAreaViewWithOptionalHeader = ({ children, style, ...props }) => {
  const insets = useSafeAreaInsets();
  const { isVisible } = useOnboardingProgressHeader();

  return (
    <GestureHandlerRootView className='flex-1'>
      <BottomSheetModalProvider>
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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const ProgressHeader = ({ insets, slidesCount }) => {
  const { slideIndex, title, showProgressbar, setSlideIndex } = useOnboardingProgressHeader();
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
        toValue: Math.max(0, Math.min(1, (slideIndex + 1) / (slidesCount))),
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
    console.log('PROGRESS HEADER VISIBLE EFFECT', slideIndex, visible)
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
    // return <nnerHeader
    //   animatedStatusBarColor={animatedStatusBarColor}
    //   animatedTextColor={animatedTextColor}
    //   title={title || 'un super titre'}
    //   handlePrevious={() => {
    //     navigation.goBack()
    //   }}
    //   handleSkip={() => { }}
    // >
    {/* {route.params?.mood !== null && <View className='justify-center items-center mt-4'>
        {moodEmojis[route.params?.mood]?.icon}
      </View>} */}
    // </BannerHeader>
    const content = (<View style={styles.container}>
      <View style={{ opacity: 0 }}>
        <BackButton onPress={navigation.goBack} />
      </View>
      {/* <View style={styles.progressBarContainer}>
      <Animated.View
        style={[styles.progressBar, { width: animatedProgressWidth }]}
        collapsable={false}
      />


    </View> */}
      {showProgressbar &&
        <View className="flex-row items-center px-6" >
          <View
            className="h-2 rounded-full overflow-hidden flex-1"
            style={{ backgroundColor: TW_COLORS.GRAY_LIGHT }}
          >
            <Animated.View
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: TW_COLORS.LIGHT_COLORS,
                width: animatedProgressWidth
              }}
            />
          </View>
          <Text
            className="text-sm font-medium ml-2"
            style={{ color: TW_COLORS.WHITE }}
          >
            {slideIndex + 1}/{slidesCount}
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
            // { transform: [{ translateY: animatedVisibleY }]}
          ]}
        >
          {HEADER_WITH_BANNER && !hideHeader && <BannerAnimatedHeader
            animatedStatusBarColor={animatedStatusBarColor}
            animatedTextColor={animatedTextColor}
            header={content}
            title={title || ''}
            handlePrevious={() => {
              console.log('lcs slide index', slideIndex)
              if (slideIndex === 0) {
                setHideHeader(true)
              }
              // timeout needed to make the hide header done before the go back
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
            onPrevious={() => {
              console.log('lcs slide index', slideIndex)
              if (slideIndex === 0) {
                setHideHeader(true)
                setSlideIndex(-1);
              }
              // timeout needed to make the hide header done before the go back
              setTimeout(() => {
                navigation.goBack()
                setHideHeader(false)
              }, 0)
            }}
            onSkip={() => navigation.goNext()}
            showPrevious={true}
            animatedTextColor={animatedTextColor}
            showSkip={true}
          />}

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
