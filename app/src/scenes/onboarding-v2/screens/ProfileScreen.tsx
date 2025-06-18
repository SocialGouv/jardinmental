import React, { useCallback, useRef, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, UserProfile } from '../types';
import { NavigationButtons } from '../components/NavigationButtons';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOnboarding } from '../context/OnboardingContext';
import { COLORS } from '../constants';
import carouselSlides from '../data/carouselData';
import CheckInHeader from '../components/CheckInHeader';
import DraggableHelpPopup from '../../../components/DraggableHelpPopup';
import QuestionMark from '../../../../assets/svg/QuestionMark';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { styles } from '../../suivi';
import { render } from '@testing-library/react-native';

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
  const [showHelpPopup, setShowHelpPopup] = useState(false);

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

    // ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

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
        <View className="flex-1">
          <Text 
            className="text-lg font-semibold mb-1"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {item.name}
          </Text>
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

  const renderBackdrop = useCallback(
		props => (<BottomSheetBackdrop {...props}
      opacity={0.5}
      enableTouchThrough={false}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }]} />),
		[]
	);

  return (
    <GestureHandlerRootView className='flex-1'>
       <BottomSheetModalProvider>

    <SafeAreaView className="flex-1 bg-white">

      <CheckInHeader
        title=""
        onPrevious={handlePrevious}
        onSkip={nextStep}
        showPrevious={true}
        showSkip={true}
      />
      
      <View className="flex-1 justify-center px-6">
        {/* En-tête */}
        <Text 
          className="text-2xl font-bold text-center mb-4"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Êtes-vous actuellement suivi(e) par un professionnel de la santé mentale ?
        </Text>

        {/* Liste des profils */}
        {profiles.map((item) => renderProfileItem({ item }))}


        <Text 
          className="text-base text-center mt-4"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Cela nous aide à personnaliser votre expérience
        </Text>
        <View className='items-center mt-2'>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.present() }
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY + '20' }}
          >
            <QuestionMark width={20} height={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Boutons de navigation */}
      <NavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextDisabled={!selectedProfile}
        nextText="Continuer"
      />


      {/* Help Popup */}
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
          >
            <BottomSheetView>
    
            <View className="flex-1 bg-white p-4">
          <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Qu’est-ce qu’un professionnel de la santé mentale
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
          Pas toujours facile de s’y retrouver...
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
            Un professionnel de la santé mentale peut être un médecin généraliste, psychiatre, un psychologue, un psychothérapeute…
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
            Si vous hésitez, choisissez ce qui vous semble le plus proche de votre situation.
          </Text>
        </View>
        </BottomSheetView>
        </BottomSheetModal>
      {/* <DraggableHelpPopup
        visible={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        title="Aide - Suivi professionnel"
      >
        <View className="flex-1 bg-white">
          <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Qu’est-ce qu’un professionnel de la santé mentale
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
          Pas toujours facile de s’y retrouver...
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
            Un professionnel de la santé mentale peut être un médecin généraliste, psychiatre, un psychologue, un psychothérapeute…
          </Text>
          <Text className="text-base mb-4 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
            Si vous hésitez, choisissez ce qui vous semble le plus proche de votre situation.
          </Text>
        </View>
      </DraggableHelpPopup> */}

        </SafeAreaView>

        </BottomSheetModalProvider>
    </GestureHandlerRootView>

  );
};

export default ProfileScreen;
