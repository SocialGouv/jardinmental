import React from "react";
import LegalScreen from "./legal-screen";
import { StyleSheet, View } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const CGU = ({ navigation }) => {
  const content = (
    <View>
      <Text style={styles.default}>
        Les présentes conditions générales d'utilisation (dites «&nbsp;CGU&nbsp;») fixent le cadre juridique
        de l'application Jardin Mental et définissent les conditions d'accès et d'utilisation des services par
        l'Utilisateur.
      </Text>
      <Text style={styles.h1}>Article 1 - Champ d'application</Text>
      <Text style={styles.default}>
        L'application peut être téléchargée sans création de compte et demeure d'accès libre. L'utilisation de
        l'application vaut acceptation des présentes CGU.
      </Text>
      <Text style={styles.h1}>Article 2 - Objet</Text>
      <Text style={styles.default}>
        «&nbsp;Jardin Mental&nbsp;» vise à accompagner les personnes qui le souhaitent à mieux connaître et
        suivre leurs symptômes, leurs ressentis ou toute activité personnalisé, leur permettant ainsi de
        faciliter leur accompagnement psychologique.
      </Text>
      <Text style={styles.h1}>Article 3 - Définitions</Text>
      <Text style={styles.default}>
        L'Utilisateur&nbsp;est toute personne qui télécharge l'application et l'utilise.
      </Text>
      <Text style={styles.default}>
        Les «&nbsp;services&nbsp;» sont l'ensemble des fonctionnalités proposées par Jardin Mental.
      </Text>
      <Text style={styles.h1}>Article 4 - Fonctionnalités</Text>
      <Text style={styles.h2}>4.1 - Utiliser son journal</Text>
      <Text style={styles.h3}>A - Ajouter une note</Text>
      <Text style={styles.default}>
        Le journal permet à l'Utilisateur d'utiliser un champ de texte totalement libre. Pour ce faire, Jardin
        Mental met à sa disposition un espace «&nbsp;note&nbsp;», dont l'ensemble des informations demeurent
        sur le terminal de l'Utilisateur.
      </Text>
      <Text style={styles.h2}>4.2 - S'aider du questionnaire via «&nbsp;Mon&nbsp;Etat&nbsp;»</Text>
      <Text style={styles.default}>
        Au sein de son espace, l'Utilisateur peut s'aider du questionnaire qui lui permet de suivre son état
        par plusieurs moyens&nbsp;:
      </Text>
      <Li>
        <Text style={styles.default}>
          Remplir le questionnaire ou renseigner son état, est accessible via «&nbsp;Mon État&nbsp;» par un
          simple clic, et peut se remplir de manière journalière. De plus, la personne peut remplir l'état
          pour les précédentes journées s'il ne l'a pas fait le jour même (dans une amplitude de 7
          jours)&nbsp;;
        </Text>
      </Li>
      <Li>
        <Text style={styles.default}>
          Personnaliser le questionnaire, en fonction de son état du moment ou de ses difficultés
          personnelles, accessible via les paramètres de «&nbsp;Mon État&nbsp;». Cela permet de cibler le
          suivi souhaité. Le suivi peut concerner&nbsp;: votre humeur, votre anxiété, vos idées parasites, vos
          sensations étranges, votre sommeil, vos activités quotidiennes, votre communication avec votre
          entourage. L'Utilisateur peut également ajouter une autre caractéristique qui lui est propre et qui
          ne figurerait pas dans la liste.
        </Text>
      </Li>
      <Text style={styles.h2}>4.3 - Exercice</Text>
      <Text style={styles.default}>
        Au sein de son espace, l'Utilisateur peut effectuer des exercices, accessibles via
        «&nbsp;Exercice&nbsp;». Les exercices nécessitent des explications afin de les réaliser, et il est
        recommandé d'en discuter préalablement avec un thérapeute.
      </Text>
      <Text style={styles.h2}>4.4 - «&nbsp;MonSuivi&nbsp;» </Text>
      <Text style={styles.default}>
        Au sein de son espace, l'Utilisateur peut à tout moment accéder aux courbes d'évolution qui
        apparaissent au fur et à mesure des saisies quotidiennes et qui permettent de suivre mon état sur 7
        jours maximum.
      </Text>
      <Text style={styles.h2}>4.5 - Parler à quelqu'un </Text>
      <Text style={styles.default}>
        S'il le souhaite, l'Utilisateur peut contacter une personne susceptible de l'écouter via une liste de
        numéros officiels accessibles via «&nbsp;Parler à quelqu'un&nbsp;».
      </Text>
      <Text style={styles.h2}>4.6 - Exporter ses données </Text>
      <Text style={styles.default}>
        L'Utilisateur peut exporter ses données sous format d'un mail, en l'envoyant à la personne de son
        choix . Néanmoins, aucune donnée n'est transférée à l'équipe de Jardin Mental.
      </Text>
      <Text style={styles.h2}>4.7 - Contacter l'équipe de Jardin Mental </Text>
      <Text style={styles.default}>
        Via la fonction «&nbsp;contribuer à Jardin Mental&nbsp;», l'application permet la mise en contact avec
        l'équipe si l'Utilisateur souhaite transférer ses informations de contact à l'équipe.
      </Text>
      <Text style={styles.h1}>Article 5 - Responsabilités</Text>
      <Text style={styles.h2}>5.1 - L'éditeur du Site</Text>
      <Text style={styles.default}>
        Les sources des informations diffusées sur l'application sont réputées fiables mais Jardin Mental ne
        garantit pas qu'il soit exempt de défauts, d'erreurs ou d'omissions. .
      </Text>
      <Text style={styles.default}>
        Tout événement dû à un cas de force majeure ayant pour conséquence un dysfonctionnement du site et
        sous réserve de toute interruption ou modification en cas de maintenance, n'engage pas la
        responsabilité de l'éditeur.
      </Text>
      <Text style={styles.default}>L'éditeur s'engage à la sécurisation du site.</Text>
      <Text style={styles.default}>
        L'éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans
        contrepartie financière, à la Plateforme. Il se réserve la liberté de faire évoluer, de modifier ou de
        suspendre, sans préavis, la plateforme pour des raisons de maintenance ou pour tout autre motif jugé
        nécessaire.
      </Text>
      <Text style={styles.h2}>5.2 - L'Utilisateur</Text>
      <Text style={styles.default}>
        L'Utilisateur s'engage à une utilisation personnelle de Jardin Mental.
      </Text>
      <Text style={styles.h1}>Article 6 - Mise à jour des conditions d'utilisation</Text>
      <Text style={styles.default}>
        Les termes des présentes conditions d'utilisation peuvent être amendés à tout moment, sans préavis, en
        fonction des modifications apportées à la plateforme, de l'évolution de la législation ou pour tout
        autre motif jugé nécessaire.
      </Text>
    </View>
  );

  return (
    <LegalScreen
      navigation={navigation}
      title="Conditions d'utilisation de l'application Jardin Mental"
      content={content}
    />
  );
};

const Li = ({ children }) => (
  <View style={styles.li}>
    <Text style={styles.dotLi}>-</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
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
});

export default CGU;
