import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { formatDate } from "@/utils/date/helpers";
import { computeIndicatorLabel, getIndicatorKey } from "@/utils/indicatorUtils";
import { booleanColor, ColorContextInterface, scoresMapIcon, TW_COLORS } from "@/utils/constants";
import Svg, { Line } from "react-native-svg";
import CrossIcon from "@assets/svg/icon/Cross";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import TestChart from "./CorrelationChart";
import { firstLetterUppercase } from "@/utils/string-util";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import { mapIconToSvg } from "@/components/CircledIcon";
import CheckMarkIcon from "@assets/svg/icon/check";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import { Typography } from "@/components/Typography";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const computeIndicatorColor = (indicator, value): ColorContextInterface | undefined => {
  if (value === null) return;
  if (indicator.type === INDICATOR_TYPE.boolean) {
    return booleanColor[indicator.order][value];
  }
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) + 1 : value;

  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && (indicator.type === INDICATOR_TYPE.smiley || indicator.type === INDICATOR_TYPE.gauge)) {
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
    oneBoolean,
    twoBoolean,
    booleanIndicatorIndex,
  } = route.params;

  const [definedTreatment, setDefinedTreatment] = useState<any[] | undefined>();

  useEffect(
    useCallback(() => {
      (async () => {
        const _treatment = await localStorage.getMedicalTreatment();
        if (_treatment) {
          setDefinedTreatment(_treatment);
        }
      })();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
      <View className="flex-col justify-between w-full bg-cnam-primary-800 p-4 items-center">
        <View className="flex-row w-full justify-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex-row items-center justify-end w-10 h-10"
          >
            <CrossIcon color={"white"} width={25} height={25} strokeWidth={1.2} />
          </TouchableOpacity>
        </View>
        <View className="flex-row h-[66] w-full justify-between items-center">
          <Typography className={mergeClassNames(typography.displayXsBold, "text-white")}>{firstLetterUppercase(formatDate(date, true))}</Typography>
        </View>
        <View className="bg-white/10 rounded-2xl p-4 w-full">
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
                      strokeDasharray={index === 0 ? "" : "4 4"} // pattern: 4px dash, 4px gap
                    />
                  </Svg>
                  <Typography key={indicator.uuid} className={mergeClassNames(typography.textMdMedium, "text-white ")}>
                    <Typography className={mergeClassNames(typography.textMdSemibold, "text-white")}>{indicator.name} : </Typography>
                    {computeIndicatorLabel(indicator, value) || "Pas de donnée"}
                  </Typography>
                </View>
              );
            })}
          {typeof diaryDataForDate["PRISE_DE_TRAITEMENT"]?.value === "boolean" && (
            <View className="flex-row items-center space-x-2">
              <View className="w-[30] items-center justify-center">
                {typeof diaryDataForDate["PRISE_DE_TRAITEMENT"].value ? (
                  <CheckMarkIcon width={15} height={15} color={"white"} />
                ) : (
                  <CrossIcon color={"white"} />
                )}
              </View>
              <Typography className={mergeClassNames(typography.textMdMedium, "text-white ")}>
                <Typography className={mergeClassNames(typography.textMdSemibold, "text-white")}>Traitement : </Typography>
                {diaryDataForDate["PRISE_DE_TRAITEMENT"]?.value ? "Oui" : "Non"}
              </Typography>
            </View>
          )}
          {diaryDataForDate["PRISE_DE_TRAITEMENT_SI_BESOIN"]?.value === true && (
            <View className="flex-row items-center space-x-2">
              <View className="w-[30] items-center">
                <View className="w-2 h-2 bg-cnam-primary-950 rounded-full"></View>
              </View>
              <Typography className={mergeClassNames(typography.textMdMedium, "text-white ")}>
                <Typography className={mergeClassNames(typography.textMdSemibold, "text-white")}>Prise d'un "si besoin" : </Typography>
                {"Oui"}
              </Typography>
            </View>
          )}
        </View>
      </View>
      <ScrollView
        className="flex-col pt-4 bg-cnam-primary-25 px-4"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <View className="p-4">
          <View style={{ paddingTop: 10, paddingBottom: 0 }}>
            <TestChart
              // displayItem={displayItem}
              data={data.map((d, index) => ({
                ...d,
                hideDataPoint: index !== selectedPointIndex,
              }))}
              dataB={
                dataB &&
                dataB.map((d, index) => ({
                  ...d,
                  hideDataPoint: index !== selectedPointIndex,
                }))
              }
              spacingFormat={"7days"}
              treatment={treatment}
              initialSelectedPointIndex={selectedPointIndex}
              navigation={navigation}
              oneBoolean={oneBoolean}
              twoBoolean={twoBoolean}
              selectedIndicators={selectedIndicators}
              treatmentSiBesoin={treatmentSiBesoin}
              diaryData={diaryData}
              openIndicatorBottomSheet={undefined}
              showTreatment={definedTreatment}
              displayfixed={true}
              enablePagination={false}
              booleanIndicatorIndex={booleanIndicatorIndex}
            />
          </View>
        </View>
        <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900 pt-6 pb-4")}>Ce jour là :</Typography>
        <View className="flex-col space-y-3">
          {Object.keys(diaryDataForDate).map((key) => {
            if (diaryDataForDate[key]?._indicateur) {
              const indicator = diaryDataForDate[key]._indicateur;
              const colors = computeIndicatorColor(indicator, diaryDataForDate[key].value);
              const data = diaryDataForDate[key];
              return <ItemStatus key={key} data={data} colors={colors} indicator={indicator} />;
            } else return;
          })}
        </View>
        {diaryDataForDate.CONTEXT && (
          <View className="justify-between items-start bg-cnam-primary-50 rounded-xl p-2 my-2">
            <Typography className={mergeClassNames(typography.textSmSemibold, "mb-1 text-cnam-primary-900")}>Note générale</Typography>
            <View className="w-full flex-row items-center items-start">
              <Typography
                className={mergeClassNames("flex-1", typography.textSmRegular, "text-cnam-gray-950 italic")}
                style={{
                  fontSize: 14,
                  fontFamily: "SourceSans3-Italic",
                  fontWeight: "500",
                  fontStyle: "italic",
                  color: TW_COLORS.GRAY_950,
                }}
              >
                {diaryDataForDate.CONTEXT.userComment || "Oui"}
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ItemStatus = ({ indicator, colors, data }) => {
  const Icon = mapIconToSvg(colors?.faceIcon);
  const [visible, setIsVisible] = useState<boolean>(false);

  return (
    <View className="py-2">
      <TouchableOpacity
        disabled={!data.userComment}
        onPress={() => {
          setIsVisible(!visible);
        }}
        className="flex-row items-center space-x-4"
      >
        {indicator.type === "smiley" ? (
          <View
            className="h-5 w-5 rounded-full"
            style={{
              backgroundColor: colors?.color,
              borderColor: colors?.borderColor,
            }}
          >
            <Icon width={23} height={23} color={colors?.iconColor} />
          </View>
        ) : (
          <View
            className="h-5 w-5 rounded-full"
            style={{
              backgroundColor: colors?.color,
              borderColor: colors?.borderColor,
              borderWidth: 1,
            }}
          />
        )}
        <View className="flex-row flex-1">
          <View className="flex-1 flex-row items-start">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
              <Typography className={mergeClassNames(typography.textMdBold, "text-cnam-primary-900")}>{data?._indicateur?.name} : </Typography>
              {computeIndicatorLabel(data._indicateur, data.value) || "Pas de donnée"}
            </Typography>
          </View>
          {data.userComment && (
            <View
              style={{
                transform: [
                  {
                    rotate: visible ? "0deg" : "180deg",
                  },
                ],
              }}
            >
              <ArrowUpSvg width={20} height={20} color={TW_COLORS.CNAM_PRIMARY_900} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      {visible && (
        <Typography className={mergeClassNames(typography.textXsRegular, "text-left", "text-gray-700 ml-9")}>{data.userComment}</Typography>
      )}
    </View>
  );
};
