import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Indicator } from '@/entities/Indicator';
import { DiaryDataNewEntryInput } from '@/entities/DiaryData';
import { IndicatorSurveyItem } from '@/components/survey/IndicatorSurveyItem';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { COLORS } from '@/utils/constants';

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
      <ScrollView>
        <View className="flex-1 justify-center items-center px-8">
          <Text 
            className="text-lg font-bold text-center mb-8"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {title}
          </Text>
          {indicators.map((indicator, index) => (
              <IndicatorSurveyItem
                key={indicator.uuid}
                indicator={indicator}
                index={index}
                value={answers?.[indicator.name]?.value}
                onValueChanged={({ indicator, value }) => 
                  onValueChanged({ key: indicator.name, value })
                }
                onCommentChanged={({ indicator, comment }) => 
                  onCommentChanged({ key: indicator.name, userComment: comment })
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
      </ScrollView>
      <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        // loading={loading}
        nextText="Suivant"
      />
    </SafeAreaView>
};
