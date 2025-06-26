import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Platform, Dimensions, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { OnboardingV2ScreenProps } from '../../types';
import { EMOTION_COLORS, iconColors, TW_COLORS } from '@/utils/constants';
import JMButton from '@/components/JMButton';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { INDICATEURS_HUMEUR } from '@/utils/liste_indicateurs.1';
import { DiaryDataContext } from '@/context/diaryData';
import { generateIndicatorFromPredefinedIndicator } from '@/entities/Indicator';
import BannerHeader from '../../BannerHeader';
import { moodBackgroundColors, MoodEmoji, moodEmojis } from '@/utils/mood'
import InstructionText from '../../InstructionText';

const { width: screenWidth } = Dimensions.get('window');


type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeel'>;


const springConfig = { damping: 20, stiffness: 80 };

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);
  const [hasSelectedOnce, setHasSelectedOnce] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [checkInData, setCheckInData] = useState<number | null>(null);
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  // Animated values
  const scrollViewScale = useSharedValue(1);
  const statusBarColorProgress = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const rotateSelectorProgress = useSharedValue(0);

  // FlatList configuration
  const itemWidth = screenWidth / 5; // Show all 5 items at once
  const getItemLayout = (data: any, index: number) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  });


  useEffect(() => {
    // Give it a small delay to ensure FlatList has finished initial rendering
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 2, animated: false });
    }, 0); // you can also try 50ms if it's flaky

    return () => clearTimeout(timeout);
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    // Sauvegarder les données du check-in
    const date = formatDay(beforeToday(0))
    const prev = diaryData[date] || {}

    const key = INDICATEURS_HUMEUR.name
    const updatedAnswers = {
      ...prev,
      [key]: {
        ...prev[key], value: checkInData, _indicateur: generateIndicatorFromPredefinedIndicator(INDICATEURS_HUMEUR)
      }
    }
    addNewEntryToDiaryData({
      date,
      answers: updatedAnswers
    });
    navigation.navigate('OnboardingCheckInHowDoYouFeelDetails', {
      mood: selectedMoodIndex !== null ? selectedMoodIndex - 1 : 2 // default is 2, the midde
    })
    setLoading(false);

  };

  const scrollToSelectedItem = (moodIndex: number, willHaveSelection: boolean = true) => {
    if (!flatListRef.current) return;

    // Calculate the scroll offset manually to ensure accuracy
    // After selection, the FlatList will have padding, so we need to account for that
    const paddingHorizontal = willHaveSelection ? (screenWidth - itemWidth) / 2 : 0;
    const scrollOffset = moodIndex * itemWidth - paddingHorizontal;

    flatListRef.current.scrollToOffset({
      offset: Math.max(0, scrollOffset),
      animated: true,
    });
  };

  const onSelectEmotion = (value: number) => {
    const moodIndex = value - 1; // Convert to 0-based index
    const wasFirstSelection = !hasSelectedOnce;

    setSelectedMoodIndex(value);

    if (!hasSelectedOnce) {
      setHasSelectedOnce(true);
    }

    // Unified spring configuration for synchronized animations

    // Animate all elements with synchronized timing
    scrollViewScale.value = withSpring(2.5, springConfig);
    statusBarColorProgress.value = withSpring(moodIndex / (moodEmojis.length - 1), springConfig);
    textOpacity.value = withSpring(1, springConfig);
    rotateSelectorProgress.value = withSpring(20, springConfig)
    // Scroll to center the selected item with improved timing
    if (flatListRef.current) {
      // Use requestAnimationFrame for better timing coordination
      const performScroll = () => {
        requestAnimationFrame(() => {
          // Additional delay for first selection to allow scale animation to start
          if (wasFirstSelection) {
            //scrollToSelectedItem(moodIndex + 2, true)
            setTimeout(() => scrollToSelectedItem(moodIndex + 2, true), 150);
          } else {
            scrollToSelectedItem(moodIndex + 2, true);
          }
        });
      };

      performScroll();
    }
  };

  // Handle snap-to-select behavior when scrolling
  const onMomentumScrollEnd = (event: any) => {
    if (!hasSelectedOnce) return;

    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / itemWidth);
    const clampedIndex = Math.max(0, Math.min(index, moodEmojis.length - 1));

    if (clampedIndex !== (selectedMoodIndex ? selectedMoodIndex - 1 : -1)) {
      const newValue = clampedIndex + 1;
      setSelectedMoodIndex(newValue);

      // Trigger animations for the newly selected item
      const springConfig = { damping: 20, stiffness: 80 };
      statusBarColorProgress.value = withSpring(clampedIndex / (moodEmojis.length - 1), springConfig);
      textOpacity.value = withSpring(1, springConfig);
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  // Animated styles
  const animatedScrollViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scrollViewScale.value }],
    };
  });

  const animatedStatusBarColor = useAnimatedStyle(() => {
    if (selectedMoodIndex === null) {
      return {
        backgroundColor: TW_COLORS.PRIMARY,
      };
    }

    const color = interpolateColor(
      statusBarColorProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      moodBackgroundColors
    );

    return {
      backgroundColor: color,
    };
  });

  const animatedTextColor = useAnimatedStyle(() => {
    if (selectedMoodIndex === null) {
      return {
        color: TW_COLORS.WHITE,
        backgroundColor: 'transparent'
      };
    }

    const colors = [
      TW_COLORS.PRIMARY,
      TW_COLORS.PRIMARY,
      TW_COLORS.PRIMARY,
      TW_COLORS.PRIMARY,
      TW_COLORS.PRIMARY,
    ];

    const color = interpolateColor(
      statusBarColorProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      colors
    );

    return {
      color: color,
      backgroundColor: 'transparent'
    };
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });



  const renderMoodItem = ({ item, index }: { item: MoodEmoji; index: number }) => {
    const value = index + 1;
    return (
      <MoodItem
        item={item}
        index={index}
        selected={selectedMoodIndex - 1 === index}
        scrollViewScaled={!!selectedMoodIndex}
        onSelect={() => onSelectEmotion(value)}
      />
    );
  };

  const renderMoodSelector = () => (
    <Animated.View style={animatedScrollViewStyle} className="mb-6">
      <FlatList
        ref={flatListRef}
        data={moodEmojis}
        renderItem={renderMoodItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        scrollEnabled={hasSelectedOnce}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - itemWidth) / 2,
          paddingVertical: 5,
          // marginHorizontal: -((screenWidth - itemWidth) / 2),
          alignItems: 'center',
        }}
        style={{
          width: screenWidth,
          flexGrow: 0,
        }}
      />

      {/* Animated description text */}
      {
        selectedMoodIndex !== null && (
          <Animated.View style={animatedTextStyle} className="mt-1 items-center">
            <Text
              className="text-sm font-semibold text-center"
              style={{ color: TW_COLORS.TEXT_PRIMARY }}
            >
              {moodEmojis[selectedMoodIndex - 1]?.label}
            </Text>
          </Animated.View>
        )
      }
    </Animated.View >
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={'Comment vous sentez-vous actuellement ?'}
        handlePrevious={handlePrevious}
        handleSkip={handleSkip}
      />
      <View className="flex-1 p-8">
        <InstructionText>
          Sélectionnez votre ressenti du moment
        </InstructionText>
        <View className="flex-1 p-8 justify-center items-center">
          {renderMoodSelector()}
        </View>
      </View>
      <NavigationButtons
        onNext={handleComplete}
        showPrevious={false}
        loading={loading}
        nextDisabled={!selectedMoodIndex}
        nextText="Continuer"
      />
    </SafeAreaView>
  );
};

const MoodItem = ({
  item,
  index,
  selected,
  scrollViewScaled,
  onSelect,
}: {
  item: MoodEmoji;
  index: number;
  selected: boolean;
  scrollViewScaled: boolean;
  onSelect: () => void;
}) => {
  const rotateSelectorProgress = useSharedValue(0);

  useEffect(() => {
    // Lance l'animation quand sélectionné
    rotateSelectorProgress.value = withSpring(scrollViewScaled ? 10 : 0, springConfig);
  }, [scrollViewScaled]);

  const animatedItemStyle = useAnimatedStyle(() => {
    const direction = index % 2 === 0 ? -1 : 1;
    return {
      transform: [
        {
          rotate: `${direction * rotateSelectorProgress.value}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedItemStyle}>
      <TouchableOpacity
        onPress={onSelect}
        className="items-center p-2 rounded-3xl justify-center"
        style={{
          backgroundColor: item.backgroundColor,
          width: 64,
          height: 80,
          borderWidth: selected ? 2 : 0,
          borderColor: TW_COLORS.PRIMARY,
          marginHorizontal: (screenWidth / 5 - 64) / 2,
        }}
      >
        <View className="flex-1 justify-center items-center">
          {item.icon}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CheckInScreen;
