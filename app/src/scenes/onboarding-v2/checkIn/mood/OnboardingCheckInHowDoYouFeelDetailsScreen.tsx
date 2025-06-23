import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { OnboardingV2ScreenProps } from '../../types';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { DiaryDataContext } from '@/context/diaryData';
import { INDICATEURS_HUMEUR } from '@/utils/liste_indicateurs.1';
import { COLORS, STORAGE_KEYS } from '@/utils/constants';

type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeelDetails'>;

const SadMoodOptions = [
  'colère', 'anxiété', 'peur', 'accablement', 'honte', 
  'dégoût', 'embarras', 'frustration', 'contrariété', 
  'jalousie', 'angoisse', 'comportement'
];

const HappyMoodOptions = [
  'enthousiasme',
  'fierté',
  'amour',
  'espoir',
  'sérénité',
  'soulagement',
  'amusement',
  'fascination',
  'gratitude',
  'admiration',
  'exaltation',
  'euphorie',
  'plaisir',
  'contentement',
  'satisfaction',
  'optimisme',
  'tendresse'
]

const NeutralMoodOptions = [
    'curiosité',
    'surprise',
    'intérêt',
    'attente',
    'indifférence',
    'calme',
    'neutralité',
    'acceptation',
    'concentration',
    'réflexion',
    'méditation',
    'observateur',
    'prudence',
    'détachement',
    'tolérance',
    'équanimité'
]

const getMoodOptions = (mood: number): string[] => {
  if (mood < 2) {
    return SadMoodOptions
  } else if (mood > 2) {
    return HappyMoodOptions
  } else {
    return NeutralMoodOptions
  }
}

export const OnboardingCheckInLastMoods: React.FC<Props> = ({ navigation, route }) => {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const moodOptions = React.useMemo(() => getMoodOptions(route.params.mood), [route.params.mood])
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => {
      if (prev.includes(mood)) {
        return prev.filter(m => m !== mood);
      } else {
        return [...prev, mood];
      }
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Mettre à jour les données du check-in avec les humeurs sélectionnées
        const date = formatDay(beforeToday(0))
        const prev = diaryData[date] || {}
        const key = INDICATEURS_HUMEUR.name
        const updatedAnswers = {
            ...prev,
            [key]: { ...prev[key], userComment: selectedMoods.join(', ') },

        }
        console.log({
          date,
          answers: updatedAnswers
      })
        addNewEntryToDiaryData({
            date,
            answers: updatedAnswers
        });
      
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_COMPLETED, 'true');
      navigation.navigate('OnboardingCheckInMoodSummary')

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
      <View className="flex-row flex-wrap justify-center">
        {moodOptions.map((mood, index) => {
          const isSelected = selectedMoods.includes(mood);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleMood(mood)}
              className="m-1 px-4 py-2 rounded-full"
              style={{
                backgroundColor: isSelected ? COLORS.PRIMARY : COLORS.WHITE,
                borderWidth: 2,
                borderColor: isSelected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
                minWidth: 80,
              }}
            >
              <Text 
                className="text-center font-medium"
                style={{ 
                  color: isSelected ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
                  fontSize: 14
                }}
              >
                {mood}
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
          className="text-lg font-bold text-center mb-8"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Y-a-t-il une émotion, un état ou un comportement qui a pris un peu de place aujourd'hui ?
        </Text>
        
        {renderMoodSelector()}
        
        <Text 
          className="text-sm text-center mt-4 px-4"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Vous pouvez sélectionner plusieurs options
        </Text>
      </View>

      <NavigationButtons
        onNext={handleComplete}
        showPrevious={false}
        loading={loading}
        nextText="Renseigner mes émotions"
      />
    </SafeAreaView>
  );
};

export default OnboardingCheckInLastMoods;
