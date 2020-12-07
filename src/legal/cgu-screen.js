import React from 'react';
import LegalScreen from './legal-screen';
import {StyleSheet, Text, Linking} from 'react-native';

const CGU = ({navigation}) => {
  const goToGitHub = () => {
    Linking.openURL('https://github.com/SocialGouv/monsuivipsy');
  };

  const goToL112 = () => {
    Linking.openURL(
      'https://www.legifrance.gouv.fr/codes/id/LEGIARTI000031367350/2016-03-29/',
    );
  };

  const goToDdos = () => {
    Linking.openURL(
      'https://fr.wikipedia.org/wiki/Attaque_par_d%C3%A9ni_de_service',
    );
  };

  const goToLegalMentions = () => {
    navigation.navigate('legal-mentions');
  };

  const goToPrivacy = () => {
    navigation.navigate('privacy');
  };

  const content = (
    <Text>
      <Text style={styles.title}>Présentation</Text>
      {'\n\n'}
      MonSuiviPsy est un service d’aide au suivi de l’évolution des symptômes et
      des effets indésirables des traitements à destination des particuliers et
      de celles et ceux qui les conseillent, dans un cadre professionnel ou
      bénévole. Il s'agit d'une application mobile qui permet de saisir
      quotidiennement l’intensité ou la fréquence de ses symptômes et la
      présence ou non d’effets indésirables des traitements, de saisir des notes
      quotidiennes, d’avoir accès à un récapitulatif de l’intensité des
      symptômes sous forme de courbe et de transférer les informations saisies
      dans l’application via mail si l’utilisateur le souhaite. {'\n\n'}
      Le{' '}
      <Text style={styles.link} onPress={goToGitHub}>
        code du logiciel
      </Text>{' '}
      est libre, et peut donc être vérifié et amélioré par toutes et tous.
      {'\n\n'}
      <Text style={styles.title}>Vocabulaire</Text>
      {'\n\n'}« Nous » se réfère à l’éditeur de MonSuiviPsy.
      {'\n'}« Vous » se réfère à un·e utilisateur de MonSuiviPsy
      {'\n\n'}
      <Text style={styles.title}>Absence de garantie</Text>
      {'\n\n'}
      Les résultats fournis par ce service ont une valeur informative et ne
      représentent en aucun cas un diagnostic médical.
      {'\n\n'} Nous ne garantissons pas l'exactitude du contenu des sites
      externes vers lesquels nous redirigeons la navigation. Ces sites ne sont
      pas non plus régis par les mêmes conditions d'utilisation, notamment en ce
      qui concerne leur traitement des données à caractère personnel.
      {'\n\n'}Nous mettons MonSuiviPsy à disposition sans garantie sur sa
      disponibilité, en « best effort ». Cela signifie que d'éventuelles
      indisponibilités n'ouvriront pas droit à compensation financière.
      {'\n\n'}
      <Text style={styles.title}>Évolutions</Text>
      {'\n\n'}
      Nous pouvons faire évoluer MonSuiviPsy sans information préalable. Nous
      ajoutons régulièrement des aides, améliorons l'interface et modifions des
      formulations sur la base de vos retours et des évolutions règlementaires.
      {'\n\n'}
      Nous pouvons suspendre l'accès à MonSuiviPsy sans information préalable,
      notamment pour des raisons de maintenance. Nous mettons l'application à
      jour plusieurs fois par semaine. L'indisponibilité ne dépasse généralement
      pas une dizaine de secondes.
      {'\n\n'}Nous pouvons amender ces conditions d’utilisation. En cas de
      changement significatif, une notification s'affichera lors de l'accès à
      MonSuiviPsy au moins 30 jours avant l'entrée en vigueur des nouvelles
      conditions.
      {'\n\n'}
      <Text style={styles.title}>Utilisation</Text>
      {'\n\n'}
      MonSuiviPsy est en téléchargement libre sur les plateformes Apple App
      Store et Google Play. Son utilisation est gratuite et facultative.
      {'\n\n'}Si vous effectuez un suivi de vos symptômes et des effets
      indésirables des traitements, ou que vous saisissez des notes, vous
      acceptez ces conditions d'utilisation. Comme indiqué dans l'article{' '}
      <Text style={styles.link} onPress={goToL112}>
        L. 112-9
      </Text>{' '}
      du code des relations entre le public et l'administration.
      {'\n\n'}
      L’utilisation de MonSuiviPsy requiert une connexion internet et un
      smartphone récent.
      {'\n\n'}Nous nous réservons le droit de bloquer, sans information
      préalable ni compensation financière, les usages mettant en péril
      l'utilisation du logiciel par d'autres utilisateurs. Cela nous permet
      d'anticiper d'éventuelles{' '}
      <Text style={styles.link} onPress={goToDdos}>
        attaques par déni de service
      </Text>
      {'\n\n'}
      <Text style={styles.link} onPress={goToLegalMentions}>
        Mentions légales
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
      title="Conditions générales d'utilisation"
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

export default CGU;
