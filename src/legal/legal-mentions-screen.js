import React from 'react';
import LegalScreen from './legal-screen';
import {Linking, StyleSheet, Text} from 'react-native';

const LegalMentions = ({navigation}) => {
  const goToPrivacy = () => {
    navigation.navigate('privacy');
  };

  const goToCGU = () => {
    navigation.navigate('cgu');
  };

  const goToGitHub = () => {
    Linking.openURL('https://github.com/SocialGouv/monsuivipsy');
  };

  const content = (
    <Text>
      <Text style={styles.title}>Editeur de la plateforme</Text>
      {'\n\n'}
      La Fabrique du Numérique - Incubateur des Ministères des Solidarités et de
      la Santé
      {'\n'}
      Tour Mirabeau
      {'\n'}
      39-43 Quai André Citroën
      {'\n'}
      75015 PARIS
      {'\n'}
      Tél. : 01 40 56 60 00
      {'\n\n'}
      <Text style={styles.title}>Directeur de la publication</Text>
      {'\n\n'}
      Hélène BRISSET, Directrice des Systèmes d'Information des ministères des
      Solidarités et de la Santé, du Travail et des Sports.
      {'\n\n'}
      <Text style={styles.title}>Hébergement de la Plateforme</Text>
      {'\n\n'}
      Ce site est hébergé par Microsoft Azure France (région France centre) :
      {'\n'}
      Microsoft France
      {'\n'}
      37 Quai du Président Roosevelt
      {'\n'}
      92130 ISSY-LES-MOULINEAUX
      {'\n'}
      Le code du logiciel est libre, et peut donc être vérifié et amélioré par
      toutes et tous à l’adresse suivante :{' '}
      <Text style={styles.link} onPress={goToGitHub}>
        https://github.com/SocialGouv/monsuivipsy
      </Text>
      {'\n\n'}
      <Text style={styles.title}>Accessibilité</Text>
      {'\n\n'}
      La conformité aux normes d’accessibilité numérique est un objectif
      ultérieur mais nous tâchons de rendre ce site accessible à toutes et à
      tous.
      {'\n\n'}
      <Text style={styles.title}>Signaler un dysfonctionnement</Text>
      {'\n\n'}
      Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un
      contenu ou une fonctionnalité du site, merci de nous en faire part. Si
      vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de
      faire parvenir vos doléances ou une demande de saisine au Défenseur des
      droits.
      {'\n\n'}
      <Text style={styles.title}>En savoir plus</Text>
      {'\n\n'}
      Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
      http://references.modernisation.gouv.fr/accessibilite-numerique
      {'\n\n'}
      <Text style={styles.title}>Sécurité</Text>
      {'\n\n'}
      Le site est protégé par un certificat électronique, matérialisé pour la
      grande majorité des navigateurs par un cadenas. Cette protection participe
      à la confidentialité des échanges.
      {'\n\n'}En aucun cas les services associés à la plateforme ne seront à
      l’origine d’envoi de courriels pour demander la saisie d’informations
      personnelles.
      {'\n\n'}
      <Text style={styles.link} onPress={goToCGU}>
        Conditions générales d'utilisation
      </Text>
      {'\n\n'}
      <Text style={styles.link} onPress={goToPrivacy}>
        Politique de confidentialité
      </Text>
      {'\n\n\n'}
    </Text>
  );

  return (
    <LegalScreen
      navigation={navigation}
      title="Mentions légales"
      content={content}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default LegalMentions;
