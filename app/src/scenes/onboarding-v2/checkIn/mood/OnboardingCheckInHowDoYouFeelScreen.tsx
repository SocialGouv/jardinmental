import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Platform, Dimensions, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { OnboardingV2ScreenProps } from '../../types';
import { EMOTION_COLORS, TW_COLORS } from '@/utils/constants';
import SmileyVeryGood from '@assets/svg/smileys/veryGood'
import SmileyBad from '@assets/svg/smileys/bad'
import SmileyVeryBad from '@assets/svg/smileys/veryBad'
import SmileyMiddle from '@assets/svg/smileys/middle'
import SmileyGood from '@assets/svg/smileys/good'
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');


type Props = OnboardingV2ScreenProps<'OnboardingCheckInHowDoYouFeel'>;

const moodEmojis = [
  {
    backgroundColor: EMOTION_COLORS.veryBad,
    label: 'Très mauvais',
    icon: <SmileyVeryBad />
  },
  {
    backgroundColor: EMOTION_COLORS.bad,
    label: 'Mauvais',
    icon: <SmileyBad />
  },
  {
    backgroundColor: EMOTION_COLORS.middle,
    label: 'Middle',
    icon: <SmileyMiddle />
  },
  {
    backgroundColor: EMOTION_COLORS.good,
    label: 'Bon',
    icon: <SmileyGood />
  },
  {
    backgroundColor: EMOTION_COLORS.veryGood,
    label: 'Très bon',
    icon: <SmileyVeryGood />
  },
];

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);
  const [hasSelectedOnce, setHasSelectedOnce] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  // Animated values
  const scrollViewScale = useSharedValue(1);
  const statusBarColorProgress = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const scrollPosition = useSharedValue(0);

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
    const springConfig = { damping: 20, stiffness: 80 };

    // Animate all elements with synchronized timing
    scrollViewScale.value = withSpring(2.5, springConfig);
    statusBarColorProgress.value = withSpring(moodIndex / (moodEmojis.length - 1), springConfig);
    textOpacity.value = withSpring(1, springConfig);

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

    const colors = [
      EMOTION_COLORS.veryBad,
      EMOTION_COLORS.bad,
      EMOTION_COLORS.middle,
      EMOTION_COLORS.good,
      EMOTION_COLORS.veryGood,
    ];

    const color = interpolateColor(
      statusBarColorProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      colors
    );

    return {
      backgroundColor: color,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const renderMoodItem = ({ item, index }: { item: any; index: number }) => {
    const value = index + 1;
    const isSelected = selectedMoodIndex === value;

    return (
      <TouchableOpacity
        onPress={() => onSelectEmotion(value)}
        className="items-center p-2 rounded-3xl justify-center"
        style={{
          backgroundColor: item.backgroundColor,
          width: 64,
          height: 80,
          marginHorizontal: (itemWidth - 64) / 2, // Center the item within its allocated width
        }}
      >
        <View className="flex-1 justify-center items-center">
          {item.icon}
        </View>
      </TouchableOpacity>
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
          <Animated.View style={animatedTextStyle} className="mt-4 items-center">
            <Text
              className="text-lg font-semibold text-center"
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
      {Platform.OS === 'ios' && (
        <Animated.View style={[animatedStatusBarColor, { position: 'absolute', top: 0, left: 0, right: 0, height: 100, zIndex: 1000 }]} />
      )}
      <Animated.View
        style={[animatedStatusBarColor]}
        className="rounded-b-3xl py-4 pb-8"
      >
        <CheckInHeader
          title="Observation du jour"
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          showPrevious={true}
          showSkip={true}
        />
        <Text
          className="text-2xl font-bold text-center mt-8"
          style={{ color: TW_COLORS.WHITE }}
        >
          Comment vous sentez-vous actuellement ?
        </Text>
      </Animated.View>
      <View className="flex-1 p-8">
        <Text
          className=""
        >
          Sélectionnez votre ressenti du moment
        </Text>
        <View className="flex-1 p-8 justify-center items-center">
          {renderMoodSelector()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckInScreen;
