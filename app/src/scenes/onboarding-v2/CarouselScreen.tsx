import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { OnboardingV2ScreenProps, CarouselSlide } from "./types";
import { CarouselSlide as CarouselSlideComponent } from "../../components/onboarding/CarouselSlide";
import NavigationButtons from "../../components/onboarding/NavigationButtons";
import { useUserProfile } from "../../context/userProfile";
import { useFocusEffect } from "@react-navigation/native";
import carouselSlides from "./data/carouselData";
import BeigeWrapperScreen from "./BeigeWrapperScreen";
import { useOnboardingProgressHeader } from "../onboarding/ProgressHeader";
import { mergeClassNames } from "@/utils/className";
import logEvents from "../../services/logEvents";

type Props = OnboardingV2ScreenProps<"Carousel">;

const { width: screenWidth } = Dimensions.get("window");

const NextRoute = "OnboardingCheckInStart";

export const CarouselScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, isLoading } = useUserProfile();
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { setSlideIndex } = useOnboardingProgressHeader();
  const [variant, setVariant] = useState<"beige" | "white" | "green" | "blue">("beige");

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setSlideIndex(-1);
    }, [])
  );

  useEffect(() => {
    setSlides(carouselSlides);
  }, [profile]);

  const handleNext = () => {
    logEvents.logCarrouselObdNext(slides.length);
    navigation.navigate(NextRoute);
  };

  const handleSkip = () => {
    logEvents.logCarrouselObdPass(currentIndex + 1);
    navigation.navigate(NextRoute);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    console.log(viewableItems);
    if (viewableItems.length > 0) {
      setVariant(viewableItems[0].item.variant || "beige");
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const goToSlide = (index: number) => {
    // Track slide change when manually navigating (1-based index)
    if (index !== currentIndex) {
      logEvents.logCarrouselObdNext(index + 1);
    }
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
    <CarouselSlideComponent slide={item} isActive={index === currentIndex} />
  );

  const renderPaginationDot = (index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => goToSlide(index)}
      className={mergeClassNames("rounded-full mx-1", index === currentIndex ? "w-6 h-6 bg-gray-950" : "w-4 h-4 bg-[#65AEC1] border border-gray-600")}
    />
  );

  return (
    <BeigeWrapperScreen variant={variant} handleSkip={handleSkip}>
      <>
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
        <View className="left-0 right-0">
          <View className="flex-row justify-center items-center mb-6">{slides.map((_, index) => renderPaginationDot(index))}</View>
          <NavigationButtons
            withArrow={true}
            nextText={currentIndex === slides.length - 1 ? "Démarrer sur Jardin Mental" : "Suivant"}
            onNext={goToNextSlide}
          />
        </View>
      </>
    </BeigeWrapperScreen>
  );
};

export default CarouselScreen;
