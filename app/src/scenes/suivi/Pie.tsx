import { colors } from "@/utils/colors";
import React from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import PieChart from "react-native-pie-chart";
import RoundButtonIcon from "@/components/RoundButtonIcon";
import { analyzeScoresMapIcon, EMOTION_COLORS, scoresMapIcon, TW_COLORS } from "@/utils/constants";
import CircledIcon from "@/components/CircledIcon";
import logEvents from "@/services/logEvents";

const SCORE_MAP_INFO = {
  ASC: [
    {
      color: "#f3f3f3",
    },
    {
      ...scoresMapIcon[1],
      ...analyzeScoresMapIcon[1],
    },
    {
      ...scoresMapIcon[2],
      ...analyzeScoresMapIcon[2],
    },
    {
      ...scoresMapIcon[3],
      ...analyzeScoresMapIcon[3],
    },
    {
      ...scoresMapIcon[4],
      ...analyzeScoresMapIcon[4],
    },
    {
      ...scoresMapIcon[5],
      ...analyzeScoresMapIcon[5],
    },
  ],
  DESC: [
    {
      color: "#f3f3f3",
    },
    {
      ...scoresMapIcon[5],
      ...analyzeScoresMapIcon[5],
    },
    {
      ...scoresMapIcon[4],
      ...analyzeScoresMapIcon[4],
    },
    {
      ...scoresMapIcon[3],
      ...analyzeScoresMapIcon[3],
    },
    {
      ...scoresMapIcon[2],
      ...analyzeScoresMapIcon[2],
    },
    {
      ...scoresMapIcon[1],
      ...analyzeScoresMapIcon[1],
    },
  ],
};

const screenHeight = Dimensions.get("window").height;

const renderResponse = ({ indicateur, value, isSmall, translateX }) => {
  if (indicateur?.type === "smiley") {
    let _icon;
    if (indicateur?.order === "DESC") {
      _icon = scoresMapIcon[5 + 1 - value];
    } else {
      _icon = scoresMapIcon[value];
    }
    const iconSize = isSmall ? 24 : 32;
    const iconContainerSize = isSmall ? 30 : 40;

    if (!_icon || (!_icon.color && !_icon.faceIcon))
      return (
        <CircledIcon
          key={`${indicateur.name}-${value}`}
          color="#cccccc"
          borderColor="#999999"
          iconColor="#888888"
          icon="QuestionMarkSvg"
          iconWidth={iconSize}
          iconHeight={iconSize}
          iconContainerStyle={{
            marginRight: 0,
            transform: [{ translateX: translateX ? -10 : 0 }],
            width: iconContainerSize,
            height: iconContainerSize,
          }}
        />
      );
    return (
      <CircledIcon
        key={`${indicateur.name}-${value}`}
        color={_icon.color}
        borderColor={_icon.borderColor}
        iconColor={_icon.iconColor}
        icon={_icon.faceIcon}
        iconWidth={iconSize}
        iconHeight={iconSize}
        iconContainerStyle={{
          marginRight: 0,
          transform: [{ translateX: translateX ? -10 : 0 }],
          width: iconContainerSize,
          height: iconContainerSize,
        }}
      />
    );
  }
  if (indicateur?.type === "boolean") {
    // a voir si on veut afficher un smiley ou un cercle ou du texte
    return null;
  }
  if (indicateur?.type === "gauge") {
    const _value = value;
    const _colors =
      indicateur?.order === "DESC"
        ? [TW_COLORS.POSITIVE, EMOTION_COLORS.good, EMOTION_COLORS.middle, EMOTION_COLORS.bad, TW_COLORS.NEGATIVE]
        : [TW_COLORS.NEGATIVE, EMOTION_COLORS.bad, EMOTION_COLORS.middle, EMOTION_COLORS.good, TW_COLORS.POSITIVE];

    let _color = _colors[_value - 1];

    return (
      <View
        style={{ transform: [{ translateX: translateX ? -10 : 0 }] }}
        className={`flex flex-row justify-center w-10 ${isSmall ? "space-x-1" : "space-x-2"} items-end`}
      >
        <View className={`${isSmall ? "h-1" : "h-2"} rounded-full w-1`} style={{ backgroundColor: _color }} />
        <View className={`${isSmall ? "h-2" : "h-5"} rounded-full w-1`} style={{ backgroundColor: _color }} />
        <View className={`${isSmall ? "h-4" : "h-8"} rounded-full w-1`} style={{ backgroundColor: _color }} />
      </View>
    );
  }
  return <View />;
};

export const Pie = ({ title, data, indicateur }) => {
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
      let scoreEncours = 0; // on met 0 si la valeur est null
      if (indicateur.type === "boolean") {
        scoreEncours = typeof current === "boolean" && current ? 5 : typeof current === "boolean" && current === false ? 1 : 0;
      } else if (indicateur.type === "gauge") {
        scoreEncours = Math.ceil(current * 5);
      } else {
        scoreEncours = current ? current : 0;
      }
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
    let scorePrecedent = 0;
    data.forEach((current) => {
      let scoreEnCours = 0; // on met 0 si la valeur est null
      if (indicateur.type === "boolean") {
        scoreEnCours = typeof current === "boolean" && current ? 5 : typeof current === "boolean" && current === false ? 1 : 0;
      } else if (indicateur.type === "gauge") {
        scoreEnCours = Math.ceil(current * 5);
      } else {
        scoreEnCours = current ? current : 0;
      }
      if (scoreEnCours === scorePrecedent) {
        maximumParScore[scoreEnCours] = (maximumParScore[scoreEnCours] || 1) + 1;
      }
      scorePrecedent = scoreEnCours;
    });
    setNombreDeJoursConsecutifs(maximumParScore);
  }, [data]);

  React.useEffect(() => {
    if (!nombreDeValeurParScore?.length) return;
    const sectionsAvecCouleurEtPourcentage = nombreDeValeurParScore.map((e) => {
      const item = SCORE_MAP_INFO[indicateur.order || "ASC"][e.score];
      return {
        color: item.color,
        value: e.pourcentage,
        label: { text: item.symbol, fontWeight: "bold" },
      };
    });
    console.log("SECTION ET COULEUR", sectionsAvecCouleurEtPourcentage);
    setSections(sectionsAvecCouleurEtPourcentage);
  }, [indicateur.order, nombreDeValeurParScore]);

  React.useEffect(() => {
    const total = data.reduce((previous, current) => {
      let scoreEncours = 0; // on met 0 si la valeur est null
      if (indicateur.type === "boolean") {
        scoreEncours = typeof current === "boolean" && current ? 5 : typeof current === "boolean" && current === false ? 1 : 0;
      } else if (indicateur.type === "gauge") {
        scoreEncours = Math.ceil(current * 5);
      } else {
        scoreEncours = current ? current : 0;
      }
      if (!scoreEncours || scoreEncours === 0) return previous;
      return previous + 1;
    }, 0);
    const sum = data.reduce((previous, current) => {
      let scoreEncours = 0; // on met 0 si la valeur est null
      if (indicateur.type === "boolean") {
        scoreEncours = typeof current === "boolean" && current ? 5 : typeof current === "boolean" && current === false ? 1 : 0;
      } else if (indicateur.type === "gauge") {
        scoreEncours = Math.ceil(current * 5);
      } else {
        scoreEncours = current ? current : 0;
      }
      return previous + (scoreEncours || 0);
    }, 0);
    const avg = sum / total;
    setAverage(avg);
  }, [data, indicateur]);

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
  console.log(sections);
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
          {/* <PieChart radius={50} sections={sections} /> */}
          {sections?.reduce((sum, section) => sum + section.value, 0) > 0 ? (
            <PieChart
              widthAndHeight={100}
              series={sections.map((section) => section)}
              // sliceColor={sections.map((section) => section.color)}
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
        {averageIcons.length ? (
          <View style={styles.pieContainer}>
            <View style={styles.averageContainer}>
              <Text style={styles.legendText}>Moyenne</Text>
              <View style={[styles.averageIconsContainer, { transform: [{ translateX: 8 * (averageIcons.length - 1) }] }]}>
                {averageIcons.map((e, i) => {
                  if (!(e >= 1 && e <= 5)) return null;
                  const isSmall = i === 0 && averageIcons.length > 1;
                  return renderResponse({ indicateur, value: e, isSmall, translateX: isSmall });
                })}
              </View>
              {joursRenseignes.pourcentage < 100 ? (
                <Text style={styles.pourcentageStyle}>{Math.round(100 - joursRenseignes.pourcentage)}% de jours non renseignés</Text>
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
          indicateur={indicateur}
        />
      ) : null}
    </View>
  );
};

// parialsColors 0 -> no data, 1 -> yes, 2 -> no
const TableDeStatistiquesParLigne = ({ nombreDeJoursConsecutifs, nombreDeValeurParScore, title, indicateur }) => {
  const isReverse = indicateur?.order === "DESC";
  const scores = isReverse ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

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
            <View key={`colonne_stat_${title}_${score}`} className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100">
              {renderResponse({ indicateur, value: score, isSmall: true })}
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text style={stylesTableLigne.textTitre}>Pourcentage</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score) => {
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(scores[score - 1]));
          return (
            <View
              key={`colonne_stat_pourcentage_${title}_${score}`}
              className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100"
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
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(scores[score - 1]));
          return (
            <View
              key={`colonne_stat_total_${title}_${score}`}
              className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100"
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
            <View key={`colonne_stat_consecutif_${title}_${score}`} style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}>
              <Text>{nombreDeJoursConsecutifs[scores[score - 1]] || 0}&nbsp;j</Text>
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
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
    minHeight: screenHeight,
  },
});
