import React, { useRef } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SurveyProgressBar } from './components/SurveyProgressBar';
import { GoalsDaySurvey } from '../../goals/survey/GoalsDaySurvey';

interface GoalsScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  date: string;
  route: any;
  onNext: () => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({
  navigation,
  currentStep,
  totalSteps,
  date,
  route,
  onNext,
}) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const goalsRef = useRef<{ onSubmit?: () => Promise<void> }>(null);

  const handleNext = async () => {
    if (goalsRef.current && typeof goalsRef.current.onSubmit === 'function') {
      await goalsRef.current.onSubmit();
    }
    onNext();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1" 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-5 bg-white/90 z-50">
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 45,
                height: 45,
                borderRadius: 22.5,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, transform: [{ rotate: '270deg' }] }}>↑</Text>
            </TouchableOpacity>
          )}
          <Text style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Karla',
            textAlign: 'center',
            paddingHorizontal: 4,
            color: '#111'
          }}>
            Mes objectifs
          </Text>
          <View style={{ width: 45 }} />
        </View>

        <SurveyProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          className="grow"
          contentContainerStyle={{
            paddingTop: 20,
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
        >
          <GoalsDaySurvey
            date={date}
            ref={goalsRef}
            scrollRef={scrollRef}
            route={route}
          />
        </ScrollView>

        {/* <View className={`absolute bottom-0 left-0 right-0 p-4 bg-white z-50 ${Platform.OS === 'android' ? 'pb-4' : 'pb-0'}`}>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: '#000091',
              borderRadius: 8,
              paddingVertical: 16,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Karla',
            }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
