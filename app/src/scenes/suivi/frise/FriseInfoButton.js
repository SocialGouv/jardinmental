import React from "react";
import { InfoButton, InfoText, useInfoModal } from "../../../components/InfoModal";

export const FriseInfoButton = ({}) => {
  const infoModal = useInfoModal();

  const showInfoModal = () => {
    infoModal.show({
      content: (
        <>
          <InfoText title>Suivez votre évolution grâce aux frises</InfoText>
          <InfoText>
            Sélectionnez la période qui vous intéresse, ou définissez vous-même les dates de votre choix.
          </InfoText>
          <InfoText title>Faites des corrélations entre vos indicateurs</InfoText>
          <InfoText>
            Comprenez quels indicateurs évoluent ensemble en les comparant. Utilisez les filtres d’intensité
            (par exemple uniquement les smileys rouges) pour mieux visualiser les corrélations.
          </InfoText>
        </>
      ),
    });
  };

  return <InfoButton onPress={showInfoModal} />;
};
