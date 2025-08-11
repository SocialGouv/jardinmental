import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { InfoButton, InfoText, useInfoModal } from "../../../components/InfoModal";
import { FriseGraphExample } from "./FriseGraphExample";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import logEvents from "../../../services/logEvents";
import JMButton from "@/components/JMButton";
import Icon from "@/components/Icon";

export const FriseInfoButton = forwardRef(({ navigation, hasTreatment, ...props }, ref) => {
  const infoButtonRef = useRef();
  const infoModal = useInfoModal();

  useImperativeHandle(ref, () => {
    return {
      press: () => infoButtonRef?.current?.press?.(),
    };
  });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const viewHint = await AsyncStorage.getItem("@AT_LEAST_VIEW_ONE_TIME_HINT_FRISE");
        if (viewHint !== "true") {
          await infoButtonRef?.current?.press?.();
        }
      })();
    }, [infoModal])
  );

  const showInfoModal = async ({ position }) => {
    await AsyncStorage.setItem("@AT_LEAST_VIEW_ONE_TIME_HINT_FRISE", "true");
    infoModal.show({
      position,
      onClose: () => {
        logEvents.logSuiviShowLegendeInformationPriseDeTraitement(0);
      },
      content: (
        <>
          <InfoText title>Suivez votre évolution grâce aux frises</InfoText>
          <InfoText>Sélectionnez la période qui vous intéresse, ou définissez vous-même les dates de votre choix.</InfoText>
          <InfoText title>Faites des corrélations entre vos indicateurs</InfoText>
          <InfoText>
            Comprenez quels indicateurs évoluent ensemble en les comparant. Utilisez les filtres d’intensité (par exemple uniquement les smileys
            rouges) pour mieux visualiser les corrélations.
          </InfoText>
          {hasTreatment ? (
            <InfoText title>Corrélez la prise de votre traitement avec vos frises grâce au filtre</InfoText>
          ) : (
            <InfoText title>Ajouter un traitement à votre suivi pour corréler la prise de celui-ci avec vos frises</InfoText>
          )}
          <FriseGraphExample hasTreatment={hasTreatment} />
          {!hasTreatment && (
            <JMButton
              title="Ajouter votre traitement"
              className={"mt-10"}
              onPress={() => {
                navigation.navigate("drugs");
                infoModal.hide();
              }}
              icon={<Icon icon={"PlusSvg"} />}
            />
          )}
        </>
      ),
    });
    logEvents.logSuiviShowLegendeInformationPriseDeTraitement(1);
  };

  return <InfoButton ref={infoButtonRef} onPress={showInfoModal} {...props} />;
});
