import React from "react";
import LegalScreen from "./legal-screen";
import { StyleSheet, View, Linking, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const LegalMentions = ({ navigation }) => {
  const content = (
    <View>
      <Text style={styles.h1}>Editeur de l'application</Text>
      <Text style={styles.default}>
        L'application Jardin Mental est éditée par la Direction Générale de la Santé au sein de la Fabrique
        numérique des Ministères sociaux située&nbsp;:
      </Text>
      <Text style={styles.default}>
        Tour Mirabeau{"\n"}
        39-43 Quai André Citroën{"\n"}
        75015 PARIS{"\n"}
        Tél. : 01 40 56 60 00
      </Text>
      <Text style={styles.h1}>Directeur de la publication</Text>
      <Text style={styles.default}>Monsieur Jérôme SALOMON, Directeur général de la Santé</Text>
      <Text style={styles.h1}>Hébergement de l'application</Text>
      <Text style={styles.default}>
        Ce site est hébergé par Microsoft Azure France (région France centre) :
      </Text>
      <Text style={styles.default}>
        Microsoft France{"\n"}
        37 Quai du Président Roosevelt{"\n"}
        92130 ISSY-LES-MOULINEAUX
      </Text>
      <Text style={styles.h1}>Accessibilité</Text>
      <Text style={styles.default}>
        La conformité aux normes d'accessibilité numérique est un objectif ultérieur mais nous tâchons de
        rendre cette application accessible à toutes et à tous.
      </Text>
      <Text style={styles.h1}>Signaler un dysfonctionnement</Text>
      <Text style={styles.default}>
        Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une
        fonctionnalité de l'application, merci de nous en faire part. Si vous n'obtenez pas de réponse rapide
        de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au
        Défenseur des droits.
      </Text>
      <Text style={styles.h1}>En savoir plus</Text>
      <Text style={styles.default}>
        Pour en savoir plus sur la politique d'accessibilité numérique de l'État
        <TouchableOpacity
          onPress={() => Linking.openURL("http://references.modernisation.gouv.fr/accessibilite-numerique")}
        >
          <Text style={styles.link}>http://references.modernisation.gouv.fr/accessibilite-numerique</Text>
        </TouchableOpacity>
      </Text>
      <Text style={styles.h1}>Sécurité</Text>
      <Text style={styles.default}>
        L'application est protégé par un certificat électronique, matérialisé pour la grande majorité des
        navigateurs par un cadenas. Cette protection participe à la confidentialité des échanges.
        {"\n\n"}En aucun cas les services associés à la plateforme ne seront à l'origine d'envoi de courriels
        pour demander la saisie d'informations personnelles.
      </Text>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Mentions légales" content={content} />;
};

const styles = StyleSheet.create({
  //Article x - Titre
  h1: {
    color: colors.DARK_BLUE,
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },

  // x.y - Sous titre
  h2: {
    color: colors.DARK_BLUE,
    fontSize: 17,
    marginVertical: 8,
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

  li: {
    display: "flex",
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
export default LegalMentions;
