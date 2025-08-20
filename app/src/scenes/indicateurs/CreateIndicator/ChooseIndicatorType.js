import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { colors } from "../../../utils/colors";

import Text from "../../../components/MyText";
import ArrowRightSvg from "../../../../assets/svg/arrow-right";
import CircledIcon from "../../../components/CircledIcon";
import { answers } from "../../survey-v2/utils";
import YesNoIndicator from "../../../components/YesNoIndicator";
import Gauge from "../../../components/gauge";
import { Screen } from "../../../components/Screen";
import { InputLabel } from "../../../components/InputLabel";

const ChooseIndicatorType = ({ navigation, route }) => {
  return (
    <Screen
      header={{
        title: "Créer un indicateur",
        leftButton: {
          icon: "ArrowUpSvg",
          iconStyle: { transform: [{ rotate: "270deg" }] },
          onPress: navigation.goBack,
        },
      }}
    >
      <InputLabel style={styles.spacing}>Comment souhaitez-vous évaluer votre indicateur ?</InputLabel>
      <InputLabel style={styles.spacingBottom} sublabel>
        Choisissez parmi les 3 critères d’évaluation suivants
      </InputLabel>
      <View className="w-full" style={styles.container}>
        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "smiley",
              indicatorCategory: route.params.indicatorCategory,
            });
          }}
        >
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>Avec des smileys</Text>
            <View style={styles.smileysContainer}>
              {answers.map((answer) => (
                <View key={answer.score} style={{}}>
                  <CircledIcon
                    color={answer.backgroundColor}
                    borderColor={answer.borderColor}
                    iconColor={answer.iconColor}
                    icon={answer.icon}
                    iconContainerStyle={{ marginRight: 0 }}
                    iconWidth={32}
                    iconHeight={32}
                  />
                </View>
              ))}
            </View>
          </View>
          <ArrowRightSvg color={colors.BLUE} style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "gauge",
              indicatorCategory: route.params.indicatorCategory,
            });
          }}
        >
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>Avec une jauge</Text>
            <Gauge hideSlider defaultValue={1} />
          </View>
          <ArrowRightSvg color={colors.BLUE} style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "boolean",
              indicatorCategory: route.params.indicatorCategory,
            });
          }}
        >
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>En répondant par Oui ou Non</Text>
            <YesNoIndicator no={"green"} yes={"red"} />
          </View>
          <ArrowRightSvg color={colors.BLUE} style={{ marginLeft: 20 }} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    marginTop: 25,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 30,
    color: "#5A5A5A",
  },
  typeContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    backgroundColor: "#F8F9FB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
  typeInside: {
    flex: 1,
    maxWidth: "80%",
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.BLUE,
    marginBottom: 15,
  },
  smileysContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "flex-start",
  },

  headerText: {
    color: colors.BLUE,
    fontSize: 19,
    fontWeight: "700",
  },
  header: {
    height: 60,
  },
  headerBackButton: {
    position: "absolute",
    zIndex: 1,
  },
  headerTextContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ChooseIndicatorType;
