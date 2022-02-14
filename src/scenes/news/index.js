import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, Image, View } from "react-native";

import { colors } from "../../utils/colors";
import BackButton from "../../components/BackButton";
import Card from "./card";
import Item from "./Item";
import Text from "../../components/MyText";
import localStorage from "../../utils/localStorage";

export const getBadgeNotesVersion = async () => {
  let lastNotesVersion = await localStorage.getNotesVersion();
  return lastNotesVersion !== LAST_NOTES_VERSION;
};

export const LAST_NOTES_VERSION = "1.20";

export default ({ navigation }) => {
  useEffect(() => {
    (async () => {
      await localStorage.setNotesVersion(LAST_NOTES_VERSION);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <BackButton onPress={navigation.goBack} />
        <Image style={styles.image} source={require("../../../assets/imgs/logo2.png")} />
      </View>
      <ScrollView style={styles.cgu} contentContainerStyle={styles.scrollContainer}>
        <Card
          title="L’écran du questionnaire de «&nbsp;Mon&nbsp;état&nbsp;» évolue et se simplifie"
          version="v1.20"
          date="02/2022"
        >
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant rajouter des précisions pour chaque élément de votre questionnaire.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Précisez le contexte général de votre journée à la suite du questionnaire.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Toutes vos précisions (par élément et pour le contexte général) se retrouvent dans
              «&nbsp;Mon&nbsp;Journal&nbsp;» sous forme de notes automatiques pour les relire plus facilement.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              En cliquant sur le lien{" "}
              <Text style={styles.bold}>«&nbsp;modifier&nbsp;mon&nbsp;questionnaire&nbsp;»</Text> en haut de
              l’écran, vous pouvez directement modifier votre questionnaire lorsque vous le remplissez. Cela
              vous permet de rajouter un élément personnalisé, ou bien d’arrêter de suivre un élément si vous
              ne le souhaitez plus voir apparaître dans votre questionnaire. Vous pourrez le réactiver plus
              tard si nécessaire.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Des nouveaux émojis font leur apparition, avec un état neutre (émoji jaune) et de nouvelles
              couleurs plus contrastées.
            </Text>
          </Item>
        </Card>
        <Card title="Menu de navigation à 4 boutons" version="v1.16" date="12/2021">
          <Item showDot={false}>
            <Text style={styles.text}>
              Dans le nouveau menu, vous retrouverez des fonctions que vous connaissez déja bien, ainsi qu'une
              nouvelle intitulée "Mon Journal" :
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>Mon Etat</Text>
              {"\n"}Remplissez votre questionnaire quotidien, avec les symptômes, les ressentis ou encore les
              activités que vous suivez ! Vous pouvez toujours saisir des notes pour y apporter quelques
              précisions, ainsi que le traitement pris dans votre journée.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>
                Mon Journal <Text style={styles.bold}>(nouveau)</Text>
              </Text>
              {"\n"}• Comme un véritable journal intime, vous pouvez créer autant de notes que vous le
              souhaitez, sans limitation de taille de texte.{"\n"}• N'hésitez pas à vous en servir pour
              décrire précisément un évènement qui vous a marqué, des pensées, ou tout ce que vous voulez !{" "}
              {"\n"}• Lorsque vous écrivez une nouvelle note, vous pouvez modifier la date et l'heure
              auxquelles se réfère la note. Très utile pour décrire un évènement passé mais que vous n'auriez
              pas eu le temps de noter par exemple.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>Exercice</Text>
              {"\n"}Retrouvez ici vos colonnes de Beck. Afin de réaliser cet exercice, il est nécessaire
              d'avoir eu au préalable des explications d'un thérapeute.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>Mon Suivi</Text>
              {"\n"}Retrouvez ici vos courbes de suivi classées par semaine, ainsi que le détail de votre
              journée en cliquant sur un point de la courbe.
            </Text>
          </Item>
        </Card>
        <Card title="Nouveau Questionnaire" version="v1.15" date="11/2021">
          <Item>
            <Text style={styles.text}>
              Le questionnaire quotidien personnalisé se simplifie ! Plus{" "}
              <Text style={styles.bold}>simple</Text>, plus <Text style={styles.bold}>rapide</Text> et plus{" "}
              <Text style={styles.bold}>facile</Text> à remplir.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous avez le choix entre <Text style={styles.bold}>5 niveaux</Text> différents pour chaque
              critère.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous avez toujours la possibilité de suivre vos <Text style={styles.bold}>ressentis</Text>, et
              vous pouvez maintenant :{"\n"}• suivre des <Text style={styles.bold}>critères positifs</Text>{" "}
              comme la motivation, le bien-être, la fierté …{"\n"}• suivre des{" "}
              <Text style={styles.bold}>activités</Text>
              («sortie avec mes amis », « activités quotidiennes » …)
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous pouvez toujours ajouter autant de critères à suivre que vous le souhaitez
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant suivre les critères sur les{" "}
              <Text style={styles.bold}>7 derniers jours</Text> (et non plus les 2 derniers jours)
            </Text>
          </Item>
        </Card>
        <Card title="Les colonnes de Beck !" version="v1.14" date="07/2021">
          <Item>
            <Text style={styles.text}>
              Apprenez à <Text style={styles.bold}>identifier</Text>,{" "}
              <Text style={styles.bold}>comprendre</Text> et <Text style={styles.bold}>gérer</Text> vos
              pensées et vos émotions au quotidien.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Cette nouvelle fonctionnalité vous permet de mieux identifer des{" "}
              <Text style={styles.bold}>situations</Text> et vos <Text style={styles.bold}>émotions</Text> qui
              en découlent.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Les colonnes de Beck sont activables/désactivables depuis les{" "}
              <Text style={styles.bold}>paramètres</Text>
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Pour <Text style={styles.bold}>créer de nouvelles colonnes de Beck</Text> (
              <Text style={styles.italic}>une fois la fonctionnalité activée</Text>
              ), cliquez sur le bouton <Text style={styles.bold}>+</Text> en bas de l'écran principal, et
              sélectionnez "Colonnes de Beck".
              {"\n"}
              Cliquez sur "Suivi des symptômes" pour renseigner vos ressentis.
            </Text>
          </Item>
        </Card>
        {/* <Card
          title="Mon Suivi Psy se refait une beauté !"
          version="v1.13"
          date="05/2021">
          <Item>
            <Text style={styles.text}>
              Le nouveau bouton en haut à gauche de votre écran ouvre un{' '}
              <Text style={styles.bold}>menu</Text>. Il vous permet de naviguer
              plus facilement entre tous les écrans secondaires de l'application
              Mon Suivi Psy.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Le nouveau bouton en haut à droite de votre écran ouvre les{' '}
              <Text style={styles.bold}>paramètres</Text>. Vous pouvez
              sélectionner vos symptômes, indiquer votre traitement
              médicamenteux si besoin, définir un rappel, etc.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant rentrer les{' '}
              <Text style={styles.bold}>traitements</Text> que vous prenez dans
              l’application. Tous les médicaments ne sont pas accessibles, vous
              pouvez nous informer si vous souhaitez ajouter le vôtre. Lors de
              l’export de vos données, les informations concernant vos prises de
              traitements médicamenteux seront aussi transmises, en bas des
              courbes de suivi des symptômes.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              La barre de navigation retrouve sa{' '}
              <Text style={styles.bold}>simplicité</Text>, avec un accès rapide
              à votre journal et à votre calendrier. Vous pouvez retrouver
              l'onglet <Text style={[styles.italic, styles.bold]}>Infos</Text>{' '}
              dans le menu (en haut à gauche de votre écran).
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              L'<Text style={styles.bold}>export</Text> de vos données est
              possible depuis le menu ainsi que depuis votre calendrier (le
              bouton d'export vient remplacer le bouton des réglages).
            </Text>
          </Item>
        </Card> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

  text: { color: "#333" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  safe: {
    flex: 1,
  },
  title: {
    color: colors.BLUE,
    fontSize: 20,
    padding: 20,
    fontWeight: "700",
  },
  cgu: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    color: colors.DARK_BLUE,
    padding: 10,
    fontSize: 16,
  },
  containerInfos: {
    backgroundColor: "rgba(38,56,124, 0.03)",
    borderRadius: 10,
    borderWidth: 0,
    paddingTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    display: "flex",
    flexDirection: "row",
  },
  titleInfos: {
    fontWeight: "bold",
    color: colors.BLUE,
    paddingBottom: 3,
  },
  textContainer: {
    width: "90%",
  },
  moreButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 10,
  },
  arrowUp: {
    borderRadius: 20,
    backgroundColor: "rgba(38,56,124, 0.03)",
    borderColor: "rgba(38,56,124, 0.08)",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 200,
  },
  fullScreenContainer: {
    backgroundColor: "rgba(38,56,124, 0.03)",
    // position: 'absolute',
    zIndex: 1,
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    padding: 25,
    display: "flex",
    flexDirection: "column",
  },
  explanation: {
    textAlign: "justify",
  },
  lessButton: {
    paddingBottom: 50,
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 10,
  },
  link: {
    color: colors.LIGHT_BLUE,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
