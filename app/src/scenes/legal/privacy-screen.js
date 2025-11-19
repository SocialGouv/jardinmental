import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import LegalScreen from "./legal-screen";

const Privacy = ({ navigation }) => {
  const [isTracked, setIsTracked] = useState(true);

  const content = (
    <View>
      <Text style={styles.h1}>Politique de confidentialité de l’application mobile Jardin mental</Text>
      <Text style={styles.h2}>Qui est responsable de Jardin mental ?</Text>
      <Text style={styles.default}>
        L’application mobile « Jardin mental » est à l'initiative de la Caisse nationale de l’Assurance Maladie (CNAM). L'objectif de l’application
        vise à accompagner les personnes qui le souhaitent à mieux connaître leur santé mentale et suivre leurs symptômes, leurs ressentis, leurs
        comportements, leurs pensées, ou toute activité personnalisée, leur permettant ainsi de faciliter leur accompagnement psychologique, notamment
        par un professionnel de santé.
      </Text>
      <Text style={styles.h2}>Pourquoi traitons-nous des données à caractère personnel ?</Text>
      <Text style={styles.default}>L’application mobile Jardin mental traite des données à caractère personnel pour les raisons suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          Permettre aux utilisateurs de l’application de contacter l’équipe de Jardin Mental pour proposer des améliorations sur l’application mobile.
        </Text>
      </Li>
      <Text style={styles.h2}>Quelles sont les données à caractère personnel que nous traitons ?</Text>
      <Text style={styles.default}>L’application mobile Jardin mental traite les données suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          <Text style={styles.bold}>Données relatives aux utilisateurs qui contactent l’équipe de Jardin Mental</Text> : nom, prénom, adresse
          courriel. La communication de ces données est une simple faculté proposée aux seuls utilisateurs qui veulent faire un retour pour améliorer
          l’application.
        </Text>
      </Li>
      <Text style={styles.h2}>Qu'est-ce qui nous autorise à traiter des données à caractère personnel ?</Text>
      <Text style={styles.default}>L’application mobile Jardin mental traite des données à caractère personnel en se basant sur :</Text>
      <Li>
        <Text style={styles.default}>
          L'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable de traitement au
          sens de l'article 6-1 e) du RGPD.
        </Text>
      </Li>
      <Text style={styles.default}>
        Cette mission d'intérêt public se traduit en pratique par les articles L. 221-1 à L. 221-5 du code de la sécurité sociale.
      </Text>
      <Text style={styles.h2}>Pendant combien de temps conservons-nous ces données ?</Text>
      <DataTable />
      <View style={styles.break} />
      <Text style={styles.h2}>Quels sont vos droits ?</Text>
      <Text style={styles.default}>Vous disposez :</Text>
      <Li>
        <Text style={styles.default}>D'un droit d'information et droit d'accès ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>D'un droit de rectification ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>D'un droit d'opposition ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>D'un droit à la limitation du traitement.</Text>
      </Li>
      <View style={styles.break} />
      <Text style={styles.default}>
        Pour les exercer, contactez-nous par voie électronique :<Text style={styles.link}> jardinmental@fabrique.social.gouv.fr</Text>
      </Text>
      <Text style={styles.default}>Par voie postale :</Text>
      <Text style={styles.default}>Caisse nationale de l’assurance maladie</Text>
      <Text style={styles.default}>26-50 Immeuble Frontalis</Text>
      <Text style={styles.default}>50 avenue du Pr-André-Lemierre</Text>
      <Text style={styles.default}>75986 Paris Cedex 20</Text>
      <Text style={styles.default}>France</Text>
      <View style={styles.break} />
      <Text style={styles.default}>
        Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous identifier. Dans le cas où nous
        ne parvenons pas à vous identifier, nous pouvons être amenés à vous demander une preuve de votre identité.
      </Text>
      <Text style={styles.default}>
        Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la CNIL ici :
        <TouchableOpacity onPress={() => Linking.openURL("https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces")}>
          <Text style={styles.link}> https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces</Text>
        </TouchableOpacity>
      </Text>
      <Text style={styles.default}>
        Nous nous engageons à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre demande.
      </Text>
      <Text style={styles.h2}>Qui va avoir accès à ces données ?</Text>
      <Text style={styles.default}>
        Les accès aux données sont strictement encadrés et juridiquement justifiés. Les personnes suivantes vont avoir accès aux données :
      </Text>
      <Li>
        <Text style={styles.default}>Les membres habilités de l’équipe Jardin Mental.</Text>
      </Li>
      <Text style={styles.h2}>Qui nous aide à traiter les données à caractère personnel ?</Text>
      <ConservationTable />
      <View style={styles.break} />
      <Text style={styles.h2}>Témoins de connexion et traceurs</Text>
      <Text style={styles.default}>
        Un témoin de connexion ou traceur est un fichier déposé sur votre appareil lorsque vous accédez à l’application pour collecter certaines
        informations. Sur l'application mobile Jardin Mental, des traceurs de mesure d'audience sont déposés mais ne nécessitent pas votre
        consentement conformément aux recommandations de la CNIL. Nous utilisons la solution « Matomo » configurée en mode exempté.
      </Text>
      <Text style={styles.default}>Pour aller plus loin, vous pouvez consulter les fiches proposées par la CNIL :</Text>
      <TouchableOpacity onPress={() => Linking.openURL("https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi")}>
        <Text style={styles.link}>Cookies & traceurs : que dit la loi ?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL("https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser")}>
        <Text style={styles.link}>Cookies : les outils pour les maîtriser</Text>
      </TouchableOpacity>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Politique de confidentialité" content={content} />;
};

const ConservationTable = () => {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Sous-traitant</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Pays destinataire</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Traitement réalisé</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Garanties</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>OVH SAS France</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>France</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Hébergement des données</Text>
        </View>
        <View style={styles.tableCol}>
          <TouchableOpacity onPress={() => Linking.openURL("https://us.ovhcloud.com/legal/data-processing-agreement/")}>
            <Text style={styles.link}>https://us.ovhcloud.com/legal/data-processing-agreement/</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Positive Group France SAS (Sarbacane)</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>France</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>
            Solution utilisée lorsque l'utilisateur choisit d'envoyer par courriel un récapitulatif de ses données à la personne de son choix
          </Text>
        </View>
        <View style={styles.tableCol}>
          <TouchableOpacity onPress={() => Linking.openURL("https://assets.sarbacane-cdn.com/legal/FR_DataProcessingAddendum.pdf")}>
            <Text style={styles.link}>https://assets.sarbacane-cdn.com/legal/FR_DataProcessingAddendum.pdf</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    display: "flex",
    borderWidth: 1,
    borderColor: colors.BLUE,
  },
  tableHeader: {
    backgroundColor: "#dedede",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCol: {
    padding: 5,
    flex: 1,
    borderColor: colors.BLUE,
    borderWidth: 1,
    alignItems: "center",
  },
  center: {
    textAlign: "center",
  },
  //Article x - Titre
  h1: {
    color: colors.DARK_BLUE,
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },

  // x.y - Sous titre
  h2: {
    color: colors.DARK_BLUE,
    fontSize: 17,
    marginVertical: 8,
    fontWeight: "bold",
  },

  // A - Paragraphe
  h3: {
    color: colors.DARK_BLUE,
    fontSize: 15,
    marginVertical: 8,
  },

  // corps de texte
  default: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    marginVertical: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },

  li: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 20,
  },
  dotLi: {
    paddingTop: 8,
    marginRight: 10,
  },
  link: {
    color: colors.LIGHT_BLUE,
    textDecorationLine: "underline",
  },
  break: {
    height: 20,
  },
});

const DataTable = () => {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Catégories de données</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Durée de conservation</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Données relatives aux usagers du service</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>1 an à compter de la dernière proposition d'amélioration de l'application mobile</Text>
        </View>
      </View>
    </View>
  );
};

const Li = ({ children, dot = "-" }) => (
  <View style={styles.li}>
    <Text style={styles.dotLi}>{dot}</Text>
    {children}
  </View>
);

export default Privacy;
