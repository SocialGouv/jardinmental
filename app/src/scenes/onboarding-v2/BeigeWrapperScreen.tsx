import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { TW_COLORS } from '@/utils/constants';
import Leaf from '@assets/svg/illustrations/Leaf'
import TwoLeaf from '@assets/svg/illustrations/TwoLeaf'
import { OnboardingV2ScreenProps } from './types';
import BeigeCard from './BeigeCard';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';
type Props = OnboardingV2ScreenProps<'Intro'>;

export const BeigeWrapperScreen: React.FC<Props> = ({
    handlePrevious,
    handleSkip,
    handleNext,
    children }) => {


    return (
        <SafeAreaViewWithOptionalHeader className="flex-1 bg-[#FDF2E7]">
            <CheckInHeader
                title=""
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                showPrevious={true}
                showSkip={true}
            />

            <BeigeCard>
                {children}
            </BeigeCard>
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
            <NavigationButtons
                onNext={handleNext}
                showPrevious={false}
                nextText="Continuer vers ma première"
            />
        </SafeAreaViewWithOptionalHeader>
    );
};

export default BeigeWrapperScreen
