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
import { SafeAreaViewWithOptionalHeader, useOnboardingProgressHeader } from '../onboarding/ProgressHeader';

type Props = OnboardingV2ScreenProps<'Carousel'>;

const { width: screenWidth } = Dimensions.get('window');

export const CarouselScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, isLoading } = useUserProfile()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { setSlideIndex } = useOnboardingProgressHeader();
  const [variant, setVariant] = useState<'beige' | 'white' | 'green' | 'blue'>('beige');

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setSlideIndex(-1)
    }, [])
  );

  useEffect(() => {
    // if (profile) {
    setSlides(carouselSlides)
    // }
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
    console.log(viewableItems)
    if (viewableItems.length > 0) {
      setVariant(viewableItems[0].item.variant || 'beige');
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
      // setVariant(slides[currentIndex + 1].variant || 'beige');
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

  return <BeigeWrapperScreen
    variant={variant}
    handleSkip={handleSkip}>
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
  </BeigeWrapperScreen>
};

export default CarouselScreen;
