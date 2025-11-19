import { colors } from "@/utils/colors";
import React from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import PieChart from "react-native-pie-chart";
import RoundButtonIcon from "@/components/RoundButtonIcon";
import { analyzeScoresMapIcon, EMOTION_COLORS, SCORE_MAP_INFO, scoresMapIcon, TW_COLORS } from "@/utils/constants";
import CircledIcon, { mapIconToSvg } from "@/components/CircledIcon";
import logEvents from "@/services/logEvents";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";

const screenHeight = Dimensions.get("window").height;

const renderResponse = ({ indicateur, value, isSmall, translateX, reverse, index }) => {
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
          key={`${indicateur.name}-${value}-${index}`}
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
    const Icon = mapIconToSvg(_icon.faceIcon);

    return <Icon key={index} width={iconSize} height={iconSize} color={_icon.iconColor} />;
  }
  if (indicateur?.type === "boolean") {
    // a voir si on veut afficher un smiley ou un cercle ou du texte
    return null;
  }
  if (indicateur?.type === "gauge") {
    const _value = value;
    const itemColors = SCORE_MAP_INFO[indicateur?.order];
    let _color = itemColors[_value].color;
    return (
      <View
        key={index}
        className={mergeClassNames("flex-col items-center space-y-2", reverse ? "flex-col-reverse" : "")}
        style={{
          height: isSmall ? 30 : 40,
        }}
      >
        <View
          className="px-1 w-8 items-center mx-2"
          style={{
            backgroundColor: itemColors[_value].color,
            transform: [
              {
                scale: isSmall ? 0.7 : 1,
              },
            ],
          }}
        >
          <Text>{itemColors[_value].symbol}</Text>
        </View>
        <View>
          <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800 font-normal")}>{itemColors[_value].label}</Text>
        </View>
      </View>
    );
    // return (
    //   <View
    //     style={{ transform: [{ translateX: translateX ? -10 : 0 }] }}
    //     className={`flex flex-row justify-center w-10 ${isSmall ? "space-x-1" : "space-x-2"} items-end`}
    //   >
    //     <View className={`${isSmall ? "h-1" : "h-2"} rounded-full w-1`} style={{ backgroundColor: _color }} />
    //     <View className={`${isSmall ? "h-2" : "h-5"} rounded-full w-1`} style={{ backgroundColor: _color }} />
    //     <View className={`${isSmall ? "h-4" : "h-8"} rounded-full w-1`} style={{ backgroundColor: _color }} />
    //   </View>
    // );
  }
  return <View key={index} />;
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
        label: { text: item.symbol, fontWeight: "bold", fontSize: 16, fill: item.iconColor, offsetX: -1 },
      };
    });
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
  return (
    <View style={styles.categoryContainer}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={toggleDetails} style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {!!detailsVisible && (
            <TouchableOpacity onPress={toggleDetails}>
              <ArrowUpSvg />
            </TouchableOpacity>
          )}
          {!detailsVisible && (
            <TouchableOpacity onPress={toggleDetails}>
              <ArrowUpSvg
                style={{
                  transform: [
                    {
                      scaleY: -1,
                    },
                  ],
                }}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.contentCategoryContainer}>
        <View style={styles.pieContainer}>
          {/* <PieChart radius={50} sections={sections} /> */}
          {sections?.reduce((sum, section) => sum + section.value, 0) > 0 ? (
            <View
              style={{
                backgroundColor: TW_COLORS.GRAY_700,
                borderRadius: 400,
              }}
            >
              <PieChart
                widthAndHeight={100}
                series={sections.map((section) => section)}
                padAngle={0.01}
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
        {averageIcons.length ? (
          <View className="flex-col space-y-4 items-center">
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Moyenne</Text>
            <View className="flex-row space-x-4">
              {averageIcons.map((e, i) => {
                if (!(e >= 1 && e <= 5)) return null;
                const isSmall = i === 0 && averageIcons.length > 1;
                return renderResponse({ indicateur, value: e, isSmall, translateX: isSmall, index: i });
              })}
            </View>
            {joursRenseignes.pourcentage < 100 ? (
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>
                {Math.round(100 - joursRenseignes.pourcentage)}% de jours non renseignés
              </Text>
            ) : null}
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
        {[1, 2, 3, 4, 5].map((score, index) => {
          return (
            <View key={`colonne_stat_${title}_${score}`} className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100">
              {renderResponse({ indicateur, value: score, isSmall: true, reverse: true, index })}
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>Pourcentage</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score, index) => {
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(scores[score - 1]));
          return (
            <View
              key={`colonne_stat_pourcentage_${title}_${score}_${index}`}
              className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100"
            >
              <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>
                {Math.round(infoScore?.pourcentage) || 0}&nbsp;%
              </Text>
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>Jour(s)</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score, index) => {
          const infoScore = nombreDeValeurParScore.find((e) => Number(e.score) === Number(scores[score - 1]));
          return (
            <View
              key={`colonne_stat_total_${title}_${score}_${index}`}
              className="flex-1 flex flex-row justify-center items-center p-[5] border-l border-gray-100"
            >
              <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>{infoScore?.count || 0}&nbsp;j</Text>
            </View>
          );
        })}
      </View>
      <View style={stylesTableLigne.ligne}>
        <View style={[stylesTableLigne.cellule, stylesTableLigne.titre]}>
          <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>Jours consécutifs</Text>
        </View>
        {[1, 2, 3, 4, 5].map((score, index) => {
          return (
            <View
              key={`colonne_stat_consecutif_${title}_${score}_${index}`}
              style={[stylesTableLigne.cellule, stylesTableLigne.celluleAvecBordureAGauche]}
            >
              <Text className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>
                {nombreDeJoursConsecutifs[scores[score - 1]] || 0}&nbsp;j
              </Text>
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
    // display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "stretch",
    padding: 5,
  },
  celluleAvecBordureAGauche: {
    borderLeftColor: "#eee",
    borderLeftWidth: 1,
  },
  titre: {
    // flex: 1,
    width: 85,
    flex: 0,
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
