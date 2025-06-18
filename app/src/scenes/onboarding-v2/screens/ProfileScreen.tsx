import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, UserProfile } from '../types';
import { NavigationButtons } from '../components/NavigationButtons';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOnboarding } from '../context/OnboardingContext';
import { COLORS } from '../constants';
import carouselSlides from '../data/carouselData';

type Props = OnboardingV2ScreenProps<'Profile'>;

const profiles: UserProfile[] = [
  {
    id: 'suivi',
    name: 'Oui, je suis suivi(e)',
  },
  {
    id: 'non-suivi',
    name: 'Non, je ne suis pas suivi(e)'
  },
];

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { updateProfile, nextStep, previousStep } = useOnboarding();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleNext = () => {
    if (selectedProfile) {
      updateProfile(selectedProfile);
      nextStep();
      navigation.navigate('Carousel', { slides: carouselSlides });
    }
  };

  const handlePrevious = () => {
    previousStep();
    navigation.goBack();
  };

  const renderProfileItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      onPress={() => setSelectedProfile(item)}
      className="mx-4 mb-4 p-4 rounded-xl border-2"
      style={{
        borderColor: selectedProfile?.id === item.id ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
        backgroundColor: selectedProfile?.id === item.id ? COLORS.PRIMARY + '10' : COLORS.WHITE,
      }}
    >
      <View className="flex-row items-center">
        {/* <Text className="text-3xl mr-4">{item.icon}</Text> */}
        <View className="flex-1">
          <Text 
            className="text-lg font-semibold mb-1"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {item.name}
          </Text>
          {/* <Text 
            className="text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            {item.description}
          </Text> */}
        </View>
        {selectedProfile?.id === item.id && (
          <View 
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">      
      <View className="flex-1">
        {/* En-tête */}
        <View className="px-6 py-4">
          <Text 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Êtes-vous actuellement suivi(e) par un professionnel de la santé mentale ?
          </Text>
        </View>

        {/* Liste des profils */}
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={renderProfileItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />

        <View className="px-6 py-4">
          <Text 
            className="text-base text-center"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            Cela nous aide à personnaliser votre expérience
          </Text>
        </View>
      </View>

      <NavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextDisabled={!selectedProfile}
        nextText="Continuer"
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
