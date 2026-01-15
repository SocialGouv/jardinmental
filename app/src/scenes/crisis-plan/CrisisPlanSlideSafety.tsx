import React, { useEffect, useState } from "react";
import { CrisisPlanSlideComponent } from "./CrisisPlanSlideComponent";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const suggestions = [
  "Faire venir un proche chez moi",
  "Aller dans un lieu public",
  "M’écarter de ce qui est dangereux",
  "Mettre les objets dangereux dans un endroit fermé à clé",
  "Donner les objets dangereux à un proche",
];

const label = "Renseignez un élément pour assurer votre sécurité";
const placeholder = " Ex: Aller dans un lieu public";
const STORAGE_KEY = "@CRISIS_PLAN_SAFETY";

export const CrisisPlanSlideSafety: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  return (
    <CrisisPlanSlideComponent
      slideIndex={6}
      title={"Comment assurer votre sécurité ou sécuriser votre environnement ?"}
      navigation={navigation}
      suggestions={suggestions}
      label={label}
      labelBottomSheet={"Choisissez parmi les exemples"}
      headerBottomSheet={"Élément pour assurer votre sécurité"}
      headerEditionBottomSheet={"Sécurité"}
      placeholder={placeholder}
      storageKey={STORAGE_KEY}
      route={route}
      next={"crisis-plan-slide-reason-to-live"}
    />
  );
};
