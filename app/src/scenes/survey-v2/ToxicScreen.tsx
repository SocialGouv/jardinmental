import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionYesNo from "../survey/QuestionYesNo";
import NavigationButtons from "../../components/onboarding/NavigationButtons";
import CheckInHeader from "../../components/onboarding/CheckInHeader";
import BannerHeader from "../onboarding-v2/BannerHeader";

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
    id: "TOXIC",
    label: "Avez-vous consommé des substances aujourd'hui ?",
    explanation: undefined,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <CheckInHeader
        title="Observation du jour"
        onPrevious={() => navigation.goBack()}
        onSkip={onNext}
        showPrevious={true}
        showSkip={true}
      /> */}
      <BannerHeader
        headerTitle="Observation du jour"
        header={undefined}
        title={"Substances"}
        handlePrevious={() => navigation.goBack()}
        handleSkip={onNext}
      ></BannerHeader>
      <View className="flex-1 justify-center items-center p-4">
        <QuestionYesNo
          question={questionToxic}
          onPress={onValueChanged}
          selected={answers[questionToxic.id]?.value}
          explanation={questionToxic.explanation}
          isLast={true}
          onChangeUserComment={onCommentChanged}
          userComment={answers[questionToxic.id]?.userComment}
        />
      </View>
      <NavigationButtons
        onNext={onNext}
        showPrevious={false}
        //onPrevious={() => navigation.goBack()}
        // loading={loading}
        nextText="Suivant"
      />
    </SafeAreaView>
  );
};
