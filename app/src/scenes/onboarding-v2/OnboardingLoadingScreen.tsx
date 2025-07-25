import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from './types';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';

type Props = OnboardingV2ScreenProps<'OnboardingLoadingScreen'>;

const OnboardingLoadingScreen: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('OnboardingChooseIndicator');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-brand-950">
            <View className="flex-1 justify-center items-center px-6">
                <ActivityIndicator
                    size="large"
                    color="white"
                />
                <Text
                    className={mergeClassNames(
                        typography.textLgMedium,
                        'text-white text-center mt-6'
                    )}
                >
                    Création de votre suivi personnalisé...
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingLoadingScreen;
