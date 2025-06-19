import { useContext, useState } from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ContextScreen } from "./ContextScreen";
import { GoalsScreen } from "./GoalsScreen";
import { IndicatorScreen } from "./IndicatorScreen";
import { ToxicScreen } from "./ToxicScreen";
import { EncouragementScreen } from "./EncouragementScreen";
import SurveyContext from "./SurveyContext";
import { DiaryDataNewEntryInput } from "@/entities/DiaryData";
import { SurveyStackParamList, SurveyScreenInterface } from "@/entities/SurveyScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from '@/services/notifications';

interface SurveyScreenWrapperProps {
  navigation: StackNavigationProp<SurveyStackParamList>;
  route: RouteProp<SurveyStackParamList, keyof SurveyStackParamList>;
}

// Screen wrapper component that renders the appropriate screen based on type
const SurveyScreenWrapper: React.FC<SurveyScreenWrapperProps> = ({ navigation, route }) => {
  const context = useContext(SurveyContext);
   
  if (!context) return null;

  const {
    screens,
    parentRoute,
    answers
  } = context;

  const { screenData, screenIndex } = route.params;
  const currentStep = screenIndex + 1;
  const totalSteps = screens.length;

  const handleNext = async () => {
    if (screenIndex < screens.length - 1) {
      const nextScreen = screens[screenIndex + 1];
      navigation.navigate(`screen-${nextScreen.id}`, {
        screenData: nextScreen,
        screenIndex: screenIndex + 1,
      });
    } else {
      // Final submission
      const isRegistered = await NotificationService.checkPermission();
      let storedReminder = await AsyncStorage.getItem('@Reminder');
      if (!storedReminder || !isRegistered) {
        navigation.navigate('reminder', { onboarding: true })
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'tabs' }],
        });
      }
    }
  };


  const onCommentChanged = () => {

  }

  const screenProps = {
    navigation,
    currentStep,
    totalSteps,
    onNext: handleNext,
  };


  switch (screenData.type) {
    case 'category':
    case 'individual':
      return (
        <IndicatorScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
          title={screenData.title}
          indicators={screenData.indicators || []}
        />
      );
    case 'goals':
      return (
        <GoalsScreen
          date={""}
          {...screenProps}
          route={parentRoute}
        />
      );
    case 'context':
      return (
        <ContextScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
        />
      );
    case 'toxic':
      return (
        <ToxicScreen
          answers={answers}
          onValueChanged={context.saveAnswerForIndicator}
          onCommentChanged={context.saveCommentForIndicator}
          {...screenProps}
        />
      );
    case 'encouragement':
      return (
        <EncouragementScreen
          title={screenData.title}
          description={screenData.description || ""}
          extraInfo={screenData.extraInfo || ""}
          {...screenProps}
        />
      );
    default:
      return null;
  }
};

export default SurveyScreenWrapper
