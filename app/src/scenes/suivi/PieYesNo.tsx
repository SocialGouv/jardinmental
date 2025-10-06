import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { colors } from "@/utils/colors";
import PieChart from "react-native-pie-chart";

const screenHeight = Dimensions.get("window").height;

export const PieYesNo = ({ title, data, parialsColors = ["#f3f3f3", "#5956E8", "#E575F8"] }) => {
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
      color: parialsColors[e.score],
      value: e.pourcentage,
    }));
    console.log("LCS TOTO", sectionsAvecCouleurEtPourcentage);
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
          {/* <PieChart radius={50} sections={sections} /> */}
          {sections?.reduce((sum, section) => sum + section, 0) > 0 ? (
            <PieChart
              widthAndHeight={100}
              series={sections.map((section) => section)}
              // sliceColor={sections.map((section) => section)}
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
        <View style={styles.pieContainer}>
          <View>
            <View className="flex flex-row gap-3 items-center">
              <View className="flex flex-row mt-2 items-center">
                <View style={{ backgroundColor: parialsColors[1] }} className={`flex justify-center items-center h-10 w-10 mr-1 rounded-full`}>
                  <Text className="text-white text-sm">Oui</Text>
                </View>
                <Text>{Math.round(nombreDeValeurParScore?.find((e) => e.score === "1")?.pourcentage || 0)}%</Text>
              </View>
              <View className="flex flex-row mt-2 items-center">
                <View style={{ backgroundColor: parialsColors[2] }} className={`flex justify-center items-center h-10 w-10 mr-1 rounded-full`}>
                  <Text className="text-white text-sm">Non</Text>
                </View>

                <Text>{Math.round(nombreDeValeurParScore?.find((e) => e.score === "2")?.pourcentage || 0)}%</Text>
              </View>
            </View>
            {joursRenseignes.pourcentage < 100 ? (
              <Text style={styles.pourcentageStyle}>{Math.round(100 - joursRenseignes.pourcentage)}% de jours non renseignés</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

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
