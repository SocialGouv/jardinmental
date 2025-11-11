import React, { use, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, FlatList } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { Indicator } from "@/entities/Indicator";
import { beforeToday, formatDate, formatDay, formatRelativeDate, getArrayOfDates, getArrayOfDatesFromTo } from "@/utils/date/helpers";
import { computeIndicatorLabel, getIndicatorKey } from "@/utils/indicatorUtils";
import { IndicatorsBottomSheet } from "@/components/IndicatorsBottomSheet";
import { TW_COLORS } from "@/utils/constants";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import InfoCircle from "@assets/svg/icon/InfoCircle";
import { LineChart } from "react-native-gifted-charts";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useBottomSheet } from "@/context/BottomSheetContext";
import Svg, { Line } from "react-native-svg";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import EyeIcon from "@assets/svg/icon/Eye";
import EyeOffIcon from "@assets/svg/icon/EyeOff";
import { da } from "date-fns/locale";
import { firstLetterUppercase } from "@/utils/string-util";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";

interface ModalTriggerScreenProps {
  navigation: any;
  route?: any;
}

export const ModalTriggerScreen: React.FC<ModalTriggerScreenProps> = ({ navigation, route }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const { fromDate, toDate, selectedPeriod, selectedIndicator, selectedState } = route.params;
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
  const dataToDisplay = false;
  if (!dataToDisplay) {
    return (
      <View className="flex-1 bg-cnam-primary-25">
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Déclencheur</Text>
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>x</Text>
        </View>
        <View className=" bg-cnam-cyan-50-lighten-90 p-4">
          <View className="flex-row justify-between px-2 rounded-2xl">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>L'indicateur</Text>
            <View className="flex-row items-center justify-between">
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>{selectedIndicator?.name}</Text>
            </View>
          </View>
          <View className="flex-row justify-between px-2 rounded-2xl">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>était</Text>
            <View className="flex-row items-center justify-between">
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                {selectedState ? selectedState.label : `Sélectionnez un état`}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between px-2 rounded-2xl">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>sur la période</Text>
            <View className="flex-row items-center justify-between">
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                {selectedPeriod.value === "custom" ? "Personalisée" : selectedPeriod.label}
              </Text>
            </View>
          </View>
        </View>

        {/* <ScrollView className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25" showsHorizontalScrollIndicator={false}> */}
        <View className="mt-32 px-4">
          <View className="absolute z-10 w-full items-center">
            <Image
              style={{ width: 80, height: 80, left: 40, top: -65, resizeMode: "contain" }}
              source={require("../../../../assets/imgs/illustration-no-note.png")}
            />
          </View>
          <View className="absolute -z-1 w-full items-center">
            <View className="bg-cnam-primary-50 h-[150] w-[150] rounded-full" style={{ top: -110 }}></View>
          </View>
          <View className="border border-cnam-primary-200 rounded-2xl p-4 py-6 bg-white" style={{ borderWidth: 0.5 }}>
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4")}>
              Il n'y a pas de note à afficher sur cette période pour :
            </Text>
            <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-950 text-center px-4 mt-4")}>
              {selectedIndicator.name}{" "}
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950 text-center px-4 mt-4")}>est</Text>{" "}
              {selectedState.label}
            </Text>
          </View>
        </View>
        <View className="flex-grow"></View>
        <View className="flex-column space-y-2 mb-6 px-4">
          <JMButton
            variant="outline"
            title={"Retour aux analyses"}
            onPress={() => {
              navigation.goBack();
            }}
          ></JMButton>
          <JMButton
            variant="primary"
            title={"Compléter mes observations"}
            onPress={() => {
              navigation.navigate("tabs");
            }}
          ></JMButton>
        </View>
        {/* </ScrollView> */}
      </View>
    );
  } else {
    return (
      <SafeAreaView className="flex-1 bg-cnam-primary-25">
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Trigger</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex-row items-center justify-end"
          >
            <CrossIcon color={"white"} />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-col pt-4 bg-cnam-primary-25">
          <View className="py-4 pb-6">
            <View className="bg-cnam-primary-25 flex-column space-y-4 px-4">
              <TouchableOpacity className="border border-cnam-primary-700 flex-row h-[48px] rounded-2xl items-center px-4 justify-between">
                <Text className={mergeClassNames(typography.textLgMedium, "text-gray-900")}>
                  Modifier les indicateurs ({selectedIndicators.length})
                </Text>
                <ArrowUpSvg
                  style={{
                    transform: [{ rotateX: "180deg" }],
                  }}
                  color={TW_COLORS.CNAM_PRIMARY_900}
                />
              </TouchableOpacity>
              <View className="border border-cnam-cyan-lighten-80 p-4 rounded-2xl bg-white">
                <View className="bg-cnam-primary-100 w-full h-[36] rounded-full flex-row justify-around">
                  <Animated.View style={[animatedStyle7days]} className="flex-1">
                    <TouchableOpacity
                      onPress={() => handlePeriodChange("7days")}
                      className={mergeClassNames(
                        active === "7days" ? "bg-cnam-primary-300" : "",
                        "flex-1 h-full px-4 rounded-full items-center justify-center"
                      )}
                    >
                      <Text
                        className={mergeClassNames(typography.textSmMedium, active === "7days" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                      >
                        7 jours
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={[animatedStyle1month]} className="flex-1">
                    <TouchableOpacity
                      onPress={() => handlePeriodChange("1month")}
                      className={mergeClassNames(
                        active === "1month" ? "bg-cnam-primary-300" : "",
                        "flex-1 h-full px-4 rounded-full items-center justify-center"
                      )}
                    >
                      <Text
                        className={mergeClassNames(typography.textSmMedium, active === "1month" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                      >
                        1 mois
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={[animatedStyle3months]} className="flex-1">
                    <TouchableOpacity
                      onPress={() => handlePeriodChange("3months")}
                      className={mergeClassNames(
                        active === "3months" ? "bg-cnam-primary-300" : "",
                        "flex-1 h-full px-4 rounded-full items-center justify-center"
                      )}
                    >
                      <Text
                        className={mergeClassNames(typography.textSmMedium, active === "3months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                      >
                        3 mois
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={[animatedStyle6months]} className="flex-1">
                    <TouchableOpacity
                      onPress={() => handlePeriodChange("6months")}
                      className={mergeClassNames(
                        active === "6months" ? "bg-cnam-primary-300" : "",
                        "flex-1 h-full px-4 rounded-full items-center justify-center"
                      )}
                    >
                      <Text
                        className={mergeClassNames(typography.textSmMedium, active === "6months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                      >
                        6 mois
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
                <View className="h-64 w-full">
                  {isVisible && displayItem && displayItem?.date && diaryData[displayItem.date] && (
                    <Animated.View
                      style={[animatedStyle]}
                      className="border border-cnam-primary-300 bg-white rounded-2xl flex-col space-y-2 p-4 mb-4 mt-4"
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className={mergeClassNames(typography.textXsBold, "bg-cnam-primary-800 text-white rounded-lg p-2")}>
                          {firstLetterUppercase(formatDate(displayItem?.date))}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setDisplayItem(null);
                          }}
                        >
                          <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      {displayItem &&
                        selectedIndicators.map((indicator, index) => {
                          let value;
                          try {
                            value = diaryData[displayItem.date][getIndicatorKey(indicator)].value;
                          } catch (e) {}
                          return (
                            <View key={indicator.uuid} className="flex-row items-center space-x-2">
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
                              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                                <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>{indicator.name} : </Text>
                                {computeIndicatorLabel(indicator, value)}
                              </Text>
                            </View>
                          );
                        })}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === true && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <CheckMarkIcon width={15} height={15} color={"#134449"} />
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text>pris
                            </Text>
                          </View>
                        )}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === false && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <CrossIcon color={"#518B9A"} />
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text> pas pris
                            </Text>
                          </View>
                        )}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT_SI_BESOIN"] || {}).value === true && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <View className="w-4 h-4 rounded-full bg-cnam-primary-800"></View>
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Si besoin : </Text> pris
                            </Text>
                          </View>
                        )}

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("detail-Trigger-modal", {
                            selectedIndicators,
                            diaryDataForDate: diaryData[displayItem.date],
                            date: displayItem.date,
                            data: dataToDisplay[0],
                            dataB: dataToDisplay[1],
                            treatment: dataToDisplay[2],
                            treatmentSiBesoin: dataToDisplay[3],
                            diaryData,
                            showTreatment,
                            selectedPointIndex,
                          });
                        }}
                        className="flex-row items-center justify-end"
                      >
                        <EyeIcon />
                        <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-800 ml-2")}>Voir le détail</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
                <View className="bg-cnam-primary-25 p-4 -mt-2 rounded-2xl flex-col space-y-2">
                  <View className="flex-row items-center justify-center space-x-4">
                    {selectedIndicators.map((indicator, index) => (
                      <View key={getIndicatorKey(indicator)}>
                        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>{indicator.name}</Text>
                        <Svg height="2" width="100%">
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
                      </View>
                    ))}
                  </View>
                  {showTreatment && (
                    <View className="flex-row space-x-6 items-center justify-center">
                      <View className="flex-row space-x-2">
                        <View className="flex-row">
                          <CheckMarkIcon width={15} height={15} color={"#134449"} />
                          <Text className="text-cnam-primary-950">/</Text>
                          <CrossIcon color={"#518B9A"} />
                        </View>
                        <Text className="text-primary-900">Traitement</Text>
                      </View>
                      <View className="flex-row items-center justify-center space-x-2">
                        <View className="bg-cnam-primary-950 rounded-full h-4 w-4" />
                        <Text className="text-primary-900">Prise d'un "si besoin"</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View className="bg-cnam-primary-50 p-4">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
              Recherchez des moments où les indicateurs évoluent ensemble ou dans des directions opposées.
            </Text>
          </View>
          <View className="bg-cnam-primary-100 pl-4 pt-4 pb-20">
            <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900 py-4")}>Explorez notre guide</Text>
            <FlatList
              horizontal={true}
              className="mt-4"
              showsHorizontalScrollIndicator={false}
              renderItem={() => (
                <View className="bg-white border border-cnam-primary-400 rounded-2xl w-[297] h-[139] p-4 mr-2 flex-row flex-1">
                  <View
                    className="h-[107] w-[83] rounded-2xl"
                    style={{
                      backgroundColor: "#EAE8E8",
                    }}
                  ></View>
                  <View className="flex-1 ml-2">
                    <Text className={mergeClassNames("text-cnam-primary-950", typography.textMdMedium)}>Pourquoi analyser mes données ?</Text>
                  </View>
                </View>
              )}
              data={[
                {
                  title: "Pourquoi analyser mes données ?",
                },
                {
                  title: "Pourquoi analyser mes données ?",
                },
              ]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};
