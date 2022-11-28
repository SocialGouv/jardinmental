import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";

import BackButton from "../../../components/BackButton";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import Text from "../../../components/MyText";
import CircledIcon from "../../../components/CircledIcon";
import { answers } from "../../survey/utils";
import YesNoIndicator from "../../../components/YesNoIndicator";
import { RadioButton } from "react-native-paper";
const screenWidth = Dimensions.get("window").width;

const ChooseIndicatorOrder = ({ navigation, route }) => {
  const [indicatorDirection, setIndicatorDirection] = useState(0); // 0 : first direction (green to red) ; 1 : second direction (red to green)

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

          <RenderCurrentIndicator
            indicatorType={route.params.indicatorType}
            itensity
            direction={indicatorDirection}
            size={screenWidth * 0.1}
          />
        </View>

        <Text style={styles.subtitle}>
          Vous pouvez choisir le sens d’évaluation qui correspond à votre indicateur
        </Text>

        <TouchableOpacity
          style={[
            styles.setDirectionContainer,
            indicatorDirection === 0 && styles.activeSetDirectionContainer,
          ]}
          onPress={() => setIndicatorDirection(0)}
        >
          <RadioButton
            status={indicatorDirection === 0 ? "checked" : "unchecked"}
            onPress={() => setIndicatorDirection(0)}
          />

          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={0} />
            <Text style={styles.setDirectionTitle}>
              {renderSetDirectionTitle(route.params.indicatorType)[0]}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.setDirectionContainer,
            indicatorDirection === 1 && styles.activeSetDirectionContainer,
          ]}
          onPress={() => setIndicatorDirection(1)}
        >
          <RadioButton
            status={indicatorDirection === 1 ? "checked" : "unchecked"}
            onPress={() => setIndicatorDirection(1)}
          />

          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={1} />
            <Text style={styles.setDirectionTitle}>
              {renderSetDirectionTitle(route.params.indicatorType)[1]}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* TODO: add navigation */}
      <View style={styles.bottomButtonsContainer}>
        <Button
          buttonStyle={{ backgroundColor: "#1FC6D5", marginBottom: 20 }}
          textStyle={{ color: "white", textAlign: "center" }}
          onPress={() => {}}
          title="Créer mon indicateur"
        />
      </View>
    </SafeAreaView>
  );
};

const renderSetDirectionTitle = (indicatorType) => {
  switch (indicatorType) {
    case "smileys":
      return { 0: "Évaluer du positif vers le négatif", 1: "Évaluer du négatif vers le positif" };

    case "gauge":
      return { 0: "Évaluer du positif vers le négatif", 1: "Évaluer du négatif vers le positif" };

    case "yesno":
      return { 0: "Le non est négatif, le oui est positif", 1: "Le non est positif, le oui est négatif" };

    default:
      break;
  }
};

const RenderCurrentIndicator = ({ indicatorType, itensity, direction = 0, size = "small" }) => {
  switch (indicatorType) {
    case "smileys":
      const answerDirection = direction === 0 ? answers.slice().reverse() : answers;
      return (
        <>
          <View style={styles.smileysContainer}>
            {answerDirection.map((answer) => (
              <View key={answer.score} style={{}}>
                <CircledIcon
                  color={answer.backgroundColor}
                  borderColor={answer.borderColor}
                  iconColor={answer.iconColor}
                  icon={answer.icon}
                  iconContainerStyle={{ marginRight: 0 }}
                  iconWidth={size === "small" ? 32 : size}
                  iconHeight={size === "small" ? 32 : size}
                />
              </View>
            ))}
          </View>
          {itensity && <Intensity />}
        </>
      );

    case "gauge":
      return (
        <>
          {/* TODO: add gauge */}
          {itensity && <Intensity />}
        </>
      );

    case "yesno":
      return (
        <>
          {direction === 0 ? (
            <YesNoIndicator no={"red"} yes={"green"} />
          ) : (
            <YesNoIndicator no={"green"} yes={"red"} />
          )}
        </>
      );

    default:
      return <></>;
  }
};

const Intensity = () => (
  <View style={styles.intensityContainer}>
    <View style={styles.intenstiyDiamond} />
    <View style={styles.intensityLine} />
    <Text style={styles.intensityText}>intensité</Text>
    <View style={styles.intensityLine} />
    <View style={styles.intenstiyArrow} />
  </View>
);

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
    marginTop: 20,
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
  setDirectionContainer: {
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
  activeSetDirectionContainer: {
    borderColor: "#1FC6D5",
    backgroundColor: "#F4FCFD",
  },
  setDirectionInside: {
    flex: 1,
    maxWidth: "80%",
  },
  setDirectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26387C",
    marginTop: 15,
  },
  smileysContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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

  bottomButtonsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
export default ChooseIndicatorOrder;
