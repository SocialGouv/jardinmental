import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { typography } from '@/utils/typography';
import { mergeClassNames } from '@/utils/className';
import { Screen } from '@/components/Screen'
import Bell from '@assets/svg/icon/Bell'
import Analytics from '@assets/svg/icon/Analytics'
import Profile from '@assets/svg/icon/Profile'
import Goal from '@assets/svg/icon/Goal'
import Health from '@assets/svg/icon/Health'
import WinkSmiley from '@assets/svg/icon/WinkSmiley'
import CheckMarkIcon from '@assets/svg/icon/check';
import ArrowIcon from '@assets/svg/icon/Arrow'
import { colors } from '@/utils/colors';
import { iconColors } from '@/utils/constants';

const checklistItems = [
    {
        label: 'Programmer un rappel',
        icon: <Bell />,
        path: "reminder"
    },
    {
        label: 'Personnaliser mes indicateurs',
        icon: <Analytics />,
        path: "symptoms"
    },
    {
        label: 'Personnaliser mon profil',
        icon: <Profile />,
    },
    {
        label: 'Personnaliser mes objectifs',
        icon: <Goal />,
        path: 'goals-settings'
    },
    {
        label: 'Ajouter un traitement',
        icon: <Health />,
        path: "drugs"
    },
    {
        label: 'Ma première observation',
        icon: <WinkSmiley />,
        isDone: true
    }
];

const ChevronRightIcon = () => (
    <Svg width="6" height="9" viewBox="0 0 6 9" fill="none">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.78047 4.49999L0.480469 1.19999L1.42314 0.257324L5.6658 4.49999L1.42314 8.74266L0.480469 7.79999L3.78047 4.49999Z"
            fill="currentColor"
        />
    </Svg>
);

const GenericIcon = () => (
    <View className="w-6 h-6 rounded-full bg-brand-500 items-center justify-center">
        <View className="w-3 h-3 rounded-full bg-white" />
    </View>
);

export default function CheckListScreen({ navigation, route }) {
    const handleItemPress = (item) => {
        console.log('Pressed:', item);
        navigation.navigate(item.path)
        // Placeholder for navigation - will be implemented later
    };

    return (
        <View className="bg-gray-50 flex-1">
            <Screen
                header={{
                    title: "Premier pas",
                }}
            >
                <View>
                    <Text className={mergeClassNames(typography.displayXsBold, 'text-brand-950 text-left mb-8')}>Bien démarrer sur Jardin Mental</Text>
                    <Text className={mergeClassNames(typography.textMdRegular, 'text-brand-950 text-left mb-8')}>Pour profiter un maximum de Jardin Mental, vous pouvez complétez quelques étapes de personnalisation</Text>
                    {checklistItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            disabled={item.isDone}
                            onPress={() => handleItemPress(item)}
                            className={mergeClassNames('flex-row items-center p-4 mb-3 bg-white rounded-xl border border-gray-200', item.isDone ? 'bg-[#EBF9F4]' : '')}
                        >
                            {/* Left Icon */}
                            {item.icon}

                            {/* Text */}
                            <Text className={mergeClassNames(`flex-1 ml-4 ${typography.textMdMedium} text-brand-950`, item.isDone ? 'line-through text-mood-5' : '')}>
                                {item.label}
                            </Text>

                            {/* Right Arrow */}
                            <View className="text-gray-400">
                                {item.isDone ? <CheckMarkIcon color={iconColors.veryGood} /> : <ArrowIcon />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Screen>
        </View>
    );
}
