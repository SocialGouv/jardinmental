import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type DifficultyOptionProps = {
    id: string | number;
    label: string;
    selected: boolean;
    onPress: (id: string | number) => void;
    className?: string;
};

export default function SelectionnableItem({
    id,
    label,
    selected,
    onPress,
    className,
}: DifficultyOptionProps) {
    return (
        <TouchableOpacity
            onPress={() => onPress(id)}
            className={mergeClassNames(
                'mx-4 mb-3 p-4 rounded-xl border-2',
                selected ? 'border-brand-800 bg-brand-25' : 'border-gray-300 bg-transparent',
                className
            )}
        >
            <View className="flex-row items-center">
                {/* Icon could go here */}
                <View className="flex-1">
                    <Text className={mergeClassNames(typography.textMdMedium, 'text-brand-950')}>
                        {label}
                    </Text>
                </View>

                {selected ? (
                    <View className="w-6 h-6 rounded-md items-center justify-center bg-primary">
                        <Text className="text-white text-base font-bold">✓</Text>
                    </View>
                ) : (
                    <View className="w-6 h-6 rounded-md items-center justify-center border-2 border-gray-300">
                        <Text className="text-white text-xs" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};