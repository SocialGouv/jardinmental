import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import CircleCheckMark from "@assets/svg/icon/CircleCheckMark";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from "react-native-reanimated";
import JMButton from "@/components/JMButton";

interface SurveySuccessScreenProps {
  navigation: any;
  route?: {
    params?: {
      onComplete?: () => void;
    };
  };
}

const SurveySuccessScreen: React.FC<SurveySuccessScreenProps> = ({ navigation, route }) => {
  const { setCustomColor } = useStatusBar();
  const [showPanel, setShowPanel] = useState(false);

  // Animation values
  const panelTranslateY = useSharedValue(300); // Start below screen
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Show panel after 1.5 seconds
    const timer = setTimeout(() => {
      setShowPanel(true);
      // Animate panel sliding up
      panelTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      // Show button with delay and opacity animation
      buttonOpacity.value = withDelay(
        200,
        withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        })
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    // Call the callback if provided
    if (route?.params?.onComplete) {
      route.params.onComplete();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );
  // Animated styles
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: panelTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* White Background First Screen */}
      <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ marginBottom: 32 }}>
            <CircleCheckMark color={"#0084B2"} width={40} height={41} />
          </View>
          <Text className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 text-center")}>
            L'observation du jour est terminée
          </Text>
        </View>
      </View>

      {/* Animated Bottom Panel */}
      {showPanel && (
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%", // Take 60% of screen height
              backgroundColor: TW_COLORS.CNAM_CYAN_50_LIGHTEN_90,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 40,
              justifyContent: "space-between",
            },
            panelAnimatedStyle,
          ]}
        >
          <View className="absolute top-[-38px] flex items-center justify-center w-full">
            <View className="ml-14 rounded-full w-16 h-16 bg-cnam-cyan-500-0 p-2"></View>
          </View>
          <View className="absolute top-[-30px] self-center rounded-full w-16 h-16 border border-white bg-cnam-cyan-lighten-80 p-2 flex items-center justify-center">
            <Text className="text-3xl">👏</Text>
          </View>
          {/* Top Content Area */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* Applause Hands Icon positioned at the top like in mockup */}

            {/* Content centered in the panel */}
            <View style={{ alignItems: "center" }}>
              {/* Bravo Title */}
              <Text className={mergeClassNames("text-lg font-bold text-cnam-primary-900 text-center mb-6")}>Bravo !</Text>

              {/* Congratulations Text */}
              <Text className={mergeClassNames("text-lg font-normal text-cnam-primary-900 text-center leading-6")}>
                Prendre le temps de remplir votre suivi, c'est déjà prendre soin de vous.
              </Text>
            </View>
          </View>

          {/* Animated Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <JMButton onPress={handleFinish} title="Retour à l'accueil" variant="primary" width="full" />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

export default SurveySuccessScreen;
