import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  makeSureTimestamp,
  beforeToday,
  getArrayOfDates,
  getTodaySWeek,
  formatDate,
} from "../../utils/date/helpers";
import { DiaryDataContext } from "../../context/diaryData";
import Text from "../../components/MyText";
import DateRange from "./dateRange";
import { displayedCategories } from "../../utils/constants";
import { colors } from "../../utils/colors";
import localStorage from "../../utils/localStorage";

const ChartFrise = ({ navigation, fromDate, toDate }) => {
  const [diaryData] = React.useContext(DiaryDataContext);

  const [customs, setCustoms] = React.useState([]);
  const [oldCustoms, setOldCustoms] = React.useState([]);
  let mounted = React.useRef(true);

  React.useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      if (c && mounted) setCustoms(c);

      //retrocompatibility
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setOldCustoms(t);
    })();
    return () => (mounted = false);
  }, [diaryData]);

  const chartDates = getArrayOfDates({ startDate: Date.now(), numberOfDays: 6 });
  console.log("✍️ ~ chartDates", chartDates);

  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
      return categoryName;
    }
    return category;
  };

  const computeChartData = (categoryId) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return null;
      }
      if (categoryState?.value) return categoryState?.value - 1;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
        return categoryState.level + categoryStateIntensity.level - 2;
      }
      return categoryState.level - 1;
    });
  };

  return Object.keys(displayedCategories)
    .concat(customs)
    .concat(oldCustoms)
    .map((categoryId) => (
      <Frise
        title={getTitle(categoryId)}
        key={categoryId}
        data={computeChartData(categoryId)}
        fromDate={fromDate}
        toDate={toDate}
      />
    ));
};

const Frise = ({ title, data, fromDate, toDate }) => {
  console.log("✍️ ~ { title, data, fromDate, toDate }", { title, data, fromDate, toDate });
  return (
    <View>
      <Text style={styles.friseTitle}>{title}</Text>
      {/* <View>
        {data?.map((e) => (
          <View style={styles.square} />
        ))}
      </View> */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>{fromDate}</Text>
        <Text style={styles.legendText}>{toDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
  },
  square: {
    width: 10,
    height: 10,
    backgroundColor: "red",
  },
});

export default ChartFrise;
