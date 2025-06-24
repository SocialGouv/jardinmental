import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationButtons from '../../../components/NavigationButtons';
import CheckInHeader from '../../../components/CheckInHeader';
import { STORAGE_KEYS, COLORS } from '../../../constants';
import { useOnboarding } from '../../../context/OnboardingContext';
import { OnboardingV2ScreenProps, CheckInData } from '../../../types';

type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeel'>;

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Très bon'];

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateCheckIn, state } = useOnboarding();
  const [checkInData, setCheckInData] = useState<CheckInData>({
    mood: 3,
    energy: 3,
    stress: 3,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const updateValue = (key: keyof CheckInData, value: number | string) => {
    setCheckInData(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Sauvegarder les données du check-in
      updateCheckIn(checkInData);
      
      // Marquer l'onboarding comme terminé
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_COMPLETED, 'true');
      
      // Afficher un message de félicitations
      navigation.navigate('OnboardingCheckInHowDoYouFeelDetails', { mood: checkInData.mood })
    //   Alert.alert(
    //     'Félicitations ! 🎉',
    //     'Votre profil est maintenant configuré. Bienvenue dans Jardin Mental !',
    //     [
    //       {
    //         text: 'Commencer',
    //         onPress: () => {
    //           // Naviguer vers l'application principale
    //           // @ts-ignore - Navigation vers l'app principale
    //           navigation.getParent()?.reset({
    //             index: 0,
    //             routes: [{ name: 'tabs' }],
    //           });
    //         }
    //       }
    //     ]
    //   );
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    // Logique pour passer cette étape si nécessaire
    handleComplete();
  };

  const renderMoodSelector = () => (
    <View className="mb-6">
      <View className="flex-row justify-between">
        {moodEmojis.map((emoji, index) => {
          const value = index + 1;
          const isSelected = checkInData.mood === value;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => updateValue('mood', value)}
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

  const renderSlider = (
    title: string,
    key: keyof CheckInData,
    lowLabel: string,
    highLabel: string
  ) => (
    <View className="mb-6">
      <Text 
        className="text-lg font-semibold mb-3"
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        {title}
      </Text>
      <View className="flex-row justify-between items-center mb-2">
        <Text 
          className="text-sm"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          {lowLabel}
        </Text>
        <Text 
          className="text-sm"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          {highLabel}
        </Text>
      </View>
      <View className="flex-row justify-between">
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = checkInData[key] === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => updateValue(key, value)}
              className="w-12 h-12 rounded-full items-center justify-center border-2"
              style={{
                backgroundColor: isSelected ? COLORS.PRIMARY : COLORS.WHITE,
                borderColor: isSelected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
              }}
            >
              <Text 
                className="text-lg font-semibold"
                style={{ color: isSelected ? COLORS.WHITE : COLORS.TEXT_PRIMARY }}
              >
                {value}
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
        title="Observation du jour"
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
          Comment vous sentez-vous actuellement ?
        </Text>
        
        {renderMoodSelector()}
      </View>

      <NavigationButtons
        onNext={handleComplete}
        showPrevious={false}
        loading={loading}
        nextText="Suivant"
      />
    </SafeAreaView>
  );
};

export default CheckInScreen;
