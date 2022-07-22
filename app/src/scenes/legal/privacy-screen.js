import React from "react";
import LegalScreen from "./legal-screen";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const Privacy = ({ navigation }) => {
  const content = (
    <View>
      <Text style={styles.h2}>Traitement des données à caractère personnel</Text>
      <Text style={styles.default}>
        La présente application Jardin Mental est à l'initiative de la Direction Générale de la Santé au sein
        de la Fabrique numérique des ministères sociaux.
      </Text>
      <Text style={styles.h2}>Finalité </Text>
      <Text style={styles.default}>
        L'application «&nbsp;Jardin Mental&nbsp;» vise à accompagner les personnes qui le souhaitent à mieux
        connaître et suivre leurs symptômes, leurs ressentis ou toute activité personnalisée, leur permettant
        de faciliter leur accompagnement psychologique. L'application permet notamment&nbsp;:
      </Text>
      <Li>
        <Text style={styles.default}>La saisie et l'évaluation de données via un questionnaire&nbsp;;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>La saisie de notes libres&nbsp;;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          L'envoi de données saisies par mail à toute personne choisie par l'utilisateur.
        </Text>
      </Li>
      <Text style={styles.h2}>Données à caractère personnel traitées</Text>
      <Text style={styles.default}>Peuvent être traitées les données suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          Données de contact (adresse e-mail et numéro de téléphone)&nbsp;;{" "}
          <Text style={styles.bold}>
            La communication de ces données est une simple possibilité proposée pour l'amélioration de
            l'application.
          </Text>
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          Données de connexion (et notamment, les identifiants de connexion, nature des opérations, date et
          heure de l'opération)&nbsp;;
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>Cookies.</Text>
      </Li>
      <Text style={[styles.default, styles.bold]}>
        Les données relatives aux notes libres et au suivi sont conservées sur le terminal de l'utilisateur et
        ne sont pas transférées à l'équipe Jardin Mental, à la Fabrique numérique des ministères sociaux ou à
        la Direction Générale de la Santé.
      </Text>
      <Text style={styles.h2}>Base juridique du traitement de données</Text>
      <Text style={styles.default}>
        Les données traitées à l'occasion de ces traitements ont plusieurs fondements juridiques&nbsp;:
      </Text>
      <Li>
        <Text style={styles.default}>
          L'obligation légale à laquelle est soumise le responsable de traitements au sens de l'article 6-c du
          RGPD&nbsp;;
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          L'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est
          investi le responsable de traitement au sens de l'article 6-e du RPGD&nbsp;;
        </Text>
      </Li>
      <Text style={[styles.default, styles.bold]}>Ces fondements sont précisés ci-dessous&nbsp;:</Text>
      <Li dot={<Text style={[styles.default, styles.bold]}>a.</Text>}>
        <Text style={[styles.default, styles.bold]}>Données de contact</Text>
      </Li>
      <Text style={styles.default}>
        Ce traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de
        l'autorité publique dont est investi le responsable de traitement au sens de l'article 6-e du
        règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection
        des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre
        circulation de ces données.
      </Text>
      <Li dot={<Text style={[styles.default, styles.bold]}>b.</Text>}>
        <Text style={[styles.default, styles.bold]}>Données de connexion</Text>
      </Li>
      <Text style={styles.default}>
        Ce traitement est nécessaire au respect d'une obligation légale à laquelle le responsable de
        traitement est soumis au sens de l'article 6-c du Règlement (UE) 2016/679 du Parlement européen et du
        Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des
        données à caractère personnel et à la libre circulation de ces données.
      </Text>
      <Text style={styles.default}>
        L'obligation légale est posée par la loi LCEN n° 2004-575 du 21 juin 2004 pour la confiance dans
        l'économie numérique et par l'article 1 du décret n°2021-1363 portant injonction, au regard de la
        menace grave et actuelle contre la sécurité nationale, de conservation pour une durée d'un an de
        certaines catégories de données de connexion.
      </Text>
      <Li dot={<Text style={[styles.default, styles.bold]}>c.</Text>}>
        <Text style={[styles.default, styles.bold]}>Cookies</Text>
      </Li>
      <Text style={styles.default}>
        En application de l'article 5(3) de la directive 2002/58/CE modifiée concernant le traitement des
        données à caractère personnel et la protection de la vie privée dans le secteur des communications
        électroniques, transposée à l'article 82 de la loi n°78-17 du 6 janvier 1978 relative à
        l'informatique, aux fichiers et aux libertés, les traceurs ou cookies suivent deux régimes distincts.
      </Text>
      <Text style={styles.default}>
        Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter la
        communication par voie électronique sont dispensés de consentement préalable au titre de l'article 82
        de la loi n°78-17 du 6 janvier 1978.
      </Text>
      <Text style={styles.default}>
        Les cookies n'étant pas strictement nécessaires au service ou n'ayant pas pour finalité exclusive de
        faciliter la communication par voie électronique doivent être consenti par l'utilisateur.
      </Text>
      <Text style={styles.default}>
        Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques constitue une
        base légale au sens du RGPD et doit être entendu au sens de l'article 6-a du Règlement (UE) 2016/679
        du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à
        l'égard du traitement des données à caractère personnel et à la libre circulation de ces données.
      </Text>
      <Text style={styles.h2}>Durée de conservation</Text>
      <ConservationTable />
      <Text style={styles.h2}>Droit des personnes concernées</Text>
      <Text style={styles.default}>
        Vous disposez des droits suivants concernant vos données à caractère personnel :
      </Text>
      <Li>
        <Text style={styles.default}>Droit d'information et droit d'accès des données&nbsp;;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          Droit de rectification et le cas échéant de suppression des données&nbsp;;
        </Text>
      </Li>
      <Text style={styles.default}>
        Pour les exercer, faites-nous parvenir une demande en précisant la date et l'heure précise de la
        requête - ces éléments sont indispensables pour nous permettre de retrouver votre recherche&nbsp;:
      </Text>
      <Li>
        <Text style={styles.default}>
          par voie électronique à l'adresse suivante :{"\n"}
          monsuivipsy@fabrique.social.gouv.fr
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          par voie postale&nbsp;:{"\n"}Fabrique numérique des ministères sociaux
          {"\n"}Ministère des solidarités et de la santé{"\n"}39-43 Quai André Citroën{"\n"}75015 PARIS
        </Text>
      </Li>
      <Text style={styles.default}>
        En raison de l'obligation de sécurité et de confidentialité dans le traitement des données à caractère
        personnel qui incombe au responsable de traitement, votre demande ne sera traitée que si vous apportez
        la preuve de votre identité.
      </Text>
      <Text style={styles.default}>
        Pour vous aider dans votre démarche, vous trouverez ici
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces")}
        >
          <Text style={styles.link}>https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces</Text>
        </TouchableOpacity>{" "}
        un modèle de courrier élaboré par la Cnil.
      </Text>
      <Text style={styles.default}>Nous nous engageons à ne jamais céder ces informations à des tiers.</Text>
      <Text style={styles.h2}>Délais de réponse</Text>
      <Text style={styles.default}>
        Le responsable de traitement s'engage à répondre dans un délai raisonnable qui ne saurait dépasser 1
        mois à compter de la réception de votre demande.
      </Text>
      <Text style={styles.h2}>Destinataires des données</Text>
      <Text style={styles.default}>
        Le responsable de traitement s'engage à ce que les données à caractères personnels soient traitées par
        les seules personnes autorisées.
      </Text>
      <Text style={styles.h2}>Sous-traitants</Text>
      <Li>
        <Text style={styles.default}>
          <Text style={styles.bold}>Microsoft Azure</Text>, France{"\n"}
          <Text style={styles.italic}>Hébergement de l’application</Text>
          {"\n"}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://privacy.microsoft.com/fr-fr/privacystatement")}
          >
            <Text style={styles.link}>https://privacy.microsoft.com/fr-fr/privacystatement</Text>
          </TouchableOpacity>
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          <Text style={styles.bold}>Tipimail</Text>, France{"\n"}
          <Text style={styles.italic}>API d'envoi de mails</Text>
          {"\n"}
          <TouchableOpacity onPress={() => Linking.openURL("https://fr.tipimail.com/rgpd")}>
            <Text style={styles.link}>https://fr.tipimail.com/rgpd</Text>
          </TouchableOpacity>
        </Text>
      </Li>
      <Text style={styles.default}>
        Certaines des données sont envoyées à des sous-traitants pour réaliser certaines missions. Le
        responsable de traitement s'est assuré de la mise en œuvre par ses sous-traitants de garanties
        adéquates et du respect de conditions strictes de confidentialité, d'usage et de protection des
        données.
      </Text>
      <Text style={styles.h2}>Sécurité et confidentialité des données</Text>
      <Text style={styles.default}>
        Le responsable de traitements ne conserve pas de données à caractère personnel sur le réseau. Elles
        sont conservées sur la machine locale de l'utilisateur. Dès lors il en a la maîtrise, et est le seul à
        même d'en garantir la sécurité et confidentialité.
      </Text>
      <Text style={styles.h1}>Utilisation de témoins de connexion («&nbsp;cookies&nbsp;»)</Text>
      <Text style={styles.default}>
        Un cookie est un fichier déposé sur votre terminal lors de la visite d'une application. Il a pour but
        de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à
        votre terminal (ordinateur, mobile ou tablette).
      </Text>
      <Text style={styles.default}>
        Nous collectons donc des données par l'intermédiaire de dispositifs appelés «&nbsp;cookies&nbsp;»
        permettant d'établir des mesures statistiques.
      </Text>
      <Text style={styles.default}>
        L'application dépose des cookies de mesure d'audience (nombre de visites, pages consultées),
        respectant les conditions d'exemption du consentement de l'internaute définies par la recommandation
        «&nbsp;Cookies&nbsp;» de la Commission nationale informatique et libertés (CNIL).
      </Text>
      <Text style={styles.default}>
        <Text style={styles.bold}>Nous utilisons pour cela Matomo</Text>, un outil de mesure d'audience web
        libre, paramétré pour être en conformité avec la recommandation «&nbsp;Cookies&nbsp;» de la CNIL. Cela
        signifie que votre adresse IP, par exemple, est anonymisée avant d'être enregistrée. Il est donc
        impossible d'associer vos visites sur ce cette application à votre personne.
      </Text>
      <Text style={styles.default}>
        Les données anonymisées issues de Matomo sont exportées vers un Metabase auquel aura accès l'équipe de
        Jardin Mental.
      </Text>
      <Text style={styles.default}>Il convient d'indiquer que :</Text>
      <Li>
        <Text style={styles.default}>
          Les données collectées ne sont pas recoupées avec d'autres traitements.
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          Les cookies ne permettent pas de suivre la navigation de l'internaute sur d'autres sites.
        </Text>
      </Li>
      <Text style={styles.h2}>[BOUTON MODIFIER LES REGLAGES]</Text>
      <Text style={styles.default}>
        À tout moment, vous pouvez refuser l'utilisation des cookies et désactiver le dépôt sur votre
        ordinateur en utilisant la fonction dédiée de votre navigateur (fonction disponible notamment sur
        Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari et Opera).
      </Text>
      <Text style={styles.default}>
        Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale de
        l'Informatique et des Libertés (CNIL) :
      </Text>
      <Li>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi")}
        >
          <Text style={[styles.default, styles.link]}>Cookies &amp; traceurs : que dit la loi ?</Text>
        </TouchableOpacity>
      </Li>
      <Li>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser")}
        >
          <Text style={[styles.default, styles.link]}>Cookies : les outils pour les maîtriser</Text>
        </TouchableOpacity>
      </Li>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Politique de confidentialité" content={content} />;
};

const Li = ({ children, dot = "-" }) => (
  <View style={styles.li}>
    <Text style={styles.dotLi}>{dot}</Text>
    {children}
  </View>
);

const ConservationTable = () => {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Type de données</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.center, styles.bold]}>Durée de conservation</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Données de contact</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>
            <Text style={styles.bold}>Dans un délai de 3 ans</Text> à compter de la dernière utilisation.
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>
            Données relatives aux notes libres et à l'évolution des symptômes
            <Text style={styles.bold}>
              (stockées sur le terminal de l'utilisateur sans aucun autre accès possible)
            </Text>
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.default, styles.bold]}>Dès la suppression par la personne concernée</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Données d'hébergeur </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>
            <Text style={styles.bold}>1 an</Text>, conformément au décret n°2021-1363 du 20 octobre 2021.
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Cookies</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>
            <Text style={styles.bold}>Dans un délai de 13 mois</Text>, conformément aux recommandations de la
            CNIL
          </Text>
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
});

export default Privacy;
