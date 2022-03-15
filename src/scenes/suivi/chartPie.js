import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { formatDate, formatDay, getArrayOfDatesFromTo } from "../../utils/date/helpers";
import { DiaryDataContext } from "../../context/diaryData";
import Text from "../../components/MyText";
import { displayedCategories, scoresMapIcon } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { buildSurveyData } from "../survey/survey-data";
import PieChart from "react-native-pie-chart";
import CircledIcon from "../../components/CircledIcon";

const ChartPie = ({ navigation, fromDate, toDate }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState([]);
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const q = await buildSurveyData();
        if (q) {
          setActiveCategories(q.map((e) => e.id));
        }
      })();
    }, [])
  );

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
        return 0;
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return 0;
      }
      if (categoryState?.value) return categoryState.value;

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

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
      {activeCategories.map((categoryId) => (
        <Pie
          title={getTitle(categoryId)}
          key={categoryId}
          data={computeChartData(categoryId)}
          fromDate={fromDate}
          toDate={toDate}
        />
      ))}
    </ScrollView>
  );
};

const Pie = ({ title, data }) => {
  const widthAndHeight = 100;
  const [series, setSeries] = React.useState([]);
  const [average, setAverage] = React.useState(0);
  const [averageIcons, setAverageIcons] = React.useState([]);
  const [joursRenseignes, setJoursRenseignes] = React.useState({});
  const sliceColor = [
    "#f3f3f3",
    scoresMapIcon[1].color,
    scoresMapIcon[2].color,
    scoresMapIcon[3].color,
    scoresMapIcon[4].color,
    scoresMapIcon[5].color,
  ];

  React.useEffect(() => {
    // un object
    // key est le score (0 signifie que c'set non renseigné)
    // nombre de d'instance de ce score
    const objectScoreCount = data.reduce((previous, current) => {
      previous[current] = (previous[current] || 0) + 1;
      return previous;
    }, {});

    // calcul du pourcentage de jours renseignés
    const tempJoursRenseignes = data.reduce((previous, current) => {
      if (current !== 0) return ++previous;
      else return previous;
    }, 0);
    setJoursRenseignes({
      pourcentage: Math.round((tempJoursRenseignes / data.length) * 100),
      total: data.length,
      count: tempJoursRenseignes,
    });

    // un array, ou l'index correspondant au score
    const compute = [0, 1, 2, 3, 4, 5].reduce((previous, score) => {
      previous.push(objectScoreCount[score] || 0);
      return previous;
    }, []);
    // console.log("✍️ ~ compute", compute);
    setSeries(compute);
  }, [data]);

  React.useEffect(() => {
    const total = data.reduce((previous, current) => {
      if (current === 0) return previous;
      return previous + 1;
    }, 0);
    const sum = data.reduce((previous, current) => previous + current, 0);
    const avg = sum / total;
    setAverage(avg);
  }, [data]);

  React.useEffect(() => {
    const num = Math.floor(average);
    const decimal = (average - Math.floor(average)).toFixed(2);

    if (decimal <= 0.25) {
      // premier quartile, on n'affiche que le score du `num`
      setAverageIcons([num]);
    } else if (decimal <= 0.5) {
      // deuxieme quartile, on affiche le score du `num` et du `num+1`
      setAverageIcons([num, num + 1]);
    } else if (decimal <= 0.75) {
      // troisieme quartile, on affiche le score du `num + 1` et du `num`
      setAverageIcons([num + 1, num]);
    } else {
      // quatrieme quartile, on n'affiche que le score du `num+1`
      setAverageIcons([num + 1]);
    }
  }, [average, title]);

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.contentCategoryContainer}>
        <View style={styles.pieContainer}>
          <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
        </View>
        {averageIcons.length ? (
          <View style={styles.pieContainer}>
            <View style={styles.averageContainer}>
              <Text style={styles.legendText}>Moyenne</Text>
              <View
                style={[
                  styles.averageIconsContainer,
                  { transform: [{ translateX: 8 * (averageIcons.length - 1) }] },
                ]}
              >
                {averageIcons.reverse().map((e, i) => {
                  if (!(e >= 1 && e <= 5)) return null;
                  const isSmall = i === 0 && averageIcons.length > 1;
                  const iconSize = isSmall ? 24 : 32;
                  const iconContainerSize = isSmall ? 32 : 40;
                  return (
                    <CircledIcon
                      key={`${title}_${e}`}
                      color={scoresMapIcon[e].color}
                      borderColor={scoresMapIcon[e].borderColor}
                      iconColor={scoresMapIcon[e].iconColor}
                      icon={scoresMapIcon[e].faceIcon}
                      // eslint-disable-next-line react-native/no-inline-styles
                      iconContainerStyle={{
                        marginRight: 0,
                        transform: [{ translateX: isSmall ? -10 : 0 }],
                        width: iconContainerSize,
                        height: iconContainerSize,
                      }}
                      iconWidth={iconSize}
                      iconHeight={iconSize}
                    />
                  );
                })}
              </View>
              <Text style={styles.pourcentageStyle}>
                {100 - joursRenseignes.pourcentage}% de jours non renseignés
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  averageIconsContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    flex: 1,
    alignItems: "stretch",
    display: "flex",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  contentCategoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  pieContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  averageContainer: {
    display: "flex",
    alignItems: "center",
  },
  legendText: {
    fontSize: 14,
    color: colors.BLUE,
    marginVertical: 5,
  },
  pourcentageStyle: {
    fontSize: 12,
    color: colors.BLUE,
    marginVertical: 5,
    fontStyle: "italic",
  },
  /// old
  title: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  scrollContainer: {
    // flex: 1,
  },
});

export default ChartPie;
