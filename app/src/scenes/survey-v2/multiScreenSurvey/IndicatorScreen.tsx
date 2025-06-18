import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../../components/Card';
import { SurveyProgressBar } from './components/SurveyProgressBar';
import { Indicator } from '../../../entities/Indicator';
import { DiaryDataNewEntryInput } from '../../../entities/DiaryData';
import { IndicatorSurveyItem } from '../components/IndicatorSurveyItem';
import CheckInHeader from '../../onboarding-v2/components/CheckInHeader';
import NavigationButtons from '../../onboarding-v2/components/NavigationButtons';
import { COLORS } from '../../onboarding-v2/constants';

interface IndicatorScreenProps {
  navigation: any;
  title: string;
  indicators: Indicator[];
  currentStep: number;
  totalSteps: number;
  answers: DiaryDataNewEntryInput['answers'];
  onValueChanged: ({ key, value }: { key: string; value: any }) => void;
  onCommentChanged: ({ key, userComment }: { key: string; userComment: string }) => void;
  onNext: () => void;
}

export const IndicatorScreen: React.FC<IndicatorScreenProps> = ({
  navigation,
  title,
  indicators,
  currentStep,
  totalSteps,
  answers,
  onValueChanged,
  onCommentChanged,
  onNext,
}) => {
    return <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
      />
      
      <View className="flex-1 justify-center items-center px-8">
        {/* <Text 
          className="text-lg font-bold text-center mb-8"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Y-a-t-il une émotion, un état ou un comportement qui a pris un peu de place aujourd'hui ?
        </Text> */}
        {indicators.map((indicator, index) => (
                <IndicatorSurveyItem
                  key={indicator.uuid}
                  indicator={indicator}
                  index={index}
                  value={answers?.[indicator.name]?.value}
                  onValueChanged={({ indicator, value }) => 
                    true//onValueChanged({ key: indicator.name, value })
                  }
                  onCommentChanged={({ indicator, comment }) => 
                    true // onCommentChanged({ key: indicator.name, userComment: comment })
                  }
                  comment={answers?.[indicator.name]?.userComment}
                />
              ))}
        <Text 
          className="text-sm text-center mt-4 px-4"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Vous pouvez sélectionner plusieurs options
        </Text>
      </View>

      <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        // loading={loading}
        nextText="Suivant"
      />
    </SafeAreaView>
};
