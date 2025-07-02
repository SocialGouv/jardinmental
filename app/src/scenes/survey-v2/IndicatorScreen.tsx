import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Indicator, INDICATORS_CATEGORIES } from '@/entities/Indicator';
import { DiaryDataNewEntryInput } from '@/entities/DiaryData';
import { IndicatorSurveyItem } from '@/components/survey/IndicatorSurveyItem';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BannerHeader from '../onboarding-v2/BannerHeader';
import MoonIcon from '@assets/svg/icon/moon';
import ThoughtIcon from '@assets/svg/icon/thought';
import BehaviourIcon from '@assets/svg/icon/behaviour';
import InstructionText from '../onboarding-v2/InstructionText';

interface IndicatorScreenProps {
  navigation: any;
  title: string;
  indicators: Indicator[];
  currentStep: number;
  totalSteps: number;
  answers: DiaryDataNewEntryInput['answers'];
  onValueChanged: ({ key, value }: { key: string; value: any }) => void;
  onCommentChanged: ({ key, userComment }: { key: string; userComment: string }) => void;
  onNext: () => void;
  category?: INDICATORS_CATEGORIES;
}

const ICON_FOR_CATEGORY: Record<INDICATORS_CATEGORIES, React.ReactNode> = {
  [INDICATORS_CATEGORIES["Emotions/sentiments"]]: <MoonIcon />,
  [INDICATORS_CATEGORIES["Manifestations physiques"]]: <MoonIcon />,
  [INDICATORS_CATEGORIES["Pensées"]]: <ThoughtIcon />,
  [INDICATORS_CATEGORIES["Comportements"]]: <BehaviourIcon />,
}

export const IndicatorScreen: React.FC<IndicatorScreenProps> = ({
  navigation,
  title,
  indicators,
  answers,
  onValueChanged,
  onCommentChanged,
  onNext,
  category
}) => {
  console.log('IndicatorScreen', category, title);

  // Scroll tracking
  const scrollY = useSharedValue(0);
  const measuredHeight = useSharedValue(0); // Store the measured natural height
  const SCROLL_THRESHOLD = 100; // Distance to scroll before full transition (reduced for more responsive animation)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Handle layout measurement to capture natural height
  const handleBannerLayout = (event) => {
    if (measuredHeight.value === 0) { // Only measure once
      measuredHeight.value = event.nativeEvent.layout.height;
    }
  };

  // Animated styles for banner container (dynamic height animation)
  const bannerContainerStyle = useAnimatedStyle(() => {
    if (measuredHeight.value === 0) {
      // Before measurement, apply default padding
      return {
        paddingVertical: 16,
        paddingBottom: 32,
        paddingHorizontal: 24,
      };
    }

    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [measuredHeight.value, 10], // From measured height to 0
      Extrapolate.CLAMP
    );

    const paddingVertical = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [16, 0], // From py-4 (16px) to 0
      Extrapolate.CLAMP
    );

    const paddingBottom = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [32, 0], // From pb-8 (32px) to 0
      Extrapolate.CLAMP
    );

    const paddingHorizontal = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [24, 0], // From px-6 (24px) to 0
      Extrapolate.CLAMP
    );

    return {
      height,
      paddingTop: paddingVertical,
      paddingBottom,
      paddingHorizontal,
      minHeight: 0,
      overflow: 'hidden', // Ensure content doesn't overflow during height animation
    };
  });

  // Animated styles for banner content (opacity only)
  const bannerContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Separate style for title margin animation
  const titleMarginStyle = useAnimatedStyle(() => {
    const marginTop = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [32, 0], // From mt-8 (32px) to 0
      Extrapolate.CLAMP
    );

    return {
      marginTop,
    };
  });

  // Animated styles for header title transition
  const headerTitleStyle = useAnimatedStyle(() => {
    const originalOpacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: originalOpacity,
    };
  });

  const dynamicTitleStyle = useAnimatedStyle(() => {
    const dynamicOpacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: dynamicOpacity,
    };
  });

  return <SafeAreaView className="flex-1 bg-white">
    {/* <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
      /> */}
    <BannerHeader
      headerTitle='Observation du jour'
      dynamicTitle={title}
      header={category ? <View className='rounded-full bg-white/30 p-2 self-start w-auto'>
        {ICON_FOR_CATEGORY?.[category]}
      </View> : null}
      title={title}
      handlePrevious={() => navigation.goBack()}
      handleSkip={onNext}
      headerTitleStyle={headerTitleStyle}
      dynamicTitleStyle={dynamicTitleStyle}
      bannerContentStyle={bannerContentStyle}
      bannerContainerStyle={bannerContainerStyle}
      titleMarginStyle={titleMarginStyle}
      onBannerLayout={handleBannerLayout}
    ></BannerHeader>
    <Animated.ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}>

      <View className="flex-1 justify-center items-center px-6 py-6">
        <InstructionText>Prenons un instant pour faire le point sur {title}</InstructionText>
        {indicators.map((indicator, index) => (
          <IndicatorSurveyItem
            key={indicator.uuid}
            indicator={indicator}
            index={index}
            value={answers?.[indicator.name]?.value}
            onValueChanged={({ indicator, value }) =>
              onValueChanged({ key: indicator.name, value })
            }
            onCommentChanged={({ indicator, comment }) =>
              onCommentChanged({ key: indicator.name, userComment: comment })
            }
            comment={answers?.[indicator.name]?.userComment}
          />
        ))}
        <Text
          className="text-sm text-center mt-4 px-4"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Vous pouvez sélectionner plusieurs options
        </Text>
      </View>
    </Animated.ScrollView>
    <NavigationButtons
      onNext={onNext}
      showPrevious={false}
      // loading={loading}
      nextText="Suivant"
    />
  </SafeAreaView>
};
