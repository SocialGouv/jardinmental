import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '../../components/onboarding/CheckInHeader';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BeigeWrapperScreen from '../onboarding-v2/BeigeWrapperScreen';
import BeigeCard from '../onboarding-v2/BeigeCard';

interface EncouragementScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  extraInfo: string;
  onNext: () => void;
}

export const EncouragementScreen: React.FC<EncouragementScreenProps> = ({
  navigation,
  title,
  extraInfo,
  onNext,
}) => {
  return (
    <BeigeWrapperScreen
    handlePrevious={() => navigation.goBack()}
    handleSkip={onNext}
    handleNext={onNext}>
        {/* <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
        /> */}
        <BeigeCard>
          <View className="justify-center items-center px-8">
              <Text 
                  className="text-xl font-bold text-center mb-8"
                  style={{ color: TW_COLORS.TEXT_PRIMARY }}
              >
                  C'est noté !
              </Text>
              <Text 
                  className="text-lg font-bold text-center mb-8"
                  style={{ color: TW_COLORS.TEXT_PRIMARY }}
              >
                  {title}
              </Text>
              {/* <Text 
                  className="text-sm text-center mt-4 px-4"
                  style={{ color: TW_COLORS.TEXT_SECONDARY }}
              >
                Ce que vous avez observé aujourd’hui contribue à mieux vous comprendre, un jour après l’autre.
              </Text> */}
          </View>
          <View className="px-2 pb-4">
            <Text className="text-sm text-left" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
              {extraInfo}
            </Text>
          </View>
        </BeigeCard>
        {/* <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        nextText="Suivant"
        /> */}
    </BeigeWrapperScreen>
  );
};

