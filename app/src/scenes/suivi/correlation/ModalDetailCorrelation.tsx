import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { formatDate } from "@/utils/date/helpers";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { booleanColor, ColorContextInterface, scoresMapIcon } from "@/utils/constants";
import Svg, { Line } from "react-native-svg";
import CrossIcon from "@assets/svg/icon/Cross";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import TestChart from "./CorrelationChart";
import { firstLetterUppercase } from "@/utils/string-util";
import { SafeAreaView } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const computeIndicatorLabel = (indicator, value): string => {
  if (value === null) return "";
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) : value;
  if (indicator.type === INDICATOR_TYPE.boolean) {
    return { true: "Oui", false: "Non" }[value];
  }
  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }

  if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
    return INDICATOR_LABELS[indicator.uuid][index - 1];
  } else {
    return DEFAULT_INDICATOR_LABELS[index - 1];
  }
};

const computeIndicatorColor = (indicator, value): ColorContextInterface | undefined => {
  if (value === null) return;
  if (indicator.type === INDICATOR_TYPE.boolean) {
    return booleanColor[indicator.order][value];
  }
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) : value;

  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }
  return scoresMapIcon[index];
};

export const DetailModalCorrelationScreen: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const {
    selectedIndicators,
    displayItem,
    data,
    dataB,
    treatment,
    treatmentSiBesoin,
    showTreatment,
    selectedPointIndex,
    diaryDataForDate,
    date,
    diaryData,
  } = route.params;
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
      <View className="flex-col justify-between w-full bg-cnam-primary-800 p-4 items-center">
        <View className="flex-row w-full justify-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex-row items-center justify-end"
          >
            <CrossIcon color={"white"} />
          </TouchableOpacity>
        </View>
        <View className="flex-row h-[96] w-full justify-between items-center">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>{firstLetterUppercase(formatDate(date, true))}</Text>
        </View>
        <View className="bg-white/5 rounded-2xl p-4 w-full">
          {diaryDataForDate &&
            selectedIndicators.map((indicator, index) => {
              let value;
              try {
                value = diaryDataForDate[getIndicatorKey(indicator)].value;
              } catch (e) {}
              return (
                <View key={index} className="flex-row items-center space-x-2">
                  <Svg height="2" width="30">
                    <Line
                      x1="0"
                      y1="1"
                      x2="100%"
                      y2="1"
                      stroke={index === 0 ? "#00A5DF" : "#3D6874"} // your color
                      strokeWidth="2"
                      // strokeDasharray={index === 0 ? [] : ["4,4"]} // pattern: 4px dash, 4px gap
                    />
                  </Svg>
                  <Text key={indicator.uuid} className={mergeClassNames(typography.textMdMedium, "text-white ")}>
                    <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>{indicator.name} : </Text>
                    {computeIndicatorLabel(indicator, value) || "Pas de donnée"}
                  </Text>
                </View>
              );
            })}
          <View className="flex-row items-center space-x-2">
            <View className="w-[30] items-center justify-center">
              <CrossIcon color={"white"} />
            </View>
            <Text className={mergeClassNames(typography.textMdMedium, "text-white ")}>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>Traitement : </Text>
              {diaryDataForDate["PRISE_DE_TRAITEMENT"] ? "Pris correctement" : "Non"}
            </Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-[30] items-center">
              <View className="w-[15] h-[15] bg-cnam-primary-950 rounded-full"></View>
            </View>
            <Text className={mergeClassNames(typography.textMdMedium, "text-white ")}>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>Prise d'un "si besoin" : </Text>
              {diaryDataForDate["PRISE_DE_TRAITEMENT_SI_BESOIN"] ? "Pris correctement" : "Non"}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-col pt-4 bg-cnam-primary-25 px-4" showsHorizontalScrollIndicator={false}>
        <View className="p-4">
          <View style={{ paddingTop: 10, paddingBottom: 50 }}>
            <TestChart
              // displayItem={displayItem}
              data={data}
              dataB={dataB}
              spacingFormat={"7days"}
              treatment={treatment}
              initialSelectedPointIndex={selectedPointIndex}
              navigation={navigation}
              selectedIndicators={selectedIndicators}
              treatmentSiBesoin={treatmentSiBesoin}
              diaryData={diaryData}
              openIndicatorBottomSheet={undefined}
              showTreatment={true}
              displayfixed={true}
              enablePagination={false}
            />
          </View>
        </View>
        <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900 pt-6 pb-4")}>Ce jours là :</Text>
        {Object.keys(diaryDataForDate).map((key) => {
          if (diaryDataForDate[key]?._indicateur) {
            const colors = computeIndicatorColor(diaryDataForDate[key]._indicateur, diaryDataForDate[key].value);
            return (
              <View key={key} className="flex-row items-center space-x-2">
                <View
                  className="h-5 w-5 rounded-full"
                  style={{
                    backgroundColor: colors?.color,
                    borderColor: colors?.borderColor,
                    borderWidth: 1,
                  }}
                ></View>
                <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900")}>
                  <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-900")}>
                    {diaryDataForDate[key]?._indicateur?.name}:{" "}
                  </Text>
                  {computeIndicatorLabel(diaryDataForDate[key]._indicateur, diaryDataForDate[key].value) || "Pas de donnée"}
                </Text>
              </View>
            );
          } else return;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
