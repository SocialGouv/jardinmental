import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import localStorage from '@/utils/localStorage';
import { Indicator } from '@/entities/Indicator';
import { DiaryDataNewEntryInput } from '@/entities/DiaryData';
import SurveyScreenWrapper from './SurveyScreenWrapper';
import SurveyContext, { SurveyContextType } from './SurveyContext';
import { getScoreWithState } from '@/utils';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { SurveyStackParamList, SurveyNavigatorRouteParams } from '../../entities/SurveyScreen';
import { DiaryDataContext } from '@/context/diaryData';
import { INDICATEURS_HUMEUR, INDICATEURS_SOMMEIL } from '@/utils/liste_indicateurs.1';
import { useSurveyScreens } from './hooks/useSurveyScreens';

const Stack = createStackNavigator<SurveyStackParamList>();

interface SurveyNavigatorProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any> & {
    params?: SurveyNavigatorRouteParams;
  };
}

// Constants moved outside the component to avoid re-creation
const QUESTION_TOXIC = {
  id: 'TOXIC',
  label: "Avez-vous consommé des substances aujourd'hui ?",
};
const QUESTION_CONTEXT = {
  id: 'CONTEXT',
  label: 'Ajoutez une note générale sur votre journée',
};

// Main navigator component
const SurveyStackNavigator: React.FC<{ context: SurveyContextType; isLoading: boolean, isOnboarding: boolean }> = ({ context, isLoading, isOnboarding }) => {
  const { screens } = context;

  if (isLoading || screens.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={`screen-survey-${screens[0].id}`}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        }
      }}
    >
      {screens.map((screen, index) => (
        <Stack.Screen
          key={screen.id}
          name={`screen-survey-${screen.id}`}
          component={SurveyScreenWrapper}
          initialParams={{
            screenData: screen,
            screenIndex: index,
            isOnboarding
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export const SurveyNavigator: React.FC<SurveyNavigatorProps> = ({ navigation, route }) => {
  const initEditingSurvey = route?.params?.editingSurvey ?? false;
  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext)
  const initSurvey: DiaryDataNewEntryInput = useMemo(() => {
    return route?.params?.currentSurvey ?? {
      date: formatDay(beforeToday(0)),
      answers: {},
    };
  }, [route?.params?.currentSurvey]);
  const screens = useSurveyScreens(userIndicateurs, {
    isOnboarding: route?.params?.isOnboarding
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setIsLoading(true);
          const user_indicateurs = await localStorage.getIndicateurs();
          if (user_indicateurs) {
            setUserIndicateurs(user_indicateurs);
          }
        } catch (error) {
          console.error('Error loading user indicators:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    }, [])
  );

  const [answers, setAnswers] = useState<DiaryDataNewEntryInput['answers']>(initSurvey.answers || {});

  useEffect(() => {
    const initialAnswers = {};
    const surveyAnswers = initSurvey.answers || {};
    if (!surveyAnswers || userIndicateurs.length === 0) return;

    Object.keys(surveyAnswers).forEach((key) => {
      const answer = surveyAnswers[key];
      if (!answer) return;

      if (key === QUESTION_TOXIC.id || key === QUESTION_CONTEXT.id || key === INDICATEURS_HUMEUR.name || key === INDICATEURS_SOMMEIL.name) {
        initialAnswers[key] = {
          ...answer,
          value: answer.value,
          userComment: answer.userComment,
        };
        return;
      }

      const cleanedQuestionId = key.split('_')[0];
      const _indicateur = userIndicateurs.find((i) => i.name === cleanedQuestionId);
      if (_indicateur) {
        let value = answer.value;
        if (!['gauge', 'boolean'].includes(_indicateur.type)) {
          value = getScoreWithState({
            patientState: initSurvey.answers,
            category: key,
          });
        }
        initialAnswers[cleanedQuestionId] = {
          value,
          userComment: answer.userComment,
          _indicateur,
        };
      }
    });
    setAnswers(initialAnswers);
  }, [initSurvey.answers, userIndicateurs]);

  const saveAnswerForIndicator = ({ key, value }: { key: string; value: boolean | number }): void => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [key]: { ...prev[key], value, _indicateur: userIndicateurs.find((i) => i.name === key) },
      };
      setTimeout(() => {
        // add timeout to fix warning : 
        // Cannot update a component(`DiaryDataProvider`) while rendering a different component(`SurveyNavigator`).
        // setAnswer trigger a rendering, addNewEntryToDiaryData as well, we differe it to the next frame with
        // set timeout
        addNewEntryToDiaryData({
          date: initSurvey.date,
          answers: updatedAnswers
        });
      })
      return updatedAnswers;
    });
  };

  const saveCommentForIndicator = ({ key, userComment }: { key: string; userComment: string }): void => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [key]: { ...prev[key], userComment },
      };
      setTimeout(() => {
        // use timeout see saveAnswerForIndicator for explanation
        addNewEntryToDiaryData({
          date: initSurvey.date,
          answers: updatedAnswers
        });
      })
      return updatedAnswers;
    });
  };

  const contextValue: SurveyContextType = {
    userIndicateurs,
    initEditingSurvey,
    answers,
    saveAnswerForIndicator,
    saveCommentForIndicator,
    screens,
    parentNavigation: navigation,
    parentRoute: route,
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      <SurveyStackNavigator

        isOnboarding={route?.params?.isOnboarding}
        context={contextValue}
        isLoading={isLoading} />
    </SurveyContext.Provider>
  );
};

export default SurveyNavigator;
