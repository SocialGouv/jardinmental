import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Alert } from "react-native";
import { beforeToday, formatDateToFrenchNumericFormat } from "@/utils/date/helpers";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { STORAGE_KEY_START_DATE, TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { IndicatorsBottomSheet } from "./IndicatorsBottomSheet";
import { Indicator } from "@/entities/Indicator";
import { StatesBottomSheet } from "./StateBottomSheet";
import { PeriodBottomSheet, PeriodRangeDate } from "./PeriodBottomSheet";
import DatePicker from "react-native-date-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HelpView from "@/components/HelpView";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import Chevron from "./Chevron";

const screenHeight = Dimensions.get("window").height;

const HELP_TEXT = `### Les déclencheurs vous aident à :

- Identifier ce qui influence positivement ou négativement votre état
- Faire des liens entre vos ressentis et le contexte de vos journées
- Mieux comprendre ce qui vous aide… et ce qui peut vous fragiliser

### Retrouvez les notes que vous avez écrites : 
Séléctionnez un indicateur, un ou plusieurs niveaux et une période pour retrouver les notes associées.
`;

const Events = ({ navigation }) => {
  const [fromDate, setFromDate] = React.useState(beforeToday(30));
  const [toDate, setToDate] = React.useState(beforeToday(0));
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
    value: PeriodRangeDate;
    label: string;
  }>({
    value: PeriodRangeDate.lastDays7,
    label: "7 derniers jours",
  });

  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [isSelectModalActive, setIsSelectModalActive] = useState(false);

  useEffect(() => {
    const computeDate = async () => {
      if (selectedPeriod.value !== "custom") {
        let _fromDate;
        setIsSelectModalActive(true);
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
        setTimeout(() => {
          setIsSelectModalActive(false);
        }, 50);
      } else {
        setIsSelectModalActive(false);
      }
    };
    computeDate();
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
        label: label,
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
      value: PeriodRangeDate;
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

  return (
    <View className="flex-1 pt-60 px-4 bg-white">
      <View className="flex-row justify-between items-center">
        <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>Identifiez ce qui influence votre état</Text>
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(<HelpView title={"Comment lire mes déclencheurs?"} isMd={true} description={HELP_TEXT} />);
          }}
          className="bg-cnam-primary-100 p-2 rounded-full mr-2"
        >
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
        <View className="flex-row justify-between px-2 rounded-2xl items-center">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>L'indicateur</Text>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={openIndicatorBottomSheet}>
            <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
              {selectedIndicator?.name || "Sélectionnez un indicateur"}
            </Text>
            <Chevron />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between px-2 rounded-2xl items-center">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>était</Text>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={openStateBottomSheet}>
            <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
              {selectedState ? selectedState.label : `Sélectionnez un état`}
            </Text>
            <Chevron />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between px-2 rounded-2xl items-center">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>sur la période</Text>
          <TouchableOpacity className="flex-row items-center justify-between" onPress={openPeriodBottomSheet}>
            <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
              {selectedPeriod.value === "custom" ? "Personalisée" : selectedPeriod.label}
            </Text>
            <Chevron />
          </TouchableOpacity>
        </View>
        {selectedPeriod.value === "custom" && (
          <View className="flex-row justify-between px-2 rounded-2xl items-center">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Période</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => {
                if (!isSelectModalActive) {
                  setOpenFromDate(true);
                }
              }}
            >
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>Du </Text>
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>{formatDateToFrenchNumericFormat(fromDate)}</Text>
              <Chevron />
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
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>{formatDateToFrenchNumericFormat(toDate)}</Text>
              <Chevron />
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
              minimumDate={fromDate}
              androidVariant="iosClone"
              mode="date"
              modal
              open={openToDate}
              date={fromDate}
              confirmText="Valider"
              onConfirm={(date) => {
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
