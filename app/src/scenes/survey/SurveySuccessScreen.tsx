import React, { useCallback, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import Done from "@assets/svg/Done";
import { EncouragementScreen } from "../survey-v2/EncouragementScreen";
import BeigeCard from "../onboarding-v2/BeigeCard";
import BeigeWrapperScreen from "../onboarding-v2/BeigeWrapperScreen";
import CircleCheckMark from "@assets/svg/icon/CircleCheckMark";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      // Call the callback if provided
      if (route?.params?.onComplete) {
        route.params.onComplete();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation, route?.params?.onComplete]);

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );
  return (
    <BeigeWrapperScreen>
      <BeigeCard color={TW_COLORS.CNAM_CYAN_LIGHTEN_80}>
        <View className="flex-row justify-center items-center my-8">
          <CircleCheckMark color={"#0084B2"} width={30} height={31} />
        </View>
        <View className="justify-center items-center w-full">
          <Text className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 mb-8 text-left w-full")}>
            Votre observation est enregistrée
          </Text>
        </View>
        <View className="pb-4 w-full">
          <Text className={mergeClassNames(typography.textMdRegular, "text-center text-cnam-primary-900 text-left")}>
            Revenez chaque jour pour observer votre état et suivre ces éléments.
          </Text>
        </View>
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};

export default SurveySuccessScreen;
