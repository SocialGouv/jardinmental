import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { mergeClassNames } from '@/utils/className';
import ArrowIcon from '@assets/svg/icon/Arrow';

type ButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  className?: string;
  style?: StyleProp<ViewStyle>;
  textClassName?: string;
  title?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: JSX.Element;
  iconPosition?: 'right' | 'left',
  size?: 'small' | 'medium' | 'large';
  width?: 'full' | 'fixed' | 'adapt';
};

export default function JMButton({
  variant = 'primary',
  size = 'medium',
  width = 'full',
  className = '',
  style,
  textClassName = '',
  title,
  children,
  disabled = false,
  loading = false,
  iconPosition = 'left',
  icon,
  ...props
}: ButtonProps) {
  const heightMap: Record<'small' | 'medium' | 'large', number> = {
    small: 32,
    large: 52,
    medium: 48,
  };

  const paddingMap: Record<'small' | 'medium' | 'large', string> = {
    small: 'px-3 py-1.5',
    large: 'px-6 py-4',
    medium: 'px-5 py-3',
  };

  const textSizeMap: Record<'small' | 'medium' | 'large', string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const classMap: Record<'full' | 'adapt' | 'fixed', string> = {
    full: 'w-full',
    adapt: 'flex-1', // the button should be in a row
    fixed: '',
  };

  const baseClasses = `${classMap[width]} ${paddingMap[size]} rounded-3xl items-center justify-center flex-row`;
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-500';
      break;
    case 'outline':
      variantClasses = 'border border-primary bg-white';
      break;
    case 'text':
      variantClasses = 'bg-transparent';
      break;
  }

  const disabledClasses = disabled || loading ? 'bg-[#EFF1F5]' : '';
  const finalClassName = mergeClassNames(baseClasses, variantClasses, disabledClasses, className);

  let textColor = 'text-white';
  if (variant === 'outline') textColor = 'text-primary';
  if (variant === 'secondary') textColor = 'text-black';
  if (variant === 'text') textColor = 'text-primary';
  if (disabled || loading) textColor = 'text-gray-800'

  const styledIcon = icon
    ? React.cloneElement(icon, {
      width: 15,
      height: 15,
      styleContainer: {
        ...(icon.props?.styleContainer || {}),
        width: 15,
        height: 15,
      },
    })
    : null;
  return (
    <TouchableOpacity
      className={finalClassName}
      style={[{ height: heightMap[size] }, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? '#134449' : '#fff'}
          className="mr-2"
        />
      )}
      {!loading && styledIcon && iconPosition === 'left' && <View className={!!(children ?? title) ? `mr-2` : ''}>{styledIcon}</View>}
      {!!(children || title) && <Text
        className={mergeClassNames(
          'font-semibold',
          textSizeMap[size],
          textColor,
          textClassName
        )}
      >
        {title}
      </Text>}
      {!loading && icon && iconPosition === 'right' && <View className={!!(children ?? title) ? `ml-2` : ''}>{icon}</View>}
    </TouchableOpacity>
  );
}