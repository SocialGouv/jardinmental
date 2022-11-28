import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";

import BackButton from "../../../components/BackButton";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import Text from "../../../components/MyText";
import ArrowRightSvg from "../../../../assets/svg/arrow-right";
import CircledIcon from "../../../components/CircledIcon";
import { answers } from "../../survey/utils";
import YesNoIndicator from "../../../components/YesNoIndicator";

const ChooseIndicatorType = ({ navigation, route }) => {
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
        <Text style={styles.title}>Comment souhaitez-vous évaluer votre indicateur ?</Text>
        <Text style={styles.subtitle}>Choisissez parmi les 3 critères d’évaluation suivants</Text>

        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "smileys",
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
          <ArrowRightSvg color="#26387C" style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "gauge",
            });
          }}
        >
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>Avec une jauge</Text>
          </View>
          <ArrowRightSvg color="#26387C" style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeContainer}
          onPress={() => {
            navigation.push("CHOOSE_INDICATOR_ORDER", {
              nameNewIndicator: route.params.nameNewIndicator,
              indicatorType: "yesno",
            });
          }}
        >
          <View style={styles.typeInside}>
            <Text style={styles.typeTitle}>En répondant par Oui ou Non</Text>
            <YesNoIndicator no={"green"} yes={"red"} />
          </View>
          <ArrowRightSvg color="#26387C" style={{ marginLeft: 20 }} />
        </TouchableOpacity>
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
});
export default ChooseIndicatorType;
