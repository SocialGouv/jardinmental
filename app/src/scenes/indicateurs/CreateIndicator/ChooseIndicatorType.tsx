import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { colors } from "../../../utils/colors";

import CircledIcon, { BasicIcon } from "../../../components/CircledIcon";
import { answers } from "../../survey-v2/utils";
import Gauge from "../../../components/gauge";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Boolean } from "@/components/survey/Boolean";
import JMButton from "@/components/JMButton";
import { SelectionnableRadioItem } from "@/components/SelectionnableItem";
import ChevronIcon from "@assets/svg/icon/chevron";
import { Typography } from "@/components/Typography";

const ChooseIndicatorType = ({ navigation, route }) => {
  const [indicatorType, setIndicatorType] = React.useState<"boolean" | "smiley" | "gauge">();

  return (
    <AnimatedHeaderScrollScreen
      title={""}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      headerLeftComponent={
        <TouchableOpacity
          onPress={async () => {
            navigation.goBack();
          }}
          className="flex-row space-x-2 items-center justify-center"
        >
          <ChevronIcon direction="left" color={TW_COLORS.CNAM_PRIMARY_25} />
          <Typography className="text-cnam-primary-25">Créer un indicateur personnalisé</Typography>
        </TouchableOpacity>
      }
      smallHeader={true}
      bottomComponent={
        <View className="px-4 bg-gray-50">
          <JMButton
            disabled={!indicatorType}
            // textStyle={{ color: 'white', textAlign: 'center' }}
            onPress={() => {
              navigation.push("CHOOSE_INDICATOR_ORDER", {
                nameNewIndicator: route.params.nameNewIndicator,
                indicatorType,
                indicatorCategory: route.params.indicatorCategory,
              });
            }}
            title="Valider"
          />
        </View>
      }
      navigation={navigation}
    >
      <View className="flex-1 mx-4">
        <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>
          Comment souhaitez-vous évaluer votre indicateur ?
        </Typography>
        <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mt-2 mb-8")}>
          Choisissez parmi les 3 critères d’évaluation suivants
        </Typography>
        <View className="w-full" style={styles.container}>
          <SelectionnableRadioItem
            text={"Avec une jauge"}
            selected={indicatorType === "gauge"}
            onPress={() => {
              setIndicatorType("gauge");
            }}
          >
            <View className="w-full">
              <Gauge hideSlider defaultValue={1} onChange={undefined} reverse={undefined} />
            </View>
          </SelectionnableRadioItem>
          <SelectionnableRadioItem
            selected={indicatorType === "smiley"}
            text={"Avec des smileys"}
            onPress={() => {
              setIndicatorType("smiley");
            }}
          >
            <View className="w-full ">
              <View className="gap-4 flex flex-row justify-center">
                {answers.map((answer) => (
                  <View key={answer.score} style={{}}>
                    <BasicIcon
                      color={answer.backgroundColor}
                      borderColor={TW_COLORS.PRIMARY}
                      iconColor={answer.iconColor}
                      icon={answer.icon}
                      borderWidth={0}
                      iconContainerStyle={{ marginRight: 0 }}
                      iconWidth={32}
                      iconHeight={32}
                    />
                  </View>
                ))}
              </View>
            </View>
          </SelectionnableRadioItem>
          <SelectionnableRadioItem
            selected={indicatorType === "boolean"}
            text={"En répondant par Oui ou Non"}
            onPress={() => {
              setIndicatorType("boolean");
            }}
          >
            <View style={styles.typeInside}>
              <Boolean
                disabled={true}
                indicator={{
                  order: "ASC",
                }}
                value={undefined}
                onChange={undefined}
              />
            </View>
          </SelectionnableRadioItem>
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
    // </Screen>
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
    fontFamily: "SourceSans3-Bold",
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
    fontFamily: "SourceSans3-Bold",
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
