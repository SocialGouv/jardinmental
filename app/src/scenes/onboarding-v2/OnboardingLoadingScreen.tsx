import React, { useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { OnboardingV2ScreenProps } from "./types";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import { Typography } from "@/components/Typography";

type Props = OnboardingV2ScreenProps<"OnboardingLoadingScreen">;

const OnboardingLoadingScreen: React.FC<Props> = ({ navigation }) => {
  const { setCustomColor } = useStatusBar();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("OnboardingChooseIndicator");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-cnam-primary-800">
      <View className="flex-1 justify-center items-center px-6">
        <ActivityIndicator size="large" color="white" />
        <Typography className={mergeClassNames(typography.textLgMedium, "text-white text-center mt-6")}>
          Création de votre suivi personnalisé...
        </Typography>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingLoadingScreen;
