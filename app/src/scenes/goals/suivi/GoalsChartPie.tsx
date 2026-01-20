import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PieChart from "react-native-pie-chart";
import { TW_COLORS, yesNoMapIcon, yesNoMapTreatmentIcon } from "../../../utils/constants";
import { getGoalsAndRecords } from "../../../utils/localStorage/goals";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";
import { parseISO, getDay } from "date-fns";
import { colors as mainColors } from "@/utils/colors";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

export const GoalsChartPie = ({ chartDates, onIsEmptyChanged }) => {
  const [goals, setGoals] = useState([]);

  const updateGoals = useCallback(async () => {
    let _goals = await getGoalsAndRecords();
    let isEmpty = true;
    _goals = _goals.map(({ goal, records }) => {
      const _records = records
        .filter((record) => chartDates.includes(record.date))
        .map((record) => ({
          ...record,
          value: record.value === true ? 5 : 1,
        }));

      if (_records.length > 0) isEmpty = false;

      return {
        goal,
        records: chartDates
          .map((date) => {
            const existingRecord = _records.find((record) => record.date === date);
            if (existingRecord) return existingRecord;
            else {
              if (goal?.daysOfWeek?.[DAYS_OF_WEEK[getDay(parseISO(date))]]) return { value: 0 };
              else return null;
            }
          })
          .filter((record) => !!record),
      };
    });
    setGoals(_goals);
    onIsEmptyChanged?.(isEmpty);
  }, [chartDates]);

  useFocusEffect(
    useCallback(() => {
      updateGoals();
    }, [chartDates])
  );

  useEffect(() => {
    updateGoals();
  }, [chartDates]);

  return (
    <View style={styles.categoryContainer}>
      {goals.map(({ goal, records }) => (
        <GoalPie key={goal.id} title={goal.label} records={records} />
      ))}
    </View>
  );
};

const parialsColors = {
  0: { color: "#f3f3f3" },
  1: {
    // eslint-disable-next-line dot-notation
    color: "#C1DFE6",
    // eslint-disable-next-line dot-notation
    symbol: yesNoMapTreatmentIcon["false"].symbol,
  },
  5: {
    // eslint-disable-next-line dot-notation
    color: "#9ADAAA",
    // eslint-disable-next-line dot-notation
    symbol: yesNoMapTreatmentIcon["true"].symbol,
  },
};

const GoalPie = ({ title, records }) => {
  const [sections, setSections] = useState({});
  const [sectionValues, setSectionValues] = useState([]);

  const updateSections = useCallback(() => {
    const _sections = records.reduce((acc, record) => {
      if (record === null) return acc;
      const count = (acc[record.value]?.count || 0) + 1;
      acc[record.value] = {
        ...acc[record.value],
        score: record.value,
        total: records.length,
        count,
        percentage: (count / records.length) * 100,
        color: parialsColors[record.value],
      };
      return acc;
    }, {});
    setSections(_sections);
    setSectionValues(
      Object.values(_sections).map(({ percentage, color }) => {
        return {
          value: percentage,
          color: color.color,
          label: { text: color.symbol, fontWeight: "bold", fontFamily: "SourceSans3-Bold", fontSize: 16, fill: TW_COLORS.BRAND_800, offsetX: -1 },
        };
      })
    );
  }, [records]);

  useEffect(() => {
    updateSections();
  }, [records]);
  console.log(sectionValues);
  return (
    <View className="border-b border-cnam-primary-400 py-4">
      <View style={styles.titleContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View className="flex-row py-4 mt-2 items-center">
        <View className="flex-col basis-[40%] items-center justify-between">
          {/* <PieChart radius={50} sections={sectionValues} /> */}
          <View style={styles.pieContainer}>
            {sectionValues?.reduce((sum, section) => sum + section.value, 0) > 0 ? (
              <View
                style={{
                  backgroundColor: TW_COLORS.GRAY_700,
                  borderRadius: 400,
                }}
              >
                <PieChart
                  widthAndHeight={100}
                  padAngle={0.01}
                  series={sectionValues.map((section) => section)}
                  cover={{
                    radius: 0.45,
                    color: "white",
                  }}
                />
              </View>
            ) : (
              // Show empty state or placeholder when all values are 0
              <View className="w-[100px] h-[100px] border border-gray-200 rounded-full justify-center items-center">
                <Text className="text-gray-400 text-xs">Pas de données</Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex-col space-y-4 items-center basis-[60%]">
          <View style={styles.numbersContainer}>
            <View className="flex flex-row gap-3 items-center">
              <View className="flex flex-row mt-2 items-center">
                <View style={{ backgroundColor: parialsColors[5].color }} className={`flex justify-center items-center h-10 w-10 mr-1 rounded-full`}>
                  <Text className="text-cnam-primary-800 text-sm">Oui</Text>
                </View>
                <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-800")}>
                  {Math.round(sections?.[5]?.percentage || 0)}%
                </Text>
              </View>
              <View className="flex flex-row mt-2 items-center">
                <View style={{ backgroundColor: parialsColors[1].color }} className={`flex justify-center items-center h-10 w-10 mr-1 rounded-full`}>
                  <Text className="text-cnam-primary-800 text-sm">Non</Text>
                </View>

                <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-800")}>
                  {Math.round(sections?.[1]?.percentage || 0)}%
                </Text>
              </View>
            </View>
            <Text style={styles.percentageSmall}>{Math.round(sections?.[0]?.percentage || 0)}% de jours non renseignés</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
    alignItems: "stretch",
    display: "flex",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pieContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  contentCategoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginTop: 10,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontFamily: "SourceSans3",
    color: mainColors.BLUE,
    fontWeight: "600",
    marginRight: 5,
    flexShrink: 1,
  },
  numbersContainer: {
    display: "flex",
    alignItems: "center",
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    color: mainColors.BLUE,
    marginTop: 5,
    marginBottom: 2,
  },
  percentageSmall: {
    fontSize: 12,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    color: mainColors.BLUE,
    marginVertical: 5,
  },
  percentageBig: {
    fontSize: 14,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    color: mainColors.BLUE,
    marginBottom: 5,
  },
});
