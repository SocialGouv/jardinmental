import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '../../components/onboarding/CheckInHeader';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { COLORS } from '@/utils/constants';

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
    <SafeAreaView className="flex-1 bg-white">
        <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
        />
        
        <View className="flex-1 justify-center items-center px-8">
            <Text 
                className="text-xl font-bold text-center mb-8"
                style={{ color: COLORS.TEXT_PRIMARY }}
            >
                C'est noté !
            </Text>
            <Text 
                className="text-lg font-bold text-center mb-8"
                style={{ color: COLORS.TEXT_PRIMARY }}
            >
                {title}
            </Text>
            <Text 
                className="text-sm text-center mt-4 px-4"
                style={{ color: COLORS.TEXT_SECONDARY }}
            >
              Ce que vous avez observé aujourd’hui contribue à mieux vous comprendre, un jour après l’autre.
            </Text>
        </View>
        <View className="px-8 pb-4">
          <Text className="text-sm text-left" style={{ color: COLORS.TEXT_SECONDARY }}>
            {extraInfo}
          </Text>
        </View>
        <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        nextText="Suivant"
        />
    </SafeAreaView>
  );
};

