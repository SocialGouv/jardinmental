import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

export default function ({ children }: { children: ReactNode }) {
  return <View className="w-full"><Text
    className={mergeClassNames(typography.textMdMedium, 'text-left text-brand-900 mb-6')}
  >
    {children}
  </Text></View>
}