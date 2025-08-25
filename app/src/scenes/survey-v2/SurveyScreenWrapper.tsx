import { useContext, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ContextScreen } from "./ContextScreen";
import { GoalsScreen } from "./GoalsScreen";
import { IndicatorScreen } from "./IndicatorScreen";
import { ToxicScreen } from "./ToxicScreen";
import { EncouragementScreen } from "./EncouragementScreen";
import SurveyContext from "./SurveyContext";
import { SurveyStackParamList, SurveyScreenInterface } from "@/entities/SurveyScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from "@/services/notifications";

interface SurveyScreenWrapperProps {
  navigation: StackNavigationProp<SurveyStackParamList>;
  route: RouteProp<SurveyStackParamList, keyof SurveyStackParamList>;
}

// Screen wrapper component that renders the appropriate screen based on type
const SurveyScreenWrapper: React.FC<SurveyScreenWrapperProps> = ({ navigation, route }) => {
  const context = useContext(SurveyContext);

  if (!context) return null;

  const { screens, parentRoute, answers } = context;

  const { screenData, screenIndex, isOnboarding } = route.params;
  const currentStep = screenIndex + 1;
  const totalSteps = screens.length;

  const handleNext = async () => {
    if (screenIndex < screens.length - 1) {
      const nextScreen = screens[screenIndex + 1];
      navigation.navigate(`screen-survey-${nextScreen.id}`, {
        screenData: nextScreen,
        screenIndex: screenIndex + 1,
        isOnboarding,
      });
    } else {
      // Final submission
      const isRegistered = await NotificationService.checkPermission();
      let storedReminder = await AsyncStorage.getItem("@Reminder");
      if (!storedReminder || !isRegistered) {
        navigation.navigate("reminder", { onboarding: true });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "tabs" }],
        });
      }
    }
  };

  const screenProps = {
    navigation,
    currentStep,
    totalSteps,
    onNext: handleNext,
  };

  switch (screenData.type) {
    case "category":
      return (
        <IndicatorScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
          category={screenData.category}
          title={screenData.title}
          indicators={screenData.indicators || []}
          showComment={!isOnboarding}
        />
      );
    case "individual":
      return (
        <IndicatorScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
          title={screenData.title}
          indicators={screenData.indicators || []}
          showComment={!isOnboarding}
        />
      );
    case "goals":
      return <GoalsScreen date={""} {...screenProps} route={parentRoute} />;
    case "context":
      return (
        <ContextScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
        />
      );
    case "toxic":
      return (
        <ToxicScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
        />
      );
    case "encouragement":
      return (
        <EncouragementScreen
          headingTitle={"👏 Un pas de plus vers une meilleure connaissance de vous."}
          title={screenData.title}
          description={"Vous pourrez revenir chaque jour pour observer votre état et suivre ces éléments."}
          extraInfo={screenData.extraInfo || ""}
          {...screenProps}
        />
      );
    default:
      return null;
  }
};

export default SurveyScreenWrapper;
