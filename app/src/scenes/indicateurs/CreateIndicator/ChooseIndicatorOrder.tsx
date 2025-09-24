import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Text } from "react-native";

import { colors } from "../../../utils/colors";

import CircledIcon, { BasicIcon } from "../../../components/CircledIcon";
import { answers } from "../../survey-v2/utils";
import Gauge from "../../../components/gauge";
const screenWidth = Dimensions.get("window").width;
import localStorage from "../../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import { Screen } from "../../../components/Screen";
import { Button2 } from "../../../components/Button2";
import { CATEGORIES, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { Boolean } from "@/components/survey/Boolean";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { SelectionnableRadioItem } from "@/components/SelectionnableItem";
import JMButton from "@/components/JMButton";
import { INDICATOR_ORDER } from "@/entities/IndicatorOrder";
import type { INDICATOR_TYPE } from "@/entities/IndicatorType";
import logEvents from "@/services/logEvents";
import { INDICATOR_CATEGORIES_DATA } from "@/scenes/onboarding-v2/data/helperData";

const ChooseIndicatorOrder = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      indicatorCategory: NEW_INDICATORS_CATEGORIES;
      indicatorType: INDICATOR_TYPE;
      nameNewIndicator: string;
    };
  };
}) => {
  const [indicatorDirection, setIndicatorDirection] = useState<INDICATOR_ORDER>(); // ASC : first direction (red to green) ; DESC : second direction (green to red)
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
      isCustom: true,
      newCategories: [route.params.indicatorCategory],
      mainCategory: route.params.indicatorCategory,
      version: 3,
    });
    logEvents.logCreatePersonnalizedIndicator(INDICATOR_CATEGORIES_DATA[route.params.indicatorCategory].matomoId);

    setLoading(false);
    navigation.navigate("symptoms");
  };

  return (
    <AnimatedHeaderScrollScreen
      title={"Créer un indicateur"}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      bottomComponent={
        <View className="mx-4">
          <JMButton
            disabled={!indicatorDirection}
            // textStyle={{ color: 'white', textAlign: 'center' }}
            onPress={onValidate}
            title="Valider"
          />
        </View>
      }
      navigation={navigation}
    >
      <View className="flex-1 mx-4">
        <View className={mergeClassNames("border rounded-xl bg-white p-4 w-full mb-4 mt-4 border-cnam-primary-800")}>
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700 h-5 mb-4")}>{route.params.nameNewIndicator}</Text>
          <RenderCurrentIndicator indicatorType={route.params.indicatorType} itensity direction={indicatorDirection} size={screenWidth * 0.1} />
        </View>

        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 my-8")}>
          Vous pouvez choisir le sens d’évaluation qui correspond à votre indicateur
        </Text>

        <SelectionnableRadioItem
          text={renderSetDirectionTitle(route.params.indicatorType)?.ASC}
          selected={indicatorDirection === INDICATOR_ORDER.ASC}
          onPress={() => setIndicatorDirection(INDICATOR_ORDER.ASC)}
        >
          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={INDICATOR_ORDER.ASC} />
          </View>
        </SelectionnableRadioItem>

        <SelectionnableRadioItem
          selected={indicatorDirection === INDICATOR_ORDER.DESC}
          text={renderSetDirectionTitle(route.params.indicatorType).DESC}
          onPress={() => setIndicatorDirection(INDICATOR_ORDER.DESC)}
        >
          <View style={styles.setDirectionInside}>
            <RenderCurrentIndicator indicatorType={route.params.indicatorType} direction={INDICATOR_ORDER.DESC} />
          </View>
        </SelectionnableRadioItem>
      </View>
    </AnimatedHeaderScrollScreen>
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
                <BasicIcon
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
      return (
        <>
          <Boolean indicator={{ order: direction }} value={undefined} onChange={undefined} disabled={true} />
        </>
      );

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
