import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SurveyProgressBar } from './components/SurveyProgressBar';
import QuestionYesNo from '../../survey/QuestionYesNo';
import NavigationButtons from '../../onboarding-v2/components/NavigationButtons';
import CheckInHeader from '../../onboarding-v2/components/CheckInHeader';
import { COLORS } from '../../onboarding-v2/constants';

interface ToxicScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  answers: any;
  onValueChanged: ({ key, value }: { key: string; value: any }) => void;
  onCommentChanged: ({ key, userComment }: { key: string; userComment: string }) => void;
  onNext: () => void;
}

export const ToxicScreen: React.FC<ToxicScreenProps> = ({
  navigation,
  currentStep,
  totalSteps,
  answers,
  onValueChanged,
  onCommentChanged,
  onNext,
}) => {
  const questionToxic = {
    id: 'TOXIC',
    label: "Avez-vous consommé des substances aujourd'hui ?",
    explanation: undefined,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
                <CheckInHeader
                  title="Observation du jour"
                  onPrevious={() => navigation.goBack()}
                  onSkip={onNext}
                  showPrevious={true}
                  showSkip={true}
                />
                
                <View className="flex-1 justify-center items-center">
                  {/* <Text 
                    className="text-lg font-bold text-center mb-8"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >Context
                  </Text> */}
      {/* <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1" 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      > */}
        {/* <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-5 bg-white/90 z-50">
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
            Substances
          </Text>
          <View style={{ width: 45 }} />
        </View> */}

        {/* <SurveyProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}

        {/* <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          className="grow"
          contentContainerStyle={{
            paddingTop: 20,
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
        > */}
          <QuestionYesNo
            question={questionToxic}
            onPress={() => {}}
            // selected={answers[questionToxic.id]?.value}
            explanation={questionToxic.explanation}
            isLast={true}
            onChangeUserComment={onCommentChanged}
            // userComment={answers[questionToxic.id]?.userComment}
          />
          </View>
          {/* <View className="h-[1px] bg-neutral-200 mx-5 my-2.5 w-full self-center" />
            <Text style={{
              flex: 1,
              color: '#000',
              fontSize: 14,
              fontWeight: 'normal',
              textAlign: 'center',
              fontFamily: 'Karla',
            }}>
              Retrouvez toutes vos notes dans l'onglet "Mon&nbsp;journal"
            </Text>
        </ScrollView> */}

        {/* <View className={`absolute bottom-0 left-0 right-0 p-4 bg-white z-50 ${Platform.OS === 'android' ? 'pb-4' : 'pb-0'}`}>
          <TouchableOpacity
            onPress={onNext}
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
              Valider
            </Text>
          </TouchableOpacity>
        </View> */}
              <NavigationButtons
                onNext={onNext}
                showPrevious={false}
                // loading={loading}
                nextText="Suivant"
              />
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};
