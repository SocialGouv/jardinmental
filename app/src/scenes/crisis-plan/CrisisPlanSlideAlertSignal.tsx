import React from "react";
import { CrisisPlanSlideComponent } from "./CrisisPlanSlideComponent";

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params?: {
      initialRouteName: string;
      isEdit: boolean;
    };
  };
}

const suggestions = [
  "Je rumine",
  "Je culpabilise",
  "Je pleure",
  "Je m'agite",
  "Je me sens désespéré.e",
  "Je me sens inutile",
  "Je ressens de la colère",
  "Je me sens irritable",
  "Je ressens une tension intérieure",
  "Je me replie sur moi",
  "Je bois de l’alcool",
  "Je consomme des drogues",
  "Mon sommeil est perturbé",
  "Mon alimentation est perturbée",
  "Je me fais du mal",
];

const label = "Renseignez un signe d’alerte :";
const placeholder = "Ex. sommeil réduit, isolement...";
const STORAGE_KEY = "@CRISIS_PLAN_ALERT";

export const CrisisPlanSlideAlert: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <CrisisPlanSlideComponent
      title={"Quels signes d’alertes sont annonciateurs d’idées suicidaires pour vous ?"}
      navigation={navigation}
      suggestions={suggestions}
      label={label}
      placeholder={placeholder}
      storageKey={STORAGE_KEY}
      next={"crisis-plan-slide-activities"}
      headerEditionBottomSheet={"Édition du signal d'alerte"}
      labelBottomSheet={"Choisissez parmi les suggestions - Signaux d’alerte"}
      headerBottomSheet={"Alertes"}
      route={route}
    />
  );
};
