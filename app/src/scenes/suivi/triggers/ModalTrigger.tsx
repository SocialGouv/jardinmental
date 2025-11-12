import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { Indicator } from "@/entities/Indicator";
import { beforeToday, formatDateToFrenchNumericFormat, formatRelativeDate, getArrayOfDatesFromTo } from "@/utils/date/helpers";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import { useBottomSheet } from "@/context/BottomSheetContext";
import CloseCross from "@assets/svg/icon/CloseCross";
import { firstLetterUppercase } from "@/utils/string-util";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { PeriodBottomSheet } from "./PeriodBottomSheet";
import { IndicatorsBottomSheet } from "./IndicatorsBottomSheet";
import { StatesBottomSheet } from "./StateBottomSheet";
import DatePicker from "react-native-date-picker";
import { DiaryEntry } from "@/entities/DiaryData";
import { colorsMap, SCORE_MAP_INFO, scoresMapIcon } from "@/utils/constants";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";

interface ModalTriggerScreenProps {
  navigation: any;
  route?: any;
}

const CircleStateInfo = ({
  selectedIndicator,
  selectedState,
}: {
  selectedIndicator: Indicator;
  selectedState: {
    value: number;
    label: string;
  };
}) => {
  const scoreVisualConfig = SCORE_MAP_INFO[selectedIndicator?.order || "ASC"][selectedState.value];
  return (
    <View
      className="h-6 w-6 rounded-full mr-2 items-center justify-center"
      style={{
        backgroundColor: scoreVisualConfig.color,
      }}
    >
      <Text
        style={{
          color: scoreVisualConfig.iconColor,
        }}
      >
        {scoreVisualConfig.symbol}
      </Text>
    </View>
  );
};

export const ModalTriggerScreen: React.FC<ModalTriggerScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [diaryData] = useContext(DiaryDataContext);
  const [fromDate, setFromDate] = React.useState(route.params.fromDate);
  const [toDate, setToDate] = React.useState(route.params.toDate);
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | undefined>(route.params.selectedIndicator);
  const [selectedState, setSelectedState] = useState<
    | {
        value: number;
        label: string;
      }
    | undefined
  >(route.params.selectedState);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    value: number;
    label: string;
  }>(route.params.selectedPeriod);

  const computeFilteredDiaryData = React.useCallback(() => {
    const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
    if (!selectedIndicator || !selectedState) {
      return null;
    }

    return chartDates
      .map((date) => {
        let infoDate: { date: string; dayData?: DiaryEntry } = { date };
        const dayData = diaryData[date];
        if (!dayData) {
          return null;
        }
        const indicatorState = dayData[selectedIndicator.uuid || selectedIndicator.name];
        if (!indicatorState) {
          return null;
        }

        //   if (indicatorState?._indicateur?.order === "DESC") targetLevel = 6 - _targetLevel;
        let indicatorValue;
        if (indicatorState?._indicateur?.type === "smiley") {
          indicatorValue = indicatorState?.value;
        } else if (indicatorState?._indicateur?.type === "boolean") {
          indicatorValue = indicatorState?.value === true ? 5 : 1;
        } else if (indicatorState?._indicateur?.type === "gauge") {
          indicatorValue = Math.ceil(indicatorState?.value * 5);
        } else {
          indicatorValue = 0;
        }

        if (indicatorValue !== selectedState.value) {
          return null;
        }

        if (Object.keys(dayData).filter((key) => dayData[key].userComment).length === 0) {
          // if there is no user comment, we ignore this item
          return null;
        }

        infoDate = {
          ...infoDate,
          dayData,
        };

        return infoDate;
      })
      .filter((data) => !!data); // we filter fa
  }, [selectedIndicator, selectedState, fromDate, toDate, selectedPeriod, diaryData]);

  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [isSelectModalActive, setIsSelectModalActive] = useState(false);
  useEffect(() => {
    const computeDate = async () => {
      if (selectedPeriod.value !== "custom") {
        let _fromDate;
        let _toDate = beforeToday(0);
        switch (selectedPeriod.value) {
          case "lastDays7":
            _fromDate = beforeToday(7 - 1);
            break;
          case "lastDays14":
            _fromDate = beforeToday(14 - 1);
            break;
          case "lastDays30":
            _fromDate = beforeToday(30 - 1);
            break;
          case "fromBeginning":
            const beginningDate = await AsyncStorage.getItem(STORAGE_KEY_START_DATE);
            _fromDate = new Date(beginningDate);
            break;
        }
        setFromDate(_fromDate);
        setToDate(_toDate);
      }
      computeDate();
    };
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedIndicator && selectedState) {
      let label;

      if (Object.keys(INDICATOR_LABELS).includes(selectedIndicator.uuid)) {
        label = INDICATOR_LABELS[selectedIndicator.uuid][selectedState.value - 1];
      } else {
        label = DEFAULT_INDICATOR_LABELS[selectedState.value - 1];
      }
      setSelectedState({
        value: selectedState.value,
        label,
      });
    }
  }, [selectedIndicator]);

  const onClose = ({ selectedIndicators: _selectedIndicators }: { selectedIndicators: Indicator[] }) => {
    closeBottomSheet();
    if (_selectedIndicators.length) {
      setSelectedIndicator(_selectedIndicators[0]);
    } else {
      setSelectedIndicator(undefined);
    }
  };

  const onCloseStateBottomSheet = ({
    selectedStates: _selectedStates,
  }: {
    selectedStates: {
      value: number;
      label: string;
    }[];
  }) => {
    closeBottomSheet();
    if (_selectedStates.length) {
      setSelectedState(_selectedStates[0]);
    } else {
      setSelectedState(undefined);
    }
  };

  const onClosePeriodBottomSheet = ({
    selectedPeriod: _selectedPeriod,
  }: {
    selectedPeriod: {
      value: string;
      label: string;
    };
  }) => {
    closeBottomSheet();
    setSelectedPeriod(_selectedPeriod);
  };

  const openPeriodBottomSheet = () => {
    showBottomSheet(<PeriodBottomSheet onClose={onClosePeriodBottomSheet} initialSelectedPeriod={selectedPeriod} />);
  };

  const openIndicatorBottomSheet = () => {
    showBottomSheet(<IndicatorsBottomSheet onClose={onClose} initialSelectedIndicators={selectedIndicator ? [selectedIndicator] : undefined} />);
  };

  const openStateBottomSheet = () => {
    if (!selectedIndicator) {
      Alert.alert(`Sélectionnez d'abord un indicateur`);
      return;
    }
    showBottomSheet(
      <StatesBottomSheet
        onClose={onCloseStateBottomSheet}
        indicator={selectedIndicator}
        initialSelectedStates={selectedState ? [selectedState] : undefined}
      />
    );
  };

  const filteredDiaryData = computeFilteredDiaryData();

  return (
    <View className="flex-1 bg-cnam-primary-25">
      <View
        className="bg-cnam-primary-800"
        style={{
          paddingTop: insets.top,
        }}
      >
        <View className="flex-row justify-between top-0 w-full p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Déclencheur</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="w-10 h-10 items-end justify-center mr-2"
          >
            <CloseCross color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredDiaryData}
        bounces={false}
        ListHeaderComponent={
          <View className="mb-4">
            <View className=" bg-cnam-cyan-50-lighten-90 p-4">
              <View className="flex-row justify-between px-2 rounded-2xl items-center">
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>L'indicateur</Text>
                <TouchableOpacity className="flex-row items-center justify-between" onPress={openIndicatorBottomSheet}>
                  <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                    {selectedIndicator?.name || "Sélectionnez un indicateur"}
                  </Text>
                  <View
                    style={{
                      transform: [{ rotate: "180deg" }],
                    }}
                  >
                    <ArrowUpSvg color={colors.BLUE} />
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between px-2 rounded-2xl items-center">
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>était</Text>
                <TouchableOpacity className="flex-row items-center justify-between" onPress={openStateBottomSheet}>
                  {selectedState && <CircleStateInfo selectedIndicator={selectedIndicator} selectedState={selectedState} />}
                  <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                    {selectedState ? selectedState.label : `Sélectionnez un état`}
                  </Text>
                  <View
                    style={{
                      transform: [{ rotate: "180deg" }],
                    }}
                  >
                    <ArrowUpSvg color={colors.BLUE} />
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between px-2 rounded-2xl items-center">
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>sur la période</Text>
                <TouchableOpacity className="flex-row items-center justify-between" onPress={openPeriodBottomSheet}>
                  <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                    {selectedPeriod.value === "custom" ? "Personalisée" : selectedPeriod.label}
                  </Text>
                  <View
                    style={{
                      transform: [{ rotate: "180deg" }],
                    }}
                  >
                    <ArrowUpSvg color={colors.BLUE} />
                  </View>
                </TouchableOpacity>
              </View>
              {selectedPeriod.value === "custom" && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row justify-between items-center px-2 rounded-2xl">
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Période</Text>
                  </View>
                  <View className="flex-row justify-between px-2 rounded-2xl">
                    <TouchableOpacity
                      className="flex-row items-center justify-between mr-4"
                      onPress={() => {
                        if (!isSelectModalActive) {
                          setOpenFromDate(true);
                        }
                      }}
                    >
                      <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Du </Text>
                      <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                        {formatDateToFrenchNumericFormat(fromDate)}
                      </Text>
                      <View
                        style={{
                          transform: [{ rotate: "180deg" }],
                        }}
                      >
                        <ArrowUpSvg color={colors.BLUE} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        if (!isSelectModalActive) {
                          setOpenToDate(true);
                        }
                      }}
                    >
                      <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Au </Text>
                      <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                        {formatDateToFrenchNumericFormat(toDate)}
                      </Text>
                      <View
                        style={{
                          transform: [{ rotate: "180deg" }],
                        }}
                      >
                        <ArrowUpSvg color={colors.BLUE} />
                      </View>
                    </TouchableOpacity>
                    <DatePicker
                      timeZoneOffsetInMinutes={0}
                      locale="fr"
                      title="Du"
                      maximumDate={toDate}
                      androidVariant="iosClone"
                      mode="date"
                      modal
                      open={openFromDate}
                      date={fromDate}
                      confirmText="Valider"
                      onConfirm={(date) => {
                        console.log("date", date);
                        setFromDate(date);
                        setOpenFromDate(false);
                      }}
                      cancelText="Annuler"
                      onCancel={() => {
                        setOpenFromDate(false);
                      }}
                    />
                    <DatePicker
                      timeZoneOffsetInMinutes={0}
                      locale="fr"
                      title="Du"
                      minimumDate={toDate}
                      androidVariant="iosClone"
                      mode="date"
                      modal
                      open={openToDate}
                      date={fromDate}
                      confirmText="Valider"
                      onConfirm={(date) => {
                        console.log("date", date);
                        setToDate(date);
                        setOpenToDate(false);
                      }}
                      cancelText="Annuler"
                      onCancel={() => {
                        setOpenToDate(false);
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
            {!filteredDiaryData?.length && (
              <>
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
                <View style={{ height: 120 }}></View>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View className=" bg-white border-[1px] border-cnam-primary-200 rounded-2xl mb-4 p-4 mx-4">
              <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 mb-4")}>
                {firstLetterUppercase(formatRelativeDate(item.date, true))}
              </Text>
              <View className="flex-col space-y-6">
                {Object.keys(item.dayData || {}).map((key) => {
                  if (item.dayData[key]?.userComment) {
                    return (
                      <View>
                        <Text
                          style={{
                            fontStyle: "italic",
                            fontSize: 14,
                            fontWeight: 400,
                          }}
                          className={mergeClassNames("text-cnam-primary-800 mb-2 italic")}
                        >
                          {key === "CONTEXT" ? "Contexte de la journée" : `Précision sur "${item.dayData[key]._indicateur?.name}"`}
                        </Text>
                        <View className="bg-cnam-cyan-50-lighten-90 px-4 py-2 rounded-xl">
                          <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left")}>
                            {item.dayData[key]?.userComment}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          );
        }}
        className=" flex-col space-y-4 bg-cnam-primary-25"
        showsHorizontalScrollIndicator={false}
      ></FlatList>
      {!filteredDiaryData?.length && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: insets.bottom,
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ gap: 8 }}>
            <JMButton
              variant="outline"
              title={"Retour aux analyses"}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <JMButton
              variant="primary"
              title={"Compléter mes observations"}
              onPress={() => {
                navigation.navigate("tabs");
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};
