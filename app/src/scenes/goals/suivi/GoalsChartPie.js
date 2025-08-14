import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PieChart from "react-native-pie-chart";
// import PieChart from "react-native-pie";
import { scoresMapIcon } from "../../../utils/constants";
import { getGoalsAndRecords } from "../../../utils/localStorage/goals";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";
import { parseISO, getDay } from "date-fns";
import { colors as mainColors } from "@/utils/colors";

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

const colors = {
  0: "#f3f3f3",
  1: scoresMapIcon[1].color,
  5: scoresMapIcon[5].color,
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
        color: colors[record.value],
      };
      return acc;
    }, {});
    setSections(_sections);
    setSectionValues(Object.values(_sections).map(({ percentage, color }) => ({ percentage, color })));
  }, [records]);

  useEffect(() => {
    updateSections();
  }, [records]);

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.contentCategoryContainer}>
        <View style={styles.pieContainer}>
          {/* <PieChart radius={50} sections={sectionValues} /> */}
          <View style={styles.pieContainer}>
            {sectionValues?.reduce((sum, section) => sum + section.percentage, 0) > 0 ? (
              <PieChart
                widthAndHeight={100}
                series={sectionValues.map((section) => section.percentage)}
                sliceColor={sectionValues.map((section) => section.color)}
                coverRadius={0.45}
                coverFill={"#FFF"}
              />
            ) : (
              // Show empty state or placeholder when all values are 0
              <View className="w-[100px] h-[100px] border border-gray-200 rounded-full justify-center items-center">
                <Text className="text-gray-400 text-xs">Pas de données</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.pieContainer}>
          <View style={styles.numbersContainer}>
            <Text style={styles.legendTitle}>Taux de réussite :</Text>
            <Text style={styles.percentageBig}>{Math.round(sections?.[5]?.percentage || 0)}%</Text>
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
    fontStyle: "italic",
  },
  percentageBig: {
    fontSize: 14,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    color: mainColors.BLUE,
    marginBottom: 5,
  },
});
