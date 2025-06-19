import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { OnboardingV2ScreenProps, CarouselSlide } from '../../types';
import { CarouselSlide as CarouselSlideComponent } from '../../components/CarouselSlide';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS } from '../../constants';
import ProgressIndicator from '../../components/ProgressIndicator';

type Props = OnboardingV2ScreenProps<'Carousel'>;

const { width: screenWidth } = Dimensions.get('window');

export const CarouselScreen: React.FC<Props> = ({ navigation, route }) => {
  const { slides } = route.params;
  const { nextStep, previousStep } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    nextStep();
    navigation.navigate('Difficulties');
  };

  const handlePrevious = () => {
    previousStep();
    navigation.goBack();
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
        backgroundColor: index === currentIndex ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1">
      {/* Bouton Passer en haut à droite */}
      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity
          onPress={handleNext}
          className="px-4 py-2 rounded-full"
          style={{ backgroundColor: COLORS.WHITE + 'CC' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.PRIMARY }}
          >
            Passer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Précédent en haut à gauche */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={handlePrevious}
          className="px-4 py-2 rounded-full"
          style={{ backgroundColor: COLORS.WHITE + 'CC' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.GRAY_DARK }}
          >
            ← Retour
          </Text>
        </TouchableOpacity>
      </View>
      <ProgressIndicator currentStep={0}
        totalSteps={4}/>
      {/* Carrousel */}
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

    </SafeAreaView>
  );
};

export default CarouselScreen;
