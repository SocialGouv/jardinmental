import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import CircledIcon from "../../components/CircledIcon";
import { icons, colors as colorsFromConstant, iconBorderColors, iconColors } from "../../utils/constants";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import { beforeToday, formatDay } from "../../utils/date/helpers";

const NoData = ({ navigation }) => {
  const startSurvey = () => {
    const date = formatDay(beforeToday(0));
    const answers = {};
    const currentSurvey = { date, answers };
    return navigation.navigate("day-survey", {
      currentSurvey,
      editingSurvey: false,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.bienvenue}>Bienvenue&nbsp;!</Text>
      <View style={styles.smileyContainer}>
        <CircledIcon
          color={colorsFromConstant.veryGood}
          borderColor={iconBorderColors.veryGood}
          iconColor={iconColors.veryGood}
          icon={icons.veryGood}
          iconContainerStyle={{ marginRight: 0 }}
          iconWidth={32}
          iconHeight={32}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Commençons votre suivi en ajoutant votre première entrée !</Text>
        <TouchableOpacity onPress={startSurvey}>
          <View style={styles.answer}>
            <View style={styles.buttonContainer}>
              <RoundButtonIcon
                backgroundColor={colors.LIGHT_BLUE}
                iconColor={"#FFFFFF"}
                borderWidth={0.5}
                borderColor={colors.LIGHT_BLUE}
                icon="plus"
                visible={true}
                styleContainer={{ marginHorizontal: 0 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bienvenue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.BLUE,
    textAlign: "center",
  },
  buttonContainer: {
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
  },
  smileyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "normal",
    color: colors.BLUE,
    textAlign: "center",
    marginBottom: 10,
  },
  textContainer: {
    margin: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});

export default NoData;
