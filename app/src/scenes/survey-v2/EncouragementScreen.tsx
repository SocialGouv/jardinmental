import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '../../components/onboarding/CheckInHeader';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BeigeWrapperScreen from '../onboarding-v2/BeigeWrapperScreen';
import BeigeCard from '../onboarding-v2/BeigeCard';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';

interface EncouragementScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  headingTitle: string;
  extraInfo: string;
  onNext: () => void;
}

export const EncouragementScreen: React.FC<EncouragementScreenProps> = ({
  navigation,
  headingTitle,
  title,
  description,
  extraInfo,
  onNext,
}) => {
  return (
    <BeigeWrapperScreen
      handlePrevious={() => navigation.goBack()}
      handleSkip={onNext}
      handleNext={onNext}>
      <BeigeCard>
        <View className="justify-center items-center px-8">
          <Text
            className={mergeClassNames(typography.displayXsRegular, 'text-brand-950 mb-8')}
          >
            {headingTitle || `C'est noté ! 🌱`}
          </Text>
          <Text
            className={mergeClassNames(typography.textMdSemibold, 'text-brand-900 mb-8')}
          >
            {title}
          </Text>
        </View>
        {description && <View className="px-10 pb-4">
          <Text className={mergeClassNames(typography.textMdRegular, 'text-center text-brand-900')}>
            {description}
          </Text>
        </View>}
        {extraInfo && <View className="px-0 pb-4">
          <Text className={mergeClassNames(typography.textMdRegular, 'text-left text-gray-800')}>
            {extraInfo}
          </Text>
        </View>}
      </BeigeCard>
      {/* <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        nextText="Suivant"
        /> */}
    </BeigeWrapperScreen>
  );
};

