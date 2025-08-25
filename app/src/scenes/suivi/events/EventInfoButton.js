import React from "react";
import { InfoButton, InfoText, useInfoModal } from "../../../components/InfoModal";

export const EventInfoButton = ({ ...props }) => {
  const infoModal = useInfoModal();

  const showInfoModal = async ({ position }) => {
    infoModal.show({
      position,
      onClose: () => {
        //logEvents.logSuiviShowLegendeInformationPriseDeTraitement(0);
      },
      content: (
        <>
          <InfoText title>Comprenez ce qui influe sur votre état de santé mentale</InfoText>
          <InfoText>
            Sélectionnez un indicateur et son intensité pour retrouver toutes vos prises de notes personnelles qui sont associées à cet état.
          </InfoText>
          <InfoText>
            Par exemple, si vous sélectionnez l'indicateur "anxiété" et le smiley "rouge", vous retrouverez toutes les notes que vous avez prises les
            jours où vous étiez anxieux.
            {"\n"}A l'inverse, sélectionnez "humeur générale" et le smiley vert pour comprendre ce qui vous met de bonne humeur !
          </InfoText>
          <InfoText>
            Prendre régulièrement des notes sur votre journée et les relire vous aide à comprendre ce qui influe sur votre état de santé mentale
          </InfoText>
        </>
      ),
    });
    //logEvents.logSuiviShowLegendeInformationPriseDeTraitement(1);
  };

  return <InfoButton onPress={showInfoModal} {...props} />;
};
