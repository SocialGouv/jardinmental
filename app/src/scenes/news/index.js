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

export const LAST_NOTES_VERSION = "1.38";

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
        <Card title="Objectifs" version="v1.38" date="12/2022">
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant choisir des objectifs parmi des exemples, en supprimer ou modifier leur
              ordre dans votre questionnaire.
            </Text>
          </Item>
        </Card>
        <Card
          title="Nouvelle fonction : les objectifs et choix de l’organisation de son questionnaire"
          version="v1.37"
          date="11/2022"
        >
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>Fixez-vous des objectifs !</Text>
              {"\n"}Vous pouvez maintenant suivre des objectifs, choisir les jours où vous devez les réaliser
              et programmer un rappel pour chacun d’entre eux afin de ne pas les oublier !{"\n"}Vous trouverez
              des exemples d’objectifs à suivre dans le menu des réglages puis “personnaliser mes objectifs”,
              et vous pouvez même créer les vôtres.
              {"\n\n"}Vous retrouverez vos objectifs dans votre questionnaire quotidien, il vous suffit de les
              cocher pour dire s’ils ont été réalises (ou décochés si ce n’est pas le cas)
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              <Text style={styles.bold}>Réorganisez l’ordre de votre questionnaire quotidien</Text>
              {"\n"}Pour cela, allez dans le menu des réglages puis “personnaliser mes indicateurs”. Maintenez
              appuyé sur l’indicateur de votre choix et déplacer le dans la liste et relâcher le pour modifier
              l’ordre de votre questionnaire.
            </Text>
          </Item>
        </Card>
        <Card title="Amélioration des notifications de rappel" version="v1.35" date="11/2022">
          <Item>
            <Text style={styles.text}>
              Le système de notifications de rappel à été amélioré ! Pensez à bien autoriser les notifications
              et les bannières de Jardin Mental dans les réglages de votre téléphone.
            </Text>
          </Item>
        </Card>
        <Card title="Amélioration de l'analyse et recommandation" version="v1.34" date="05/2022">
          <Item>
            <Text style={styles.text}>
              Recommander l’application Jardin Mental aux personnes de votre choix, directement à partir de
              votre téléphone, en cliquant sur le bouton «&nbsp;Recommander&nbsp;» du menu de l’application.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Mes Analyses&nbsp;:
              {"\n"}Utilisez le sélecteur de date pour retrouver rapidement la période qui vous intéresse. Si
              besoin, vous pouvez toujours sélectionner manuelle une date de début et une date de fin pour une
              période personnalisé. Les filtres par intensité ainsi que pour afficher vos prises de
              traitements sur vos frises sont maintenant accessibles via le bouton «&nbsp;filtres&nbsp;».
            </Text>
          </Item>
        </Card>
        <Card title="Amélioration du suivi de votre traitement." version="v1.26" date="05/2022">
          <Item>
            <Text style={styles.text}>
              Le questionnaire est simplifié pour renseigner rapidement vos prises de traitement de la
              journée, que vous pouvez maintenant suivre dans «&nbsp;Mes&nbsp;analyses&nbsp;»
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Dans votre questionnaire quotidien&nbsp;:
              {"\n"}•&nbsp;Vous pouvez maintenant directement répondre à la question «&nbsp;Avez-vous pris
              correctement votre traitement quotidien&nbsp;?&nbsp;» par «&nbsp;oui&nbsp;» si c’est le cas, ou
              «&nbsp;non&nbsp;» si vous l’avez pris partiellement voire complètement oublié.
              {"\n"}•&nbsp;Précisez si vous avez pris un «&nbsp;si besoin&nbsp;» (Les «&nbsp;si besoin&nbsp;»
              sont des médicaments que les médecins prescrivent au cas où, à prendre uniquement si le besoin
              s’en fait ressentir)
              {"\n"}•&nbsp;Optionnel : vous pouvez toujours renseigner le détails de vos prises, par
              médicament et dose prise sur la journée
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Dans «&nbsp;Mes analyses&nbsp;»&nbsp;:
              {"\n"}•&nbsp;Dans les «&nbsp;frises&nbsp;»&nbsp;: retrouvez vos prises de traitement en
              corrélation avec vos frises de suivi, en cliquant sur l’icône «&nbsp;traitements&nbsp;» dans les
              filtres, à côté des filtres par «&nbsp;emoji&nbsp;». Vous pouvez maintenant observer comment vos
              prises de traitement influent sur vos indicateurs
              {"\n"}•&nbsp;Dans les «&nbsp;Statistiques&nbsp;»&nbsp;: toujours sur la période de votre choix,
              retrouvez des statistiques sur l’observance de votre traitement, à la suite de vos indicateurs
            </Text>
          </Item>
        </Card>
        <Card
          title="Mon Suivi Psy change de présentation et vous propose de nouveaux exemples d’éléments à suivre dans votre questionnaire."
          version="v1.24"
          date="03/2022"
        >
          <Item>
            <Text style={styles.text}>
              Pour un parcours plus fluide et plus clair dans l’application, le menu de navigation a été
              modifié&nbsp;:
            </Text>
            <Text style={styles.text}>
              Vous retrouverez dans «&nbsp;Mes&nbsp;entrées&nbsp;»&nbsp;:
              {"\n"}•&nbsp;Le <Text style={styles.bold}>récapitulatif</Text> de vos questionnaires quotidiens
              {"\n"}•&nbsp;Vos <Text style={styles.bold}>notes personnelles</Text> (qui correspondent aux
              précisions et au contexte général que vous saisissez dans votre questionnaire)
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous retrouvez dans «&nbsp;Mes&nbsp;analyses&nbsp;» tous vos outils&nbsp;: frises, courbes,
              statistiques et analyses de notes
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous retrouverez dans «&nbsp;Beck&nbsp;» vos colonnes de Beck (un exercice sur les pensées
              automatiques qui surviennent à la suite d’un évènement), si vous travaillez avec dans le cadre
              de votre suivi, ou en autonomie.
            </Text>
          </Item>
          <Item>
            <Text style={[styles.text, styles.bold]}>
              N’oubliez pas de personnaliser votre questionnaire en allant dans les réglages de l’application
              et découvrez des nouveaux exemples pour vous aidez à trouver des éléments qui vous sont
              pertinents&nbsp;!
            </Text>
          </Item>
        </Card>
        <Card
          title="Nouvelle fonction de «&nbsp;Mon&nbsp;Suivi&nbsp;» : écran «&nbsp;Statistiques&nbsp;»"
          version="v1.23"
          date="03/2022"
        >
          <Item>
            <Text style={styles.text}>
              En naviguant avec les flèches en haut de l’écran de l’onglet «&nbsp;Mon&nbsp;Suivi&nbsp;», vous
              trouverez la nouvelle fonction «&nbsp;Statistiques&nbsp;».{"\n"}
            </Text>
            <Text style={styles.text}>
              Celle-ci vous permet de visualiser pour chaque élément de votre questionnaire et sur la période
              de votre choix&nbsp;:
              {"\n"}•&nbsp;<Text style={styles.bold}>Le niveau moyen</Text> de l’élément, représenté par
              l’émoticône correspondante.
              {"\n"}•&nbsp;Le détail des <Text style={styles.bold}>proportions en pourcentages</Text> et en
              nombre de jours pour chaque niveau atteint sur la période choisie.
              {"\n"}•&nbsp;La plus longue série de <Text style={styles.bold}>jours consécutifs</Text> pour
              chaque niveau. Le minimum étant de 2 jours d’affilée, un «&nbsp;0&nbsp;» est alors affiché s’il
              n’y a pas au moins 2 jours consécutifs au même niveau sur la période choisie.
            </Text>
          </Item>
        </Card>
        <Card
          title="Fonction «&nbsp;Évènements&nbsp;» dans «&nbsp;Mon&nbsp;Suivi&nbsp;» : identifiez les évènements qui influent sur vos ressentis"
          version="v1.22"
          date="03/2022"
        >
          <Item>
            <Text style={styles.text}>
              Sélectionnez un élément de votre questionnaire (par exemple votre humeur) ainsi que le niveau
              (par exemple l’émoticône vert foncé) et visualisez tous les évènements qui sont arrivés les
              jours où votre humeur était au plus haut.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Les évènements correspondent aux précisions (contexte de la journée et pour chaque élément) que
              vous renseignez dans le questionnaire de «&nbsp;Mon&nbsp;Etat&nbsp;»
            </Text>
          </Item>
        </Card>
        <Card
          title="Mon Suivi s'étoffe avec l'écran «&nbsp;Frises&nbsp;» et validez votre questionnaire à tout moment"
          version="v1.21"
          date="03/2022"
        >
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant valider votre questionnaire sans avoir renseigné tous ses éléments, ce
              qui vous permet de le remplir progressivement au cours de la journée.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Dans Mon Suivi, vous pouvez maintenant visualiser les variations des éléments de votre
              questionnaire sur la période de votre choix. Filtrez les emojis qui vous intéressent en cliquant
              sur ceux de votre choix, et comparez l’évolution de vos éléments entre eux.
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
