import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { isToday, isYesterday, parseISO } from "date-fns";
import { getArrayOfDatesFromTo, formatDay, formatRelativeDate, beforeToday } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import Card from "./Card";
import JMButton from "@/components/JMButton";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { analyzeScoresMapIcon, STORAGE_KEY_START_DATE, TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import Animated from "react-native-reanimated";
import CircledIcon from "@/components/CircledIcon";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { IndicatorsBottomSheet } from "./IndicatorsBottomSheet";
import { Indicator } from "@/entities/Indicator";
import { StatesBottomSheet } from "./StateBottomSheet";
import { PeriodBottomSheet } from "./PeriodBottomSheet";
import DatePicker from "react-native-date-picker";
import DateOrTimeDisplay, { LightDateOrTimeDisplay } from "../DateOrTimeDisplay";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;

const Events = ({
  navigation,
  presetDate,
  setPresetDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onScroll,
  scrollY,
  indicateur,
  setIndicateur,
  indicateurId,
  setIndicateurId,
  level,
  setLevel,
  userIndicateurs,
  setUserIndicateurs,
  dynamicPaddingTop,
}) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState();
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
  const [event, setEvent] = React.useState("ALL");
  const insets = useSafeAreaInsets();
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<
    | {
        value: number;
        label: string;
      }
    | undefined
  >(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    value: number;
    label: string;
  }>({
    value: "lastDays7",
    label: "7 derniers jours",
  });

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

  // React.useEffect(() => {
  //   console.log("✍️ ~ indicateur", indicateur);
  // }, getIndicatorKey);

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

  const memoizedCallback = React.useCallback(() => {
    if (!indicateur) return [];
    if (!indicateurId) return [];
    // console.log("SYMPTOME", indicateur);
    if (!level || !level.length) return [];
    let _targetLevel = level[0];
    // console.log("level", level);
    if (!event) return [];
    // console.log("event", event);
    return chartDates.map((date) => {
      let infoDate = { date };
      // console.log("✍️ ~ date", date);
      const dayData = diaryData[date];
      if (!dayData) {
        // console.log("no dayData");
        return {};
      }
      const categoryState = diaryData[date][indicateurId];

      // console.log("✍️ ~ categoryState", categoryState);
      if (!categoryState) {
        // console.log("categoryState");
        return {};
      }

      let targetLevel = _targetLevel;
      if (diaryData[date][indicateurId]?._indicateur?.order === "DESC") targetLevel = 6 - _targetLevel;
      let _value;
      if (diaryData[date][indicateurId]?._indicateur?.type === "smiley") {
        _value = diaryData[date][indicateurId]?.value;
      } else if (diaryData[date][indicateurId]?._indicateur?.type === "boolean") {
        _value = diaryData[date][indicateurId]?.value === true ? 5 : 1;
      } else if (diaryData[date][indicateurId]?._indicateur?.type === "gauge") {
        _value = Math.ceil(diaryData[date][indicateurId]?.value * 5);
      } else {
        _value = 0;
      }

      if (_value !== targetLevel) {
        return {};
      }

      // { label: "Tous les évènement", value: "ALL" },
      // { label: "Contexte de la journée", value: "CONTEXT" },
      // { label: "Précisions élément", value: "USER_COMMENT" },
      // { label: "Traitements", value: "POSOLOGY" },
      // { label: "Substances", value: "TOXIC" },

      if (dayData?.CONTEXT?.userComment) infoDate = { ...infoDate, CONTEXT: dayData?.CONTEXT?.userComment };
      if (categoryState?.userComment) infoDate = { ...infoDate, USER_COMMENT: categoryState?.userComment };

      // console.log("✍️ ~ infoDate", infoDate);

      return infoDate;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      // const [categoryName, suffix] = indicateur.split("_");
      // let categoryStateIntensity = null;
      // if (suffix && suffix === "FREQUENCE") {
      //   // if it's one category with the suffix 'FREQUENCE' :
      //   // add the intensity (default level is 3 - for the frequence 'never')
      //   categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
      //   return { value: categoryState.level + categoryStateIntensity.level - 2 };
      // }
      // return { value: categoryState.level - 1 };
    });
  }, [indicateur, indicateurId, level, event, chartDates, diaryData]);

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents._deprecatedLogFeelingStart();

    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_beck",
      });
    }
  };

  const renderDate = (d) => {
    if (isYesterday(parseISO(d))) return "hier";
    if (isToday(parseISO(d))) return "aujourd'hui";
    let relativeDate = formatRelativeDate(d);
    return `le ${relativeDate}`;
  };

  const openPeriodBottomSheet = () => {
    showBottomSheet(<PeriodBottomSheet onClose={onClosePeriodBottomSheet} initialSelectedPeriod={selectedPeriod} />);
  };

  const openIndicatorBottomSheet = () => {
    showBottomSheet(<IndicatorsBottomSheet onClose={onClose} initialSelectedIndicators={selectedIndicator ? [selectedIndicator] : undefined} />);
  };

  const openStateBottomSheet = () => {
    showBottomSheet(
      <StatesBottomSheet
        onClose={onCloseStateBottomSheet}
        indicator={selectedIndicator}
        initialSelectedStates={selectedState ? [selectedState] : undefined}
      />
    );
  };

  // if (isEmpty) {
  //   return (
  //     <View
  //       style={[
  //         styles.emptyContainer,
  //         {
  //           paddingTop: 180 + dynamicPaddingTop,
  //           flex: 1,
  //           backgroundColor: "red",
  //         },
  //       ]}
  //     >
  //       <View style={styles.subtitleContainer}>
  //         <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
  //         <Text style={styles.subtitle}>
  //           Des <Text style={styles.bold}>Évènements</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
  //         </Text>
  //       </View>
  //       <JMButton title="Commencer à saisir" onPress={startSurvey} />
  //     </View>
  //   );
  // }
  // return (
  //   <>
  //     <Animated.ScrollView
  //       style={styles.scrollView}
  //       contentContainerStyle={[
  //         styles.scrollContainer,
  //         {
  //           paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
  //           paddingTop: 180 + dynamicPaddingTop,
  //         },
  //       ]}
  //       showsVerticalScrollIndicator={false}
  //       scrollEventThrottle={16}
  //       onScroll={onScroll}
  //     >
  //       <View className="mx-4 border-t border-cnam-primary-300 pt-4 mt-4">
  //         {level && memoizedCallback()?.filter((x) => x.date)?.length === 0 && (
  //           <View className="pt-36">
  //             <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>
  //               Aucun évènement à afficher entre {renderDate(formatDay(fromDate))} et {renderDate(formatDay(toDate))} pour :
  //             </Text>
  //             <View className="flex-row flex-wrap items-center">
  //               <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>
  //                 <Text className="font-bold">{indicateur}</Text> et{" "}
  //               </Text>
  //               <View
  //                 className="w-7 h-7 rounded-full items-center justify-center"
  //                 style={{
  //                   backgroundColor: analyzeScoresMapIcon[level].color,
  //                 }}
  //               >
  //                 <Text
  //                   className={mergeClassNames(typography.textSmSemibold)}
  //                   style={{
  //                     color: analyzeScoresMapIcon[level].iconColor,
  //                   }}
  //                 >
  //                   {analyzeScoresMapIcon[level].symbol}
  //                 </Text>
  //               </View>
  //             </View>
  //           </View>
  //         )}
  //         {!level && (
  //           <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Sélectionnez une valeur dans le filtre "Était"</Text>
  //         )}
  //         {memoizedCallback()
  //           ?.filter((x) => x.date)
  //           ?.sort((a, b) => {
  //             const ad = a.date.split("/").reverse().join("");
  //             const bd = b.date.split("/").reverse().join("");
  //             return bd.localeCompare(ad);
  //           })
  //           ?.map((d) => {
  //             return <Card key={d.date} event={event} date={d.date} context={d.CONTEXT} userComment={d.USER_COMMENT} />;
  //           })}
  //       </View>
  //     </Animated.ScrollView>
  //   </>
  // );
  return (
    <View className="flex-1 pt-60 px-4 bg-white">
      <View className="flex-row justify-between items-center">
        <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>Identifiez ce qui influence votre état</Text>
        <TouchableOpacity onPress={() => {}} className="bg-cnam-primary-100 p-2 rounded-full mr-2">
          <CircleQuestionMark color={TW_COLORS.CNAM_PRIMARY_800} />
        </TouchableOpacity>
      </View>
      <View className="flex-row mt-4">
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
          Identifiez ce qui déclenche vos variations d’état en explorant les notes laissées sur vos observations.
        </Text>
      </View>
      <View className="border-[1px] border-cnam-primary-500 bg-cnam-cyan-50-lighten-90 p-4 rounded-2xl mt-10">
        <View className="flex-row px-2 mb-4">
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Voir mes notes quand :</Text>
        </View>
        <View className="flex-row justify-between px-2 rounded-2xl">
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
        <View className="flex-row justify-between px-2 rounded-2xl">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>était</Text>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={openStateBottomSheet}>
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
        <View className="flex-row justify-between px-2 rounded-2xl">
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
          <View className="flex-row justify-between px-2 rounded-2xl">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Période</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => {
                if (!isSelectModalActive) {
                  setOpenFromDate(true);
                }
              }}
            >
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Du</Text>
              <LightDateOrTimeDisplay
                mode="date"
                date={fromDate}
                onPress={() => {
                  // Prevent DatePicker from opening if SelectInput modal is still active
                }}
                disabled={false}
                // {...dateOrTimeProps}
              />
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
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Au</Text>
              <LightDateOrTimeDisplay
                mode="date"
                date={toDate}
                onPress={() => {
                  // Prevent DatePicker from opening if SelectInput modal is still active
                  // if (!isSelectModalActive) {
                  //   setOpenToDate(true);
                  // }
                }}
                disabled={false}
                // {...dateOrTimeProps}
              />
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
              // maximumDate={toDate}
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
        )}
        <JMButton
          onPress={() => {
            navigation.navigate("trigger-modal", {
              selectedIndicator,
              selectedPeriod,
              fromDate,
              toDate,
              selectedState,
            });
          }}
          disabled={!(selectedIndicator && selectedState && selectedPeriod)}
          variant="outline"
          title="Voir les notes"
          className="mt-6"
        />
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: "SourceSans3",
    paddingVertical: 8,
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingRight: 40,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    fontSize: 16,
    color: colors.DARK_BLUE,
    // minWidth: "100%",
    // width: "100%",
    textAlign: "left",
    // padding: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontFamily: "SourceSans3",
    paddingVertical: 8,
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingRight: 40,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    fontSize: 16,
    color: colors.DARK_BLUE,
    // minWidth: "100%",
    // width: "100%",
    textAlign: "left",
  },
  iconContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    marginHorizontal: 8,
    transform: [{ rotate: "180deg" }],
  },
});

const styles = StyleSheet.create({
  text: {
    color: colors.DARK_BLUE,
    fontSize: 16,
    textAlign: "left",
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    minHeight: screenHeight * 0.8,
  },
  noDataMessage: {
    color: "#111",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Events;
