import React from 'react';
import LegalScreen from './legal-screen';
import {StyleSheet} from 'react-native';
import Text from '../../components/MyText';

const LegalMentions = ({navigation}) => {
  const goToPrivacy = () => {
    navigation.navigate('privacy');
  };

  const goToCGU = () => {
    navigation.navigate('cgu');
  };

  const content = (
    <Text>
      <Text style={styles.title}>Editeur de l'application</Text>
      {'\n\n'}
      L’application MonSuiviPsy est éditée par la Direction Générale de la Santé
      au sein de la Fabrique numérique des Ministères sociaux située :
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
      Monsieur Jérôme SALOMON, Directeur général de la Santé
      {'\n\n'}
      <Text style={styles.title}>Hébergement de l'application</Text>
      {'\n\n'}
      Ce site est hébergé par Microsoft Azure France (région France centre) :
      {'\n'}
      Microsoft France
      {'\n'}
      37 Quai du Président Roosevelt
      {'\n'}
      92130 ISSY-LES-MOULINEAUX
      {'\n\n'}
      <Text style={styles.title}>Accessibilité</Text>
      {'\n\n'}
      La conformité aux normes d’accessibilité numérique est un objectif
      ultérieur mais nous tâchons de rendre cette application accessible à
      toutes et à tous.
      {'\n\n'}
      <Text style={styles.title}>Signaler un dysfonctionnement</Text>
      {'\n\n'}
      Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un
      contenu ou une fonctionnalité de l'application, merci de nous en faire
      part. Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en
      droit de faire parvenir vos doléances ou une demande de saisine au
      Défenseur des droits.
      {'\n\n'}
      <Text style={styles.title}>En savoir plus</Text>
      {'\n\n'}
      Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
      http://references.modernisation.gouv.fr/accessibilite-numerique
      {'\n\n'}
      <Text style={styles.title}>Sécurité</Text>
      {'\n\n'}
      L'application est protégé par un certificat électronique, matérialisé pour
      la grande majorité des navigateurs par un cadenas. Cette protection
      participe à la confidentialité des échanges.
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
