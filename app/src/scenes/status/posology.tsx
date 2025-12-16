import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import { canEdit } from "./utils/index.js";
import Separator from "@/components/Separator";
import { TW_COLORS, yesNoMapTreatmentIcon } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const Posology = ({ patientState, posology, date, onPress }) => {
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const hasPosology = posology && posology.length > 0 && posology.some((e) => e.value);
  const hasPriseDeTraitement =
    Object.keys(patientState?.PRISE_DE_TRAITEMENT || {})?.length || Object.keys(patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN || {})?.length;

  if (!hasPosology && !hasPriseDeTraitement) return null;

  const renderPosology = () => {
    return (posology || []).map((p, i) => {
      if (!p?.name1 || !p?.value) return null;
      return (
        <View className="flex flex-row items-end flex-1 pr-2.5 py-0" key={i}>
          <View className="items-start h-full pt-1">
            <Icon
              icon="DrugsSvg"
              color={TW_COLORS.CNAM_PRIMARY_800}
              width={12}
              height={12}
              styleContainer={{ marginRight: 5 }}
              spin={false}
              onPress={undefined}
            />
          </View>
          <View className="flex flex-col flex-1 pt-4">
            <View className="flex-row">
              <Text className={mergeClassNames(typography.textXsSemibold, "text-cnam-primary-800 ")}>
                {p.name1} : {p.value}
              </Text>
            </View>
            {p.name2 ? <Text className={mergeClassNames(typography.textXsRegular, "text-gray-800 text-left")}>({p.name2})</Text> : null}
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <Separator separatorColor={TW_COLORS.GRAY_400} />
      <View className="flex justify-between py-2.5">
        <View className="flex flex-row justify-between mb-2">
          <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-900")}>Traitement quotidien</Text>
          <TouchableOpacity
            onPress={() => {
              setDetailsVisible(!detailsVisible);
            }}
          >
            <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Détail</Text>
          </TouchableOpacity>
        </View>
        {patientState?.PRISE_DE_TRAITEMENT?.value !== undefined ? (
          <View className="flex flex-row mb-6 items-center">
            <View className={mergeClassNames("flex flex-row w-8")}>
              {patientState?.PRISE_DE_TRAITEMENT?.value ? (
                <View className={`h-4 w-4 rounded-full`} style={{ backgroundColor: "#CCEDF9", borderColor: "#0084B2", borderWidth: 0.5 }} />
              ) : (
                <View className={`h-4 w-4 rounded-full`} style={{ backgroundColor: "#F9D1E6", borderColor: "#E21D84", borderWidth: 0.5 }} />
              )}
            </View>
            <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-900")}>Prise du traitement : </Text>
            {patientState?.PRISE_DE_TRAITEMENT?.value ? (
              <Text className="text-cnam-primary-800">Oui</Text>
            ) : (
              <Text className="text-cnam-primary-800">Non</Text>
            )}
          </View>
        ) : null}
        {patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN?.value !== undefined ? (
          <View className="flex flex-row mb-6 items-center">
            <View className={mergeClassNames("flex flex-row w-8")}>
              {patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN?.value ? (
                <View className={`h-4 w-4 rounded-full`} style={{ backgroundColor: "#CCEDF9", borderColor: "#0084B2", borderWidth: 0.5 }} />
              ) : (
                <View className={`h-4 w-4 rounded-full`} style={{ backgroundColor: "#F9D1E6", borderColor: "#E21D84", borderWidth: 0.5 }} />
              )}
            </View>
            <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-900")}>Prise d'un "si besoin" : </Text>
            {patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN?.value ? (
              <Text className="text-cnam-primary-800">Oui</Text>
            ) : (
              <Text className="text-cnam-primary-800">Non</Text>
            )}
          </View>
        ) : null}
        {detailsVisible && (
          <>
            <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-900")}>Détail du traitement :</Text>

            <View className={`flex flex-row items-center ${canEdit(date) ? "rounded-[10px]" : ""}`}>
              <View className="flex flex-1 flex-col">{renderPosology()}</View>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default Posology;
