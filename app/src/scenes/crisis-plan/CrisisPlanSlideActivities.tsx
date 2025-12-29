import React from "react";
import { CrisisPlanSlideComponent } from "./CrisisPlanSlideComponent";

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params: {
      isEdit: boolean;
      initialRouteName: string;
    };
  };
}

const suggestions = [
  "Écouter de la musique",
  "Regarder des vidéos",
  "Regarder des photos",
  "Faire de la relaxation",
  "Faire de la méditation",
  "Me promener",
];

const label = "Renseignez une activité";
const placeholder = " Ex: marcher 5 min, respirer...";
const STORAGE_KEY = "@CRISIS_PLAN_ACTIVITIES";
const NEXT_SCREEN = "";

export const CrisisPlanSlideActivities: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <CrisisPlanSlideComponent
      title={"Que pouvez-vous faire seul.e pour mettre à distance les idées suicidaires ?"}
      navigation={navigation}
      suggestions={suggestions}
      label={label}
      placeholder={placeholder}
      storageKey={STORAGE_KEY}
      next={"crisis-plan-slide-contact"}
      headerEditionBottomSheet={"Édition de l'activité"}
      labelBottomSheet={"Choisissez parmi les suggestions - Activités pour écarter les idées suicidaires (exemples)"}
      headerBottomSheet={"Activités"}
      route={route}
    />
  );
};
