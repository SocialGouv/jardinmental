import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputQuestion from '../survey/InputQuestion';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import CheckInHeader from '../../components/onboarding/CheckInHeader';

interface ContextScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  answers: any;
  onValueChanged: ({ key, value }: { key: string; value: any }) => void;
  onCommentChanged: ({ key, userComment }: { key: string; userComment: string }) => void;
  onNext: () => void;
}

export const ContextScreen: React.FC<ContextScreenProps> = ({
  navigation,
  answers,
  onCommentChanged,
  onNext,
}) => {
  const questionContext = {
    id: 'CONTEXT',
    label: 'Ajoutez une note générale sur votre journée',
    explanation: undefined,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
          <CheckInHeader
            title="Observation du jour"
            onPrevious={() => navigation.goBack()}
            onSkip={onNext}
            showPrevious={true}
            showSkip={true}
          /> 
          <View className="flex-1 justify-center items-center">
          <InputQuestion
            question={questionContext}
            explanation={questionContext.explanation}
            isLast={false}
            onChangeUserComment={onCommentChanged}
            userComment={answers[questionContext.id]?.userComment}
            placeholder="Contexte, évènements, comportement de l'entourage..."
          />
          </View>
        <NavigationButtons
          onNext={onNext}
          showPrevious={false}
          nextText="Suivant"
        />
    </SafeAreaView>
  );
};
