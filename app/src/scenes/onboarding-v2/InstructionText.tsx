import { ReactNode } from 'react';
import { Text } from 'react-native';

export default function ({ children }: { children: ReactNode }) {
  return <Text
    className="text-base font-medium text-left text-primary mb-4"
  >
    {children}
  </Text>
}