import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { TW_COLORS } from '@/utils/constants';
import Leaf from '@assets/svg/illustrations/Leaf'
import TwoLeaf from '@assets/svg/illustrations/TwoLeaf'
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';
import ChevronIcon from '@assets/svg/icon/chevron';

type Props = {
    variant?: 'beige' | 'white' | 'green' | 'blue';
    handlePrevious?: () => void;
    handleSkip?: () => void;
    handleNext?: () => void;
    children: React.ReactNode;
    nextText?: string;
};

const VARIANT_COLORS = {
    beige: 'bg-[#FDF2E7]',
    red: 'bg-[#FAEEEF]',
    pink: 'bg-[#FEF8FB]',
    white: TW_COLORS.WHITE,
    green: `bg-[#EEF9F1]`,
    blue: `bg-[#E8F7F4]`,
}

const VARIANT_RAW_COLORS = {
    beige: '#FDF2E7',
    red: '#FAEEEF',
    pink: '#FEF8FB',
    white: TW_COLORS.WHITE,
    green: '#EEF9F1',
    blue: '#E8F7F4',
};

const VARIANT_BORDER_COLORS = {
    beige: 'bg-[#FDF2E7]',
    red: 'bg-[#FAEEEF]',
    pink: 'bg-[#FEF8FB]',
    white: TW_COLORS.WHITE,
    green: `bg-[#EEF9F1]`,
    blue: `#CCEEE8`,
    yellow: '#FCF0D3'

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
    children }: Props) => {

    // Get screen dimensions and calculate scale factor
    const { width: screenWidth } = Dimensions.get('window');
    const REFERENCE_WIDTH = 500; // iPhone 16 width where current dimensions work well
    const scaleFactor = screenWidth / REFERENCE_WIDTH;
    // Calculate responsive dimensions for leaves
    const leaf1Dimensions = {
        width: Math.round(234 * scaleFactor),
        height: Math.round(240 * scaleFactor)
    };

    const leaf2Dimensions = {
        width: Math.round(140 * scaleFactor),
        height: Math.round(125 * scaleFactor)
    };

    const twoLeafDimensions = {
        width: Math.round(262 * scaleFactor),
        height: Math.round(197 * scaleFactor)
    };

    return (
        <SafeAreaViewWithOptionalHeader className={`flex-1 ${VARIANT_COLORS[variant]}`}>
            <StatusBar backgroundColor={VARIANT_RAW_COLORS[variant]} />
            <CheckInHeader
                title=""
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                showPrevious={true}
                showSkip={true}
                leftComponent={<ChevronIcon color={TW_COLORS.PRIMARY} />}
                animatedTextColor={{ color: TW_COLORS.PRIMARY }}
            />

            {children}
            {/* <Leaf
                style={{
                    position: 'absolute',
                    top: -60 * scaleFactor,
                    right: -60 * scaleFactor,
                    zIndex: 2
                }}
                color={VARIANT_LEAF_COLORS[variant]}
                width={leaf1Dimensions.width}
                height={leaf1Dimensions.height}
            />
            <Leaf
                width={leaf2Dimensions.width}
                height={leaf2Dimensions.height}
                color={VARIANT_LEAF_COLORS[variant]}
                style={{
                    position: 'absolute',
                    top: '60%',
                    right: -40 * scaleFactor,
                    zIndex: 2
                }} />
            <TwoLeaf
                width={twoLeafDimensions.width}
                height={twoLeafDimensions.height}
                color={VARIANT_LEAF_COLORS[variant]}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: -60 * scaleFactor,
                    zIndex: 2
                }} /> */}
            {handleNext && <NavigationButtons
                onNext={handleNext}
                // onPrevious={handlePrevious}
                showPrevious={false}
                nextText={nextText || "Suivant"}
            />}
        </SafeAreaViewWithOptionalHeader>
    );
};

export default BeigeWrapperScreen
