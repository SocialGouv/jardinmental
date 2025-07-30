import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, Objective, Difficulty } from '../types';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserProfile } from '@/context/userProfile';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from '@/utils/constants';
import { SafeAreaViewWithOptionalHeader, useOnboardingProgressHeader } from '@/scenes/onboarding/ProgressHeader';
import BannerHeader from '../BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem from '@/components/SelectionnableItem';
import { INDICATOR_CATEGORIES_DATA } from '../data/helperData';
import { SUBCATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from '@/utils/liste_indicateurs.1';
import InstructionText from '../InstructionText';
import { AnimatedHeaderScrollScreen } from '@/scenes/survey-v2/AnimatedHeaderScrollScreen';

type Props = OnboardingV2ScreenProps<'PersonalizationObjective'>;

const NextScreen = 'OnboardingLoadingScreen'

export const SubcategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
    const { updateUserSubcategories, profile } = useUserProfile();
    const [selectedSubcategories, setSelectedSubcategories] = useState<NEW_INDICATORS_SUBCATEGORIES[]>(profile?.selectedSubcategories || []);
    const { setSlideIndex, setIsVisible } = useOnboardingProgressHeader();

    const handleNext = async () => {
        if (selectedSubcategories.length > 0) {
            if (profile) {
                await updateUserSubcategories(selectedSubcategories);
            }

            navigation.navigate(NextScreen);
            setSlideIndex(-1);
            setIsVisible(false)
        }
    };

    const handlePrevious = () => {
        navigation.goBack();
    };

    const handleSkip = () => {
        navigation.navigate(NextScreen);
    };

    const handleItemPress = (item: NEW_INDICATORS_SUBCATEGORIES) => {
        const isSelected = selectedSubcategories.some(selected => selected === item);

        if (isSelected) {
            // Remove item from selection
            setSelectedSubcategories(prev => prev.filter(selected => selected !== item));
        } else {
            // Add item to selection
            setSelectedSubcategories(prev => [...prev, item]);
        }
    };

    const renderSubCategoryItem = ({ item }: { item: NEW_INDICATORS_SUBCATEGORIES }) => (
        <SelectionnableItem
            onPress={() => handleItemPress(item)}
            key={item}
            id={item}
            label={SUBCATEGORIES[item]?.label || item}
            selected={selectedSubcategories.some(selected => selected === item)}>
        </SelectionnableItem>
    );

    const animatedStatusBarColor = useAnimatedStyle(() => {
        return {
            backgroundColor: TW_COLORS.PRIMARY,
        };
    })

    const animatedTextColor = useAnimatedStyle(() => {
        return {
            backgroundColor: 'transparent',
            // color: TW_COLORS.WHITE,
        };
    })
    return (<AnimatedHeaderScrollScreen
        title={`Précisez ce que souhaitez vous suivre en priorité`}
        dynamicTitle={'Priorités'}
        navigation={navigation}
        hasProgressBar={true}
        bottomComponent={<NavigationButtons
            absolute={true}
            withArrow={true}
            onNext={handleNext}
            headerContent={
                <View>
                    <View className='my-2'>
                        <Text className={mergeClassNames(typography.textSmMedium, 'text-gray-700 text-center')}>Vous pourrez modifier cette sélection plus tard</Text>
                    </View>
                </View>
            }
            // onPrevious={handlePrevious}
            onSkip={handleSkip}
            showSkip={true}
            nextDisabled={selectedSubcategories.length === 0}
            nextText="Valider et continuer"
            skipText="Passer cette étape"
        />}
    >
        <View className="px-6 py-4 pb-0" style={{}}>
            <InstructionText
            >
                Parmi {profile?.selectedDifficulties.filter(diff => INDICATOR_CATEGORIES_DATA[diff].subCat).map(difficulty =>
                    `"${INDICATOR_CATEGORIES_DATA[difficulty].name}"`
                ).join(', ')}, quels sont les éléments les plus importants que vous souhaitez observer ?
            </InstructionText>
        </View>
        <View className="px-6">
            {Object.values(INDICATOR_CATEGORIES_DATA)
                .filter(item => profile?.selectedDifficulties.includes(item.category))
                .filter(item => item.subCat && item.subCat.length > 0)
                .map((cat, index) => {
                    return <View key={cat.id}>
                        <View className={`flex-row items-center p-4 px-0 pb-6 ${index === 0 ? 'pt-2' : 'pt-6'}`}>
                            <View className='rounded-full border-[1.5px] border-brand-900 bg-white w-10 h-10 items-center justify-center'>
                                {React.createElement(cat.icon, { color: TW_COLORS.BRAND_900 })}
                            </View>
                            <Text className={mergeClassNames(typography.textLgBold, 'text-left text-brand-900 ml-2')}>
                                {cat.name}
                            </Text>
                        </View>
                        {cat.subCat.map(item => renderSubCategoryItem({ item }))}
                    </View>
                })}
        </View>
    </AnimatedHeaderScrollScreen>)
    {/* return (
        <SafeAreaViewWithOptionalHeader className="flex-1 bg-white" style={{ flex: 1 }}>
            <BannerHeader
                hidden={HEADER_WITH_BANNER}
                hideHeader={PROGRESS_BAR_AND_HEADER}
                animatedStatusBarColor={animatedStatusBarColor}
                animatedTextColor={animatedTextColor}
                // header={<View className="flex-row flex-wrap gap-2 mt-8">
                //     {profile?.selectedDifficulties.map(difficulty => (
                //         <View
                //             key={difficulty}
                //             className={mergeClassNames(
                //                 typography.textXlSemibold,
                //                 'border border-1 border-gray-700 w-auto rounded rounded-md'
                //             )}
                //         >
                //             <Text className='text-white py-1 px-2'>
                //                 {INDICATOR_CATEGORIES_DATA[difficulty].label}
                //             </Text>
                //         </View>
                //     ))}
                // </View>}
                title={`Précisez ce que souhaitez vous suivre en priorité`}
                handleSkip={handleSkip}
                handlePrevious={handlePrevious}
            />
            <ScrollView className="flex-1" style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 200 }}>
                <View className="px-6 py-4" style={{}}>
                    <InstructionText
                    >
                        Parmis {profile?.selectedDifficulties.filter(diff => INDICATOR_CATEGORIES_DATA[diff].subCat).map(difficulty =>
                            `"${INDICATOR_CATEGORIES_DATA[difficulty].name}"`
                        ).join(', ')}, quels sont les éléments les plus importants que vous souhaitez observer ?
                    </InstructionText>
                </View>
                <View className="px-6" style={{}}>
                    {Object.values(INDICATOR_CATEGORIES_DATA)
                        .filter(item => profile?.selectedDifficulties.includes(item.category))
                        .filter(item => item.subCat && item.subCat.length > 0)
                        .map((cat) => {
                            return <View key={cat.id}>
                                <View className='flex-row p-4'>{React.createElement(cat.icon, { color: TW_COLORS.GRAY_700 })}<Text className={mergeClassNames(typography.textSmBold, 'text-left text-brand-900 ml-2')}>{cat.name}</Text></View>
                                {cat.subCat.map(item => renderSubCategoryItem({ item }))}
                            </View>
                        })}
                </View>
            </ScrollView>

            <NavigationButtons
                absolute={true}
                onNext={handleNext}
                headerContent={
                    <View>
                        <View className='my-2'>
                            <Text className={mergeClassNames(typography.textSmMedium, 'text-gray-700 text-center')}>Vous pourrez modifier cette sélection plus tard</Text>
                        </View>
                    </View>
                }
                // onPrevious={handlePrevious}
                onSkip={handleSkip}
                showSkip={true}
                nextDisabled={selectedSubcategories.length === 0}
                nextText="Continuer"
                skipText="Passer cette étape"
            />
        </SafeAreaViewWithOptionalHeader>
    ); */}
};

export default SubcategoriesScreen;
