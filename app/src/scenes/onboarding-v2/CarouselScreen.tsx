import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { OnboardingV2ScreenProps, CarouselSlide } from './types';
import { CarouselSlide as CarouselSlideComponent } from '../../components/onboarding/CarouselSlide';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { useUserProfile } from '../../context/userProfile';
import { TW_COLORS } from '@/utils/constants';
import { useFocusEffect } from '@react-navigation/native';
import carouselSlides, { carouselSlidesSuivi } from './data/carouselData';
import BeigeWrapperScreen from './BeigeWrapperScreen';
import Leaf from '@assets/svg/illustrations/Leaf';
import TwoLeaf from '@assets/svg/illustrations/TwoLeaf';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';

type Props = OnboardingV2ScreenProps<'Carousel'>;

const { width: screenWidth } = Dimensions.get('window');

export const CarouselScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, isLoading } = useUserProfile()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (profile) {
      setSlides(profile.id === 'suivi' ? carouselSlidesSuivi : carouselSlides)
    }
  }, [profile])

  const handleNext = () => {
    navigation.navigate('PersonalizationStart');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.navigate('PersonalizationStart');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleNext();
    }
  };

  const goToPrevSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const renderSlide = ({ item, index }: { item: CarouselSlide; index: number }) => (
    <CarouselSlideComponent
      slide={item}
      isActive={index === currentIndex}
    />
  );

  const renderPaginationDot = (index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => goToSlide(index)}
      className="w-3 h-3 rounded-full mx-1"
      style={{
        backgroundColor: index === currentIndex ? TW_COLORS.PRIMARY : TW_COLORS.GRAY_LIGHT,
      }}
    />
  );

  return <SafeAreaViewWithOptionalHeader className="flex-1 bg-[#FDF2E7]">
    <CheckInHeader
      title=""
      onPrevious={handlePrevious}
      onSkip={handleSkip}
      showPrevious={true}
      skipText='Passer'
      showSkip={true}
    />

    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderSlide}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      getItemLayout={(data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
    />

    {/* Indicateurs de pagination et navigation */}
    <View className="left-0 right-0">
      <View className="flex-row justify-center mb-6">
        {slides.map((_, index) => renderPaginationDot(index))}
      </View>
      <NavigationButtons nextText={
        currentIndex === slides.length - 1 ? 'Démarrer sur jardin' : 'Suivant'
      }
        onNext={goToNextSlide} />
    </View>
    <Leaf
      style={{
        position: 'absolute',
        top: -60,
        right: -60,
        zIndex: 2
      }}
      width={234}
      height={240}
    />
    <Leaf
      width={140}
      height={125}
      style={{
        position: 'absolute',
        top: '60%',
        right: -40,
        zIndex: 2
      }} />
    <TwoLeaf
      width={262}
      height={197}
      style={{
        position: 'absolute',
        bottom: '15%',
        left: -60,
        zIndex: 2
      }} />
    {/* <NavigationButtons
      onNext={handleNext}
      showPrevious={false}
      nextText="Continuer vers ma première"
    /> */}
  </SafeAreaViewWithOptionalHeader>

  // return (
  //   <SafeAreaView className="flex-1 bg-white">
  //     {/* Bouton Passer en haut à droite */}
  //     <View className="absolute top-12 right-4 z-10">
  //       <TouchableOpacity
  //         onPress={handleSkip}
  //         className="px-4 py-2 rounded-full"
  //         style={{ backgroundColor: TW_COLORS.WHITE + 'CC' }}
  //       >
  //         <Text 
  //           className="text-base font-medium"
  //           style={{ color: TW_COLORS.PRIMARY }}
  //         >
  //           Passer
  //         </Text>
  //       </TouchableOpacity>
  //     </View>

  //     {/* Bouton Précédent en haut à gauche */}
  //     <View className="absolute top-12 left-4 z-10">
  //       <TouchableOpacity
  //         onPress={handlePrevious}
  //         className="px-4 py-2 rounded-full"
  //         style={{ backgroundColor: TW_COLORS.WHITE + 'CC' }}
  //       >
  //         <Text 
  //           className="text-base font-medium"
  //           style={{ color: TW_COLORS.GRAY_DARK }}
  //         >
  //           ← Retour
  //         </Text>
  //       </TouchableOpacity>
  //     </View>

  //     {/* Carrousel */}
  //     <FlatList
  //       ref={flatListRef}
  //       data={slides}
  //       renderItem={renderSlide}
  //       keyExtractor={(item) => item.id.toString()}
  //       horizontal
  //       pagingEnabled
  //       showsHorizontalScrollIndicator={false}
  //       onViewableItemsChanged={onViewableItemsChanged}
  //       viewabilityConfig={viewabilityConfig}
  //       getItemLayout={(data, index) => ({
  //         length: screenWidth,
  //         offset: screenWidth * index,
  //         index,
  //       })}
  //     />

  //     {/* Indicateurs de pagination et navigation */}
  //     <View className="absolute bottom-8 left-0 right-0">
  //       <View className="flex-row justify-center mb-6">
  //         {slides.map((_, index) => renderPaginationDot(index))}
  //       </View>
  //       <NavigationButtons nextText={
  //         currentIndex === slides.length - 1 ? 'Continuer' : 'Suivant'
  //         }
  //       onNext={goToNextSlide} />
  //     </View>
  //   </SafeAreaView>
  // );
};

export default CarouselScreen;
