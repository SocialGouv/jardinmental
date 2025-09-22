import { useStatusBarInternal } from "@/context/StatusBarContext";
import { mergeClassNames } from "@/utils/className";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { CarouselSlide as CarouselSlideComponent } from "../../components/onboarding/CarouselSlide";
import NavigationButtons from "../../components/onboarding/NavigationButtons";
import { useUserProfile } from "../../context/userProfile";
import { useOnboardingProgressHeader } from "../onboarding/ProgressHeader";
import logEvents from "../../services/logEvents";
import BeigeWrapperScreen from "./BeigeWrapperScreen";
import carouselSlides from "./data/carouselData";
import { CarouselSlide, OnboardingV2ScreenProps } from "./types";

type Props = OnboardingV2ScreenProps<"Carousel">;

const { width: screenWidth } = Dimensions.get("window");

const NextRoute = "OnboardingCheckInStart";

const CarouselScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, isLoading } = useUserProfile();
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const previousIndexRef = useRef<number | null>(null);
  const { setSlideIndex } = useOnboardingProgressHeader();
  const [variant, setVariant] = useState<"beige" | "white" | "green" | "blue">("beige");
  const { setCustomColor } = useStatusBarInternal();

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
    navigation.navigate(NextRoute);
  };

  const handleSkip = () => {
    logEvents.logCarrouselObdPass(currentIndex + 1);
    navigation.navigate(NextRoute);
  };

  const onViewableItemsChanged = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;

      // Log event when sliding to a new slide (but not on initial load)
      if (newIndex !== previousIndexRef.current && previousIndexRef.current !== null) {
        logEvents.logCarrouselObdNext(newIndex + 1);
      }

      previousIndexRef.current = newIndex;
      const itemVariant = viewableItems[0].item?.variant;
      setVariant(itemVariant && ["beige", "white", "green", "blue"].includes(itemVariant) ? itemVariant : "beige");
      setCustomColor("");
      setCurrentIndex(newIndex);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      const slideIndex = currentIndex + 1;
      goToSlide(slideIndex);
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
