import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "../../utils/date/helpers";
import { DiaryDataContext } from "../../context/diaryData";
import Text from "../../components/MyText";
import { displayedCategories, scoresMapIcon } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { buildSurveyData } from "../survey/survey-data";
import PieChart from "react-native-pie";
import CircledIcon from "../../components/CircledIcon";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import Icon from "../../components/Icon";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import Button from "../../components/Button";

const ChartPie = ({ navigation, fromDate, toDate }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState([]);
  const [chartDates, setChartDates] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState();

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

  React.useEffect(() => {
    if (!fromDate || !toDate) return;
    setChartDates(getArrayOfDatesFromTo({ fromDate, toDate }));
  }, [fromDate, toDate]);

  React.useEffect(() => {
    if (!activeCategories) return;
    const empty = !activeCategories.reduce((showing, categoryId) => {
      return Boolean(isChartVisible(categoryId)) || showing;
    }, false);
    setIsEmpty(empty);
  }, [activeCategories, isChartVisible, chartDates]);

  const isChartVisible = React.useCallback(
    (categoryId) => {
      let visible = false;
      chartDates.forEach((date) => {
        if (!diaryData[date]) {
          return;
        }
        if (!diaryData[date][categoryId]) {
          return;
        }
        visible = true;
      });
      return visible;
    },
    [diaryData, chartDates]
  );

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day");
    }
  };

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
      if (categoryState?.value === false) return categoryState.value;

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

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>statistiques</Text> apparaîtront au fur et à mesure de vos saisies
            quotidiennes.
          </Text>
        </View>
        <Button title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }

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
      <View style={styles.divider} />
      <PieYesNo
        title="Ai-je pris correctement mon traitement quotidien ?"
        data={computeChartData("PRISE_DE_TRAITEMENT")}
      />
      <PieYesNo
        title='Ai-je pris un "si besoin" ?'
        data={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
      />
    </ScrollView>
  );
};

const sliceColor = [
  "#f3f3f3",
  scoresMapIcon[1].color,
  scoresMapIcon[2].color,
  scoresMapIcon[3].color,
  scoresMapIcon[4].color,
  scoresMapIcon[5].color,
];

const Pie = ({ title, data }) => {
  const [sections, setSections] = React.useState([]);
  const [average, setAverage] = React.useState(0);
  const [averageIcons, setAverageIcons] = React.useState([]);
  const [joursRenseignes, setJoursRenseignes] = React.useState({});
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [nombreDeValeurParScore, setNombreDeValeurParScore] = React.useState([]);
  const [nombreDeJoursConsecutifs, setNombreDeJoursConsecutifs] = React.useState({});

  React.useEffect(() => {
    // un object
    // key est le score (0 signifie que c'set non renseigné)
    // nombre de d'instance de ce score
    const tempNombreDeValeurParScore = data.reduce((previous, current) => {
      const scoreEncours = current || 0; // on met 0 si la valeur est null
      previous[scoreEncours] = (previous[scoreEncours] || 0) + 1;
      return previous;
    }, {});
    setNombreDeValeurParScore(
      Object.keys(tempNombreDeValeurParScore).map((score) => ({
        score,
        total: data.length,
        count: tempNombreDeValeurParScore[score],
        pourcentage: (tempNombreDeValeurParScore[score] / data.length) * 100,
      }))
    );

    // calcul du pourcentage de jours renseignés
    const tempJoursRenseignes = data.reduce((previous, current) => {
      if (current && current !== 0) return ++previous;
      else return previous;
    }, 0);
    setJoursRenseignes({
      pourcentage: (tempJoursRenseignes / data.length) * 100,
      total: data.length,
      count: tempJoursRenseignes,
    });

    // calcul du nombre de jours consécutifs maximum par score
    const maximumParScore = {};
    let scoreEnCours = 0;
    let scorePrecedent = 0;
    data.forEach((current) => {
      // console.log("✍️ ~ current", current);
      scoreEnCours = current;
      // console.log("✍️ ~ scoreEnCours", scoreEnCours);
      if (scoreEnCours === scorePrecedent) {
        maximumParScore[scoreEnCours] = (maximumParScore[scoreEnCours] || 1) + 1;
      }
      scorePrecedent = scoreEnCours;
    });
    setNombreDeJoursConsecutifs(maximumParScore);
  }, [data]);

  React.useEffect(() => {
    if (!nombreDeValeurParScore?.length) return;
    const sectionsAvecCouleurEtPourcentage = nombreDeValeurParScore.map((e) => ({
      color: sliceColor[e.score],
      percentage: e.pourcentage,
    }));
    setSections(sectionsAvecCouleurEtPourcentage);
  }, [nombreDeValeurParScore]);

  React.useEffect(() => {
    const total = data.reduce((previous, current) => {
      if (!current || current === 0) return previous;
      return previous + 1;
    }, 0);
    const sum = data.reduce((previous, current) => previous + (current || 0), 0);
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
      setAverageIcons([num + 1, num]);
    } else if (decimal <= 0.75) {
      // troisieme quartile, on affiche le score du `num + 1` et du `num`
      setAverageIcons([num, num + 1]);
    } else {
      // quatrieme quartile, on n'affiche que le score du `num+1`
      setAverageIcons([num + 1]);
    }
  }, [average, title]);

  const toggleDetails = () => {
    if (!detailsVisible) logEvents.logSuiviShowDetailStatistics();
    setDetailsVisible((e) => !e);
  };

  if (data.every((value) => value === 0)) return null;

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={toggleDetails} style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <RoundButtonIcon icon="toggle" visible onPress={toggleDetails} isToggled={detailsVisible} small />
        </TouchableOpacity>
      </View>
      <View style={styles.contentCategoryContainer}>
        <View style={styles.pieContainer}>
          <PieChart radius={50} sections={sections} />
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
                {averageIcons.map((e, i) => {
                  if (!(e >= 1 && e <= 5)) return null;
                  const isSmall = i === 0 && averageIcons.length > 1;
                  const iconSize = isSmall ? 24 : 32;
                  const iconContainerSize = isSmall ? 30 : 40;
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
              {joursRenseignes.pourcentage < 100 ? (
                <Text style={styles.pourcentageStyle}>
                  {Math.round(100 - joursRenseignes.pourcentage)}% de jours non renseignés
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
      {detailsVisible ? (
        <TableDeStatistiquesParLigne
          nombreDeJoursConsecutifs={nombreDeJoursConsecutifs}
          nombreDeValeurParScore={nombreDeValeurParScore}
          title={title}
        />
      ) : null}
    </View>
  );
};

const sliceColorYesNo = ["#f3f3f3", "5956E8", "E575F8"];

const PieYesNo = ({ title, data }) => {
  const [sections, setSections] = React.useState([]);
  const [joursRenseignes, setJoursRenseignes] = React.useState({});
  const [nombreDeValeurParScore, setNombreDeValeurParScore] = React.useState([]);

  React.useEffect(() => {
    // un object
    // key est le score (0 signifie que c'set non renseigné)
    // nombre de d'instance de ce score
    const tempNombreDeValeurParScore = data.reduce((previous, current) => {
      const scoreEnCours = current === true ? 1 : current === false ? 2 : 0;
      previous[scoreEnCours] = (previous[scoreEnCours] || 0) + 1;
      return previous;
    }, {});
    setNombreDeValeurParScore(
      Object.keys(tempNombreDeValeurParScore).map((score) => ({
        score,
        total: data.length,
        count: tempNombreDeValeurParScore[score],
        pourcentage: (tempNombreDeValeurParScore[score] / data.length) * 100,
      }))
    );

    // calcul du pourcentage de jours renseignés
    const tempJoursRenseignes = data.reduce((previous, current) => {
      if (current !== 0) return ++previous;
      else return previous;
    }, 0);
    setJoursRenseignes({
      pourcentage: (tempJoursRenseignes / data.length) * 100,
      total: data.length,
      count: tempJoursRenseignes,
    });
  }, [data]);

  React.useEffect(() => {
    if (!nombreDeValeurParScore?.length) return;
    const sectionsAvecCouleurEtPourcentage = nombreDeValeurParScore.map((e) => ({
      color: sliceColorYesNo[e.score],
      percentage: e.pourcentage,
    }));
    setSections(sectionsAvecCouleurEtPourcentage);
  }, [nombreDeValeurParScore]);

  if (data.every((value) => value === 0)) return null;

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.contentCategoryContainer}>
        <View style={styles.pieContainer}>
          <PieChart radius={50} sections={sections} />
        </View>
        <View style={styles.pieContainer}>
          <View>
            <View style={{ display: "flex", flexDirection: "row", marginVertical: 5 }}>
              <Text style={styles.yesLabel}>Oui:&nbsp;</Text>
              <Text>
                {Math.round(nombreDeValeurParScore?.find((e) => e.score === "1")?.pourcentage || 0)}%
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", marginVertical: 5 }}>
              <Text style={styles.noLabel}>Non:&nbsp;</Text>
              <Text>
                {Math.round(nombreDeValeurParScore?.find((e) => e.score === "2")?.pourcentage || 0)}%
              </Text>
            </View>
            {joursRenseignes.pourcentage < 100 ? (
              <Text style={styles.pourcentageStyle}>
                {Math.round(100 - joursRenseignes.pourcentage)}% de jours non renseignés
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const TableDeStatistiquesParLigne = ({ nombreDeJoursConsecutifs, nombreDeValeurParScore, title }) => {
  return (
    <View style={stylesTableLigne.container}>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          {/* on affiche un smiley transparent pour simuler la place qu'un smiley prend pour aligner les lignes */}
          <CircledIcon
            opacity={0}
            key={`colonne_stat_${title}_header`}
            color={scoresMapIcon[5].color}
            borderColor={scoresMapIcon[5].borderColor}
            iconColor={scoresMapIcon[5].iconColor}
            icon={scoresMapIcon[5].faceIcon}
            // eslint-disable-next-line react-native/no-inline-styles
            iconContainerStyle={{
              marginRight: 0,
              width: 25,
              height: 25,
            }}
            iconWidth={20}
            iconHeight={20}
          />
        </View>
        {[1, 2, 3, 4, 5].map((score) => {
          return (
            <View
              key={`colonne_stat_${title}_${score}`}
              style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}
            >
              <CircledIcon
                color={scoresMapIcon[score].color}
                borderColor={scoresMapIcon[score].borderColor}
                iconColor={scoresMapIcon[score].iconColor}
                icon={scoresMapIcon[score].faceIcon}
                // eslint-disable-next-line react-native/no-inline-styles
                iconContainerStyle={{
                  marginRight: 0,
                  width: 25,
                  height: 25,
                }}
                iconWidth={20}
                iconHeight={20}
              />
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text style={stylesTableLigne.textTitre}>Pourcentage</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score) => {
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(score));
          return (
            <View
              key={`colonne_stat_pourcentage_${title}_${score}`}
              style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}
            >
              <Text>{Math.round(infoScore?.pourcentage) || 0}&nbsp;%</Text>
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text style={stylesTableLigne.textTitre}>Jour(s)</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score) => {
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(score));
          return (
            <View
              key={`colonne_stat_total_${title}_${score}`}
              style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}
            >
              <Text>{infoScore?.count || 0}&nbsp;j</Text>
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text style={stylesTableLigne.textTitre}>Jours consécutifs (maximum)</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score) => {
          return (
            <View
              key={`colonne_stat_consecutif_${title}_${score}`}
              style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}
            >
              <Text>{nombreDeJoursConsecutifs[score] || 0}&nbsp;j</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const stylesTableLigne = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  ligne: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  cellule: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    padding: 5,
  },
  celluleAvecBordureAGauche: {
    borderLeftColor: "#eee",
    borderLeftWidth: 1,
  },
  titre: {
    flex: 3,
    justifyContent: "flex-start",
  },
  textTitre: {
    color: colors.BLUE,
  },
});

const styles = StyleSheet.create({
  yesLabel: {
    color: "#5956E8",
    fontSize: 15,
  },
  noLabel: {
    fontSize: 15,
    color: "#E575F8",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 30,
    width: "50%",
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
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
    marginBottom: 15,
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
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
    marginRight: 5,
    flexShrink: 1,
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
    paddingBottom: 150,
  },
});

export default ChartPie;
