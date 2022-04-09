import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import CircledIcon from "../../components/CircledIcon";
import { icons, colors as colorsFromConstant, iconBorderColors, iconColors } from "../../utils/constants";
import RoundButtonIcon from "../../components/RoundButtonIcon";

const NoData = () => {
  return (
    <View>
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
        {"Pour démarrer votre suivi, cliquez sur le bouton".split(" ").map((word, index) => (
          <Text key={index} style={styles.text}>
            {index > 0 ? " " : ""}
            {word}
          </Text>
        ))}
        <RoundButtonIcon
          backgroundColor="#E7F6F8"
          iconColor={colors.LIGHT_BLUE}
          borderWidth={0.5}
          borderColor={colors.LIGHT_BLUE}
          icon="plus"
          visible={true}
          medium
        />
        {"du jour que vous voulez renseigner".split(" ").map((word, index) => (
          <Text key={index} style={styles.text}>
            {index > 0 ? " " : ""}
            {word}
          </Text>
        ))}
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
  smileyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
    marginVertical: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});

export default NoData;
