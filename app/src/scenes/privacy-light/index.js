import React from "react";
import { View, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import BackButton from "../../components/BackButton";
import Icon from "../../components/Icon";

export default ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <BackButton onPress={navigation.goBack} />
        {Platform.OS === "android" && <Image style={styles.image} source={require("../../../assets/imgs/logo2.png")} />}
        {Platform.OS === "ios" && <Image style={styles.image} className="rounded-lg" source={require("../../../assets/imgs/icon.png")} />}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Icon styleContainer={styles.iconContainer} icon="LockSvg" color="#d3d3e8" width={70} height={70} />
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            Les <Text style={styles.lightblue}>informations personnelles</Text> que je saisis dans Jardin Mental (ressentis, notes, traitements,
            exercices, ...) ne sont <Text style={styles.lightblue}>pas accessibles</Text> et ne peuvent{" "}
            <Text style={styles.lightblue}>pas être lues</Text> ou <Text style={styles.lightblue}>utilisées</Text>.
          </Text>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            <Text style={styles.lightblue}>Moi seul</Text> peux <Text style={styles.lightblue}>décider</Text> de les{" "}
            <Text style={styles.lightblue}>partager</Text> avec la fonction "<Text style={styles.lightblue}>exporter ses données</Text>".
          </Text>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            Dans le but d'<Text style={styles.lightblue}>améliorer</Text> l'application, seules des données{" "}
            <Text style={styles.lightblue}>anonymisées</Text> concernant la <Text style={styles.lightblue}>fréquence</Text> d'utilisation de
            l'application et de ses fonctionnalités sont <Text style={styles.lightblue}>recueillies</Text> par la Fabrique du Numérique des Ministères
            Sociaux.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 70,
    height: 70,
  },
  paragraph: {
    padding: 20,
    fontSize: 18,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  image: {
    height: 50,
    width: 50,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
    display: "flex",
    alignItems: "center",
  },
  standardText: {
    fontSize: 18,
    color: colors.DARK_BLUE,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});
