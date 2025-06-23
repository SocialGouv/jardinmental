import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';

import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { OnboardingV2ScreenProps, CheckInData } from '../../types';
import { DiaryDataContext } from '@/context/diaryData';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { INDICATEURS_SOMMEIL } from '@/utils/liste_indicateurs.1';
import { generateIndicatorFromPredefinedIndicator } from '@/entities/Indicator';
import { COLORS } from '@/utils/constants';

type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeel'>;

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Très mal dormi', 'Mal dormi', 'Ok', 'Bien dormi', 'Très bien dormi'];

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const [checkInData, setCheckInData] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    if (checkInData !== null) {  // or another condition
      handleComplete();
    }
  }, [checkInData])

  const handleComplete = async () => {
      setLoading(true);
      // Sauvegarder les données du check-in
      const date = formatDay(beforeToday(0))
      const prev = diaryData[date] || {}

      const key = INDICATEURS_SOMMEIL.name
      const updatedAnswers = {
          ...prev,
          [key]: { ...prev[key], value: checkInData, _indicateur: generateIndicatorFromPredefinedIndicator(INDICATEURS_SOMMEIL)
          }
      }
      addNewEntryToDiaryData({
          date,
          answers: updatedAnswers
      });
      // Marquer l'onboarding comme terminé
      navigation.navigate('OnboardingCheckInIntroductionCompleted')
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    // Logique pour passer cette étape si nécessaire
    handleComplete();
  };

  const onSelectValue = (value) => {
    setCheckInData(value)
  }

  const renderSleepSelector = () => (
    <View className="mb-6">
      <View className="flex-row justify-between">
        {moodEmojis.map((emoji, index) => {
          const value = index + 1;
          const isSelected = checkInData === value
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectValue(value)}
              className="items-center p-2 rounded-lg"
              style={{
                backgroundColor: isSelected ? COLORS.PRIMARY + '20' : 'transparent',
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
              }}
            >
              <Text className="text-2xl mb-1">{emoji}</Text>
              <Text 
                className="text-xs text-center"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                {moodLabels[index]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader
        title="Qualité du sommeil"
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        showPrevious={true}
        showSkip={true}
      />
      
      <View className="flex-1 justify-center items-center px-8">
        <Text 
          className="text-2xl font-bold text-center mb-8"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Comment avez-vous dormi ?
        </Text>
        
        {renderSleepSelector()}
      </View>
    </SafeAreaView>
  );
};

export default CheckInScreen;
