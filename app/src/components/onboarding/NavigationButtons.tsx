import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { TW_COLORS } from '@/utils/constants';
import JMButton from '../JMButton';
import ChevronIcon from '@assets/svg/icon/chevron';
import CircleQuestionMark from '@assets/svg/icon/CircleQuestionMark'

// Navigation Props
interface NavigationButtonsProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  showPrevious?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
  nextText?: string;
  skipText?: string;
  loading?: boolean;
  absolute?: boolean;
  onLeftAction?: () => void;
  onLeftIconAction?: JSX.Element,
  headerContent?: JSX.Element
}

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
  absolute = false,
  onLeftAction,
  onLeftIconAction,
  headerContent
}) => {
  return (
    <View
      style={absolute ? {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      } : null}
      className={`p-6 px-6 ${absolute ? 'bg-white/50 pb-10' : ''}`}>
      {headerContent}
      <View className='flex-row justify-between items-center'>
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
        {typeof onLeftAction === 'function' && <JMButton
          onPress={onLeftAction}
          variant='outline'
          width='fixed'
          icon={onLeftIconAction || <CircleQuestionMark />}
          className='mr-2'
          loading={loading}
        />
        }

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
    </View>
  );
};

export default NavigationButtons;
