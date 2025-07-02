import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Indicator, INDICATORS_CATEGORIES } from '@/entities/Indicator';
import { DiaryDataNewEntryInput } from '@/entities/DiaryData';
import { IndicatorSurveyItem } from '@/components/survey/IndicatorSurveyItem';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BannerHeader from '../onboarding-v2/BannerHeader';
import MoonIcon from '@assets/svg/icon/moon';
import ThoughtIcon from '@assets/svg/icon/thought';
import BehaviourIcon from '@assets/svg/icon/behaviour';
import InstructionText from '../onboarding-v2/InstructionText';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';

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
  category?: INDICATORS_CATEGORIES;
}

const ICON_FOR_CATEGORY: Record<INDICATORS_CATEGORIES, React.ReactNode> = {
  [INDICATORS_CATEGORIES["Emotions/sentiments"]]: <MoonIcon />,
  [INDICATORS_CATEGORIES["Manifestations physiques"]]: <MoonIcon />,
  [INDICATORS_CATEGORIES["Pensées"]]: <ThoughtIcon />,
  [INDICATORS_CATEGORIES["Comportements"]]: <BehaviourIcon />,
}

export const IndicatorScreen: React.FC<IndicatorScreenProps> = ({
  navigation,
  title,
  indicators,
  answers,
  onValueChanged,
  onCommentChanged,
  onNext,
  category
}) => {
  console.log('IndicatorScreen', category, title);
  return <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
    {/* <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
      /> */}
    <BannerHeader
      headerTitle='Observation du jour'
      header={category ? <View className='rounded-full bg-white/30 p-2 self-start w-auto'>
        {ICON_FOR_CATEGORY?.[category]}
      </View> : null}
      title={title}
      handlePrevious={() => navigation.goBack()}
      handleSkip={onNext}
    ></BannerHeader>
    <ScrollView>
      <View className="flex-1 justify-center items-center px-6 py-6">
        <InstructionText>Prenons un instant pour faire le point sur {title}</InstructionText>
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
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
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
  </SafeAreaViewWithOptionalHeader>
};
