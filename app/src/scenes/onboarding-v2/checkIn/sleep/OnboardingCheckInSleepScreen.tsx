import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';

import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { OnboardingV2ScreenProps, CheckInData } from '../../types';
import { DiaryDataContext } from '@/context/diaryData';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { INDICATEURS_SOMMEIL } from '@/utils/liste_indicateurs.1';
import { generateIndicatorFromPredefinedIndicator } from '@/entities/Indicator';
import { TW_COLORS } from '@/utils/constants';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import BannerHeader from '../../BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import InstructionText from '../../InstructionText';
import Gauge from '@/components/gauge';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import MoonIcon from '@assets/svg/icon/moon';

type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeel'>;

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Très mal dormi', 'Mal dormi', 'Ok', 'Bien dormi', 'Très bien dormi'];


export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const [checkInData, setCheckInData] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  // useEffect(() => {
  //   if (checkInData !== null) {  // or another condition
  //     handleComplete();
  //   }
  // }, [checkInData])

  const handleComplete = async () => {
    setLoading(true);
    // Sauvegarder les données du check-in
    const date = formatDay(beforeToday(0))
    const prev = diaryData[date] || {}

    const key = INDICATEURS_SOMMEIL.name
    const updatedAnswers = {
      ...prev,
      [key]: {
        ...prev[key], value: checkInData, _indicateur: generateIndicatorFromPredefinedIndicator(INDICATEURS_SOMMEIL)
      }
    }
    addNewEntryToDiaryData({
      date,
      answers: updatedAnswers
    });
    navigation.navigate('OnboardingCheckInIntroductionCompleted')
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const onSelectValue = (value) => {
    setCheckInData(value)

  }

  const computeMoodLabel = (): string => {
    if (checkInData === null) return '';

    const index = Math.min(Math.floor(checkInData * 5), 4);
    return moodLabels[index] ?? '';
  };

  const renderSleepSelector = () => {
    return <View className='p-4 py-8 rounded-xl bg-blue'>
      <Gauge onChange={onSelectValue} reverse={undefined} />
      <Text>{computeMoodLabel()}</Text>
    </View>
  };

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  })

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      color: TW_COLORS.WHITE,
      textAlign: 'left'
    };
  })

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        header={<View className='rounded-full bg-white/30 p-2 self-start w-auto'>
          <MoonIcon />
        </View>}
        headerTitle='Observation du jour'
        title={`Cette nuit, avez-vous bien dormi ?`}
      // handlePrevious={handlePrevious}
      // handleSkip={handleSkip}
      >
      </BannerHeader>


      <View className="flex-1 p-6">
        <InstructionText>
          Évaluez la qualité de votre sommeil
        </InstructionText>
        {renderSleepSelector()}
      </View>
      <NavigationButtons
        onNext={handleComplete}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default CheckInScreen;
