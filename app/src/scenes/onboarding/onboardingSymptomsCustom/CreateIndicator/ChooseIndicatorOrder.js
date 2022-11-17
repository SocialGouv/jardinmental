import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TextInput,
} from "react-native";

import BackButton from "../../../../components/BackButton";
import { colors } from "../../../../utils/colors";
import Button from "../../../../components/Button";
import Text from "../../../../components/MyText";
import ArrowRightSvg from "../../../../../assets/svg/arrow-right";
import CircledIcon from "../../../../components/CircledIcon";
import { answers } from "../../../survey/utils";
import YesNoIndicator from "../../../../components/YesNoIndicator";

const ChooseIndicatorOrder = ({ navigation, route }) => {
  //   const [nameNewIndicator, setNameNewIndicator] = useState("");

  //   const handleAddNewIndicator = async (value) => {
  //     if (!value) return;
  //     await localStorage.addCustomSymptoms(value);
  //     logEvents.logCustomSymptomAdd();
  //   };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Créer un indicateur</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topTitle}>{route.params.nameNewIndicator}</Text>
          {/* indicator preview */}
          {route.params.indicatorType === "smileys" && (
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
          )}

          <View style={styles.intensityContainer}>
            <View style={styles.intenstiyDiamond} />
            <View style={styles.intensityLine} />
            <Text style={styles.intensityText}>intensité</Text>
            <View style={styles.intensityLine} />
            <View style={styles.intenstiyArrow} />
          </View>
        </View>

        <Text style={styles.subtitle}>
          Vous pouvez choisir le sens d’évaluation qui correspond à votre indicateur
        </Text>

        {/* <View style={styles.typeContainer}>
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>Avec une jauge</Text>
          </View>
          <ArrowRightSvg color="#26387C" style={{ marginLeft: 20 }} />
        </View>

        <View style={styles.typeContainer}>
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>En répondant par Oui ou Non</Text>
            <YesNoIndicator no={"green"} yes={"red"} />
          </View>
          <ArrowRightSvg color="#26387C" style={{ marginLeft: 20 }} />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  topContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    backgroundColor: "#F8F9FB",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#26387C",
    marginBottom: 15,
  },
  intensityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  intensityLine: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    flex: 1,
    height: 1,
  },
  intensityText: {
    marginHorizontal: 7,
    fontSize: 15,
    color: "#26387C",
  },
  intenstiyDiamond: {
    transform: [{ rotate: "45deg" }],
    backgroundColor: "#26387C",
    height: 8,
    width: 8,
  },
  intenstiyArrow: {
    transform: [{ rotate: "45deg" }],
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: 10,
    width: 10,
    position: "absolute",
    right: 0,
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
  },
  typeInside: {
    flex: 1,
    maxWidth: "80%",
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26387C",
    marginBottom: 15,
  },
  smileysContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "80%",
  },

  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
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
  personnalizeContainer: {
    backgroundColor: "rgba(31,198,213,0.2)",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
  },
  personnalizeTextContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  personnalizeTitle: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    marginBottom: 5,
  },
  personnalizeText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },

  sectionRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 30,
  },
  circleNumber: {
    backgroundColor: "#1FC6D5",
    borderRadius: 999,
    width: 35,
    height: 35,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  indicatorItem: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    padding: 20,
    marginBottom: 12,
  },

  bottomButtonsContainer: {
    backgroundColor: "#fff",
    padding: 20,
  },
});
export default ChooseIndicatorOrder;
