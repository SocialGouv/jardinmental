import React, { useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputLabel } from "../../../components/InputLabel";
import { InputText } from "../../../components/InputText";
import { Screen } from "../../../components/Screen";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import NavigationButtons from "@/components/onboarding/NavigationButtons";

export const GoalsCreateForm = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [goalName, setGoalName] = useState("");

  const onValidate = async () => {
    if (loading) return;
    navigation.navigate("goal-day-selector", { editing: false, goalLabel: goalName });
  };

  return (
    <AnimatedHeaderScrollScreen
      title={"Créer un objectif"}
      handlePrevious={() => {
        navigation.goBack();
      }}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <JMButton title="Valider" className="my-2" onPress={onValidate} disabled={!(goalName?.length > 0)} loading={loading} />
        </NavigationButtons>
      }
      navigation={navigation}
    >
      <View className="mx-4">
        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 my-8")}>
          Comment souhaitez-vous appeler votre nouvel objectif ?
        </Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Nom de votre objectif*</Text>
        <InputText
          fill
          placeholder="Entrez le nom de votre objectif"
          containerStyle={styles.spacing}
          autoFocus
          value={goalName}
          onChangeText={setGoalName}
        />
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
});
