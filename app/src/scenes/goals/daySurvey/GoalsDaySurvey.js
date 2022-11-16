import { View } from "react-native";
import { HintButton } from "../../../components/HintButton";

export const GoalsDaySurvey = ({}) => {
  return (
    <View>
      <HintButton
        title="Personnaliser mes objectifs"
        subtitle="Vous pouvez gérez vos objectifs et en créer de nouveaux"
      />
    </View>
  );
};
