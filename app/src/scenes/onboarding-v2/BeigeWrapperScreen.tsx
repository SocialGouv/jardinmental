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
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { colors } from '@/utils/colors';

type Props = {
    variant?: 'beige' | 'white' | 'green' | 'blue';
    handlePrevious: () => void;
    handleSkip: () => void;
    handleNext: () => void;
    children: React.ReactNode;
    nextText?: string;
};

const VARIANT_COLORS = {
    beige: 'bg-[#FDF2E7]',
    white: TW_COLORS.WHITE,
    green: `bg-[#FAFBEA]`,
    blue: `bg-[#FAFFFF]`,
}

const VARIANT_LEAF_COLORS = {
    beige: '#FCEBD9',
    white: TW_COLORS.WHITE,
    blue: TW_COLORS.LIGHT_BLUE,
    green: '#EBEEAC',
}

export const BeigeWrapperScreen: React.FC<Props> = ({
    handlePrevious,
    handleSkip,
    handleNext,
    nextText,
    variant = 'beige',
    children }) => {


    return (
        <SafeAreaViewWithOptionalHeader className={`flex-1 ${VARIANT_COLORS[variant]}`}>
            <CheckInHeader
                title=""
                // onPrevious={handlePrevious}
                onSkip={handleSkip}
                showPrevious={true}
                showSkip={true}
                animatedTextColor={{ color: TW_COLORS.PRIMARY }}
            />

            {children}
            <Leaf
                style={{
                    position: 'absolute',
                    top: -60,
                    right: -60,
                    zIndex: 2
                }}
                color={VARIANT_LEAF_COLORS[variant]}
                width={234}
                height={240}
            />
            <Leaf
                width={140}
                height={125}
                color={VARIANT_LEAF_COLORS[variant]}
                style={{
                    position: 'absolute',
                    top: '60%',
                    right: -40,
                    zIndex: 2
                }} />
            <TwoLeaf
                width={262}
                height={197}
                color={VARIANT_LEAF_COLORS[variant]}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: -60,
                    zIndex: 2
                }} />
            {handleNext && <NavigationButtons
                onNext={handleNext}
                onPrevious={handlePrevious}
                showPrevious={false}
                nextText={nextText || "Suivant"}
            />}
        </SafeAreaViewWithOptionalHeader>
    );
};

export default BeigeWrapperScreen
