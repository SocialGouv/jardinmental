import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Linking } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import BackButton from "../../components/BackButton";
import NPS from "../../services/NPS/NPS";

export default ({ navigation }) => {
  const [NPSvisible, setNPSvisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <View style={styles.headerContainer}>
        <BackButton onPress={navigation.goBack} />
        <Image style={styles.image} source={require("../../../assets/imgs/logo2.png")} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>Pour plus d'informations rendez-vous sur notre site :</Text>
          <TouchableOpacity onPress={() => Linking.openURL("https://monsuivipsy.fabrique.social.gouv.fr/")}>
            <Text style={styles.link}>mateteetmoi.fr</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            Afin d'améliorer Ma Tête et Moi, nous serions ravis d'échanger avec vous :
          </Text>
          {/* // todo mailto */}
          <TouchableOpacity onPress={() => Linking.openURL("mailto:monsuivipsy@fabrique.social.gouv.fr")}>
            <Text style={styles.link}>monsuivipsy@fabrique.social.gouv.fr</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>Faites-nous part de vos remarques ou suggestions en</Text>
          <TouchableOpacity onPress={() => setNPSvisible(true)}>
            <Text style={styles.link}>évaluant Ma Tête et Moi</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.bottomNote}>
            Ma Tête et Moi est une application développée avec des professionnels de santé. Néanmoins, les
            entretiens proposés ont uniquement pour objectif d'améliorer l'application. Ils ne sauraient se
            substituer à une consultation.{"\n\n"}En cas d'urgence contactez le 15.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    padding: 20,
    fontSize: 18,
    marginVertical: 15,
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
  link: {
    color: colors.LIGHT_BLUE,
    textDecorationLine: "underline",
    fontSize: 18,
    textAlign: "center",
  },
  bottomNote: {
    color: "#878797",
    textAlign: "center",
  },
});
