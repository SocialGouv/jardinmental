import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";

import { colors } from "../../../utils/colors";

import Text from "../../../components/MyText";
import CircledIcon from "../../../components/CircledIcon";
import { answers } from "../../survey-v2/utils";
import YesNoIndicator from "../../../components/YesNoIndicator";
import Gauge from "../../../components/gauge";
const screenWidth = Dimensions.get("window").width;
import localStorage from "../../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import { Screen } from "../../../components/Screen";
import { Button2 } from "../../../components/Button2";
import { CATEGORIES, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { INDICATOR_ORDER, INDICATOR_TYPE } from "@/entities/Indicator";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";

const ChooseIndicatorOrder = ({ navigation, route }: {
  navigation: any,
  route: {
    params: {
      indicatorCategory: NEW_INDICATORS_CATEGORIES,
      indicatorType: INDICATOR_TYPE,
      nameNewIndicator: string
    }
  }
}) => {
  const [indicatorDirection, setIndicatorDirection] = useState<INDICATOR_ORDER>(INDICATOR_ORDER.ASC); // ASC : first direction (red to green) ; DESC : second direction (green to red)
  const [loading, setLoading] = useState(false);

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);
    await localStorage.addIndicateur({
      uuid: uuidv4(),
      name: route.params?.nameNewIndicator,
      order: indicatorDirection,
      type: route.params?.indicatorType,
      active: true,
      position: 0,
      category: INDICATORS_CATEGORIES.Uncategorized, // no category from the previous existing category
      created_at: new Date(),
      isGeneric: false,
      newCategories: [route.params.indicatorCategory],
      mainCategory: route.params.indicatorCategory,
      version: 3,
    });

    setLoading(false);
    navigation.navigate("symptoms");
  };

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
      bottomChildren={<Button2 fill title="Créer mon indicateur" onPress={onValidate} loading={loading} />}
    >
      <View className="w-full">
        <View style={styles.topContainer}>
          <Text style={styles.topTitle}>{route.params.nameNewIndicator}</Text>
          <RenderCurrentIndicator indicatorType={route.params.indicatorType} itensity direction={indicatorDirection} size={screenWidth * 0.1} />
        </View>

        <Text style={styles.subtitle}>Vous pouvez choisir le sens d’évaluation qui correspond à votre indicateur</Text>

        <TouchableOpacity
          style={[
            styles.setDirectionContainer,
            indicatorDirection === INDICATOR_ORDER.ASC && styles.activeSetDirectionContainer,
          ]}
          onPress={() => setIndicatorDirection(INDICATOR_ORDER.ASC)}
        >
          {indicatorDirection === INDICATOR_ORDER.ASC ? (
            <View className="flex justify-center items-center w-4 h-4 border border-primary rounded-full">
              <View className="w-2 h-2 border border-primary bg-primary rounded-full" />
            </View>
          ) : (
            <View className="flex justify-center items-center w-4 h-4 border border-blue-800 rounded-full" />
          )}

          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={INDICATOR_ORDER.ASC} />
            <Text style={styles.setDirectionTitle}>
              {renderSetDirectionTitle(route.params.indicatorType)?.ASC}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.setDirectionContainer,
            indicatorDirection === "DESC" && styles.activeSetDirectionContainer,
          ]}
          onPress={() => setIndicatorDirection(INDICATOR_ORDER.DESC)}
        >
          {indicatorDirection === "DESC" ? (
            <View className="flex justify-center items-center w-4 h-4 border border-primary rounded-full">
              <View className="w-2 h-2 border border-primary bg-primary rounded-full" />
            </View>
          ) : (
            <View className="flex justify-center items-center w-4 h-4 border border-blue-800 rounded-full" />
          )}

          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={INDICATOR_ORDER.DESC} />
            <Text style={styles.setDirectionTitle}>
              {renderSetDirectionTitle(route.params.indicatorType).DESC}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const renderSetDirectionTitle = (indicatorType) => {
  switch (indicatorType) {
    case "smiley":
      return { DESC: "Évaluer du positif vers le négatif", ASC: "Évaluer du négatif vers le positif" };

    case "gauge":
      return { DESC: "Évaluer du positif vers le négatif", ASC: "Évaluer du négatif vers le positif" };

    case "boolean":
      return {
        ASC: "Le non est négatif, le oui est positif",
        DESC: "Le non est positif, le oui est négatif",
      };

    default:
      break;
  }
};

const RenderCurrentIndicator = ({ indicatorType, itensity, direction = "ASC", size = "small" }) => {
  switch (indicatorType) {
    case "smiley":
      const answerDirection = direction === "ASC" ? answers : answers.slice().reverse();
      return (
        <>
          <View className="w-full" style={styles.smileysContainer}>
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
      const reverse = direction === "DESC";
      return (
        <View className="w-full">
          <Gauge hideSlider defaultValue={1} reverse={reverse} />
          {itensity && <Intensity />}
        </View>
      );

    case "boolean":
      return <>{direction === "ASC" ? <YesNoIndicator no={"red"} yes={"green"} /> : <YesNoIndicator no={"green"} yes={"red"} />}</>;

    default:
      return <></>;
  }
};

const Intensity = () => (
  <View className="flex flex-row items-center mt-5">
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
    color: colors.BLUE,
    marginBottom: 15,
  },
  intensityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    overflow: "hidden",
  },
  intensityLine: {
    borderTopWidth: 1,
    borderStyle: "solid",
    flex: 1,
    height: 1,
  },
  intensityText: {
    marginHorizontal: 7,
    fontSize: 15,
    color: colors.BLUE,
  },
  intenstiyDiamond: {
    transform: [{ rotate: "45deg" }],
    backgroundColor: colors.BLUE,
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
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
  },
  setDirectionInside: {
    flex: 1,
    maxWidth: "80%",
  },
  setDirectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.BLUE,
    marginTop: 15,
  },
  smileysContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // width: "100%",
  },

  safe: {
    flex: 1,
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
