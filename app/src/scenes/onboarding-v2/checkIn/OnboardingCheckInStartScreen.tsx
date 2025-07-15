import React, { useContext } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from '../types';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { TW_COLORS } from '@/utils/constants';
import Leaf from '@assets/svg/illustrations/Leaf'
import TwoLeaf from '@assets/svg/illustrations/TwoLeaf'
import BeigeWrapperScreen from '../BeigeWrapperScreen';
import BeigeCard from '../BeigeCard';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { DiaryDataContext } from '@/context/diaryData';
type Props = OnboardingV2ScreenProps<'Intro'>;

const NextRoute = 'OnboardingCheckInHowDoYouFeel';

export const OnboardingCheckInStartScreen: React.FC<Props> = ({ navigation }) => {

  const [diaryData] = useContext(DiaryDataContext);

  const handleNext = () => {
    // navigation.navigate(NextRoute)
    const date = formatDay(beforeToday(0));
    const answers = diaryData[date] || {};
    const currentSurvey = { date, answers };
    return navigation.navigate("day-survey", {
      currentSurvey,
      editingSurvey: true,
      isOnboarding: true
    });
  }

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  return <BeigeWrapperScreen
    handleSkip={handleSkip}
    handlePrevious={handlePrevious}
    handleNext={handleNext}>
    <BeigeCard>

      <Text
        className={mergeClassNames(typography.displayXsRegular, "text-center mb-6 text-brand-950")}
      >
        Un pas après l'autre,{'\n'}<Text className="font-bold">vous avancez déjà.</Text>
      </Text>

      <Text
        className={mergeClassNames(typography.textMdSemibold, "text-center text-brand-900")}
      >
        Réalisons ensemble votre première observation.
      </Text>
    </BeigeCard>

  </BeigeWrapperScreen>

  // return (
  //   <SafeAreaView className="flex-1 bg-[#FDF2E7]">
  //     <CheckInHeader
  //       title=""
  //       onPrevious={handlePrevious}
  //       onSkip={handleSkip}
  //       showPrevious={true}
  //       showSkip={true}
  //     />

  //     <View className="flex-1 justify-center items-center p-4">
  //       <View className={'rounded-3xl bg-white p-8 w-full border border-[#FCEBD9]'}>
  //         <Text
  //           className="text-3xl text-center mb-6"
  //           style={{ color: TW_COLORS.TEXT_PRIMARY }}
  //         >
  //           Un pas après l'autre,{'\n'}<Text className="font-bold">vous avancez déjà</Text>
  //         </Text>

  //         <Text
  //           className="text-xl text-center mb-8 leading-8"
  //           style={{ color: TW_COLORS.TEXT_SECONDARY }}
  //         >
  //           Réalisons ensemble votre première observation.
  //         </Text>
  //       </View>
  //     </View>
  //     <Leaf
  //       style={{
  //         position: 'absolute',
  //         top: -60,
  //         right: -60,
  //         zIndex: 2
  //       }}
  //       width={234}
  //       height={240}
  //     />
  //     <Leaf
  //       width={140}
  //       height={125}
  //       style={{
  //         position: 'absolute',
  //         top: '60%',
  //         right: -40,
  //         zIndex: 2
  //       }} />
  //     <TwoLeaf
  //       width={262}
  //       height={197}
  //       style={{
  //         position: 'absolute',
  //         bottom: '15%',
  //         left: -60,
  //         zIndex: 2
  //       }} />
  //     <NavigationButtons
  //       onNext={handleNext}
  //       showPrevious={false}
  //       nextText="Continuer vers ma première"
  //     />
  //   </SafeAreaView>
  // );
};

export default OnboardingCheckInStartScreen
