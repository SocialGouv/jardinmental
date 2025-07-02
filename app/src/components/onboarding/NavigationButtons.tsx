import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { NavigationButtonsProps } from '@/scenes/onboarding-v2/types';
import { TW_COLORS } from '@/utils/constants';
import JMButton from '../JMButton';
import ChevronIcon from '@assets/svg/icon/chevron';

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  nextDisabled = false,
  nextText = 'Suivant',
  skipText = 'Passer',
  loading = false,
  absolute = false
}) => {
  return (
    <View
      style={absolute ? {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      } : null}
      className={`flex-row justify-between items-center p-6 px-6 ${absolute ? 'bg-white/50 pb-10' : ''}`}>

      {/* <View
        className="flex-row justify-between items-center p-6 px-6 bg-white/50"> */}
      {typeof onPrevious === 'function' && <JMButton
        onPress={onPrevious}
        variant='outline'
        width='fixed'
        icon={<ChevronIcon />}
        // title='<'
        className='mr-2'
        loading={loading}
      />}

      <JMButton
        onPress={onNext}
        title={nextText}
        width='adapt'
        loading={loading}
        disabled={nextDisabled}
      />
      {/* <TouchableOpacity 
        onPress={onNext}
        disabled={nextDisabled || loading}
        className="px-6 py-3 rounded-lg items-center justify-center w-full"
        style={{ 
          backgroundColor: nextDisabled ? TW_COLORS.GRAY_LIGHT : TW_COLORS.PRIMARY,
          opacity: nextDisabled ? 0.6 : 1
        }}
      >
        {loading ? (
          <ActivityIndicator color={TW_COLORS.WHITE} size="small" />
        ) : (
          <Text 
            className="text-base font-semibold"
            style={{ color: TW_COLORS.WHITE }}
          >
            {nextText}
          </Text>
        )}
      </TouchableOpacity> */}
    </View>
  );
};

export default NavigationButtons;
