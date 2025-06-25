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
};

export default function JMButton({
  variant = 'primary',
  className = '',
  style,
  textClassName = '',
  title,
  children,
  disabled = false,
  loading = false,
  icon,
  ...props
}: ButtonProps) {
  const baseClasses = 'w-full px-6 py-3 rounded-full items-center justify-center flex-row';
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

  const disabledClasses = disabled || loading ? 'opacity-50' : '';
  const finalClassName = mergeClassNames(baseClasses, variantClasses, disabledClasses, className);

  // Determine text color
  let textColor = 'text-white';
  if (variant === 'outline') textColor = 'text-primary';
  if (variant === 'secondary') textColor = 'text-black';
  if (variant === 'text') textColor = 'text-primary';

  // Styled icon with fixed size
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
      style={style}
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
      {!loading && styledIcon && <View className="mr-2">{styledIcon}</View>}
      <Text className={mergeClassNames('text-base font-semibold', textColor, textClassName)}>
        {children ?? title}
      </Text>
    </TouchableOpacity>
  );
}