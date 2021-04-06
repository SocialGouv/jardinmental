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
      Les présentes conditions générales d’utilisation (dites « CGU ») fixent le
      cadre juridique de l’application MonSuiviPsy définissent les conditions
      d’accès et d’utilisation des services par l’Utilisateur.
      {'\n\n'}
      <Text style={styles.title}>Article 1 - Champ d’application</Text>
      {'\n\n'}
      L’application peut être téléchargée sans création de compte et demeure
      d’accès libre. L’utilisation de l’application vaut acceptation des
      présentes CGU.
      {'\n\n'}
      <Text style={styles.title}>Article 2 - Objet</Text>
      {'\n\n'}« MonSuiviPsy » vise à suivre l’évolution des symptômes et des
      effets indésirables de traitements. L’application est une solution simple
      qui permet également un accès à des données informatives concernant les
      symptômes suivis.
      {'\n\n'}
      <Text style={styles.title}>Article 3 – Définitions</Text>
      {'\n\n'}
      L’Utilisateur est toute personne qui télécharge l’application et
      l’utilise.{'\n\n'} Les services sont l’ensemble des services proposés par
      MonSuiviPsy.{'\n\n'} Le responsable de traitement : est la personne qui,
      au sens de l’article du règlement (UE) n°2016/679 du Parlement européen et
      du Conseil du 27 avril 2016 relatif à la protection des personnes
      physiques à du traitement des données à caractère personnel et à la libre
      circulation de ces données à caractère personnel.
      {'\n\n'}
      <Text style={styles.title}>Article 4- Fonctionnalités</Text>
      {'\n\n'}
      <Text style={styles.subtitle}>4.1 Saisie de ses symptômes</Text>
      {'\n\n'}
      L’Utilisateur peut saisir ses symptômes, d’ordre psychologique ou liés à
      d’éventuels effets indésirables de traitements. Pour ce faire, MonSuiviPsy
      met à sa disposition un espace « note », dont l’ensemble des informations
      demeurent sur le terminal de l’Utilisateur. Ces symptômes peuvent être
      nouveaux ou alors récurrents, la note permettant aux personnes de le
      préciser pour faciliter leur propre suivi.
      {'\n\n'}
      <Text style={styles.subtitle}>4.2 Exporter ses données</Text>
      {'\n\n'}
      L’Utilisateur peut exporter ses données sous format PDF, notamment en
      contactant le mail contact@monsuivipsy.fr . Néanmoins, aucune donnée n’est
      transférée via MonSuiviPsy. L’application permet juste la mise en contact
      avec l’équipe si l’Utilisateur souhaite transférer ses informations.
      {'\n\n'}
      <Text style={styles.title}>Article 5 - Responsabilités</Text>
      {'\n\n'}
      <Text style={styles.subtitle}>5.1 L’éditeur du Site</Text>
      {'\n\n'}
      Les sources des informations diffusées sur l’application sont réputées
      fiables mais MonSuiviPsy ne garantit pas qu’il soit exempt de défauts,
      d’erreurs ou d’omissions.{'\n\n'} Tout événement dû à un cas de force
      majeure ayant pour conséquence un dysfonctionnement du site et sous
      réserve de toute interruption ou modification en cas de maintenance,
      n'engage pas la responsabilité de l’éditeur.{'\n\n'} L’éditeur s’engage à
      mettre en œuvre toutes mesures appropriées, afin de protéger les données
      traitées.{'\n\n'} L’éditeur s’engage à la sécurisation du site, notamment
      en prenant les mesures nécessaires permettant de garantir la sécurité et
      la confidentialité des informations fournies.{'\n\n'} L’éditeur fournit
      les moyens nécessaires et raisonnables pour assurer un accès continu, sans
      contrepartie financière, à la Plateforme. Il se réserve la liberté de
      faire évoluer, de modifier ou de suspendre, sans préavis, la plateforme
      pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.
      {'\n\n'}
      <Text style={styles.subtitle}>5.2 L’Utilisateur</Text>
      {'\n\n'}
      Toute information transmise par l'Utilisateur est de sa seule
      responsabilité. Il est rappelé que toute personne procédant à une fausse
      déclaration pour elle-même ou pour autrui s’expose, notamment, aux
      sanctions prévues à l’article 441-1 du code pénal, prévoyant des peines
      pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.
      {'\n\n'}
      <Text style={styles.title}>
        Article 6 - Mise à jour des conditions d’utilisation
      </Text>
      {'\n\n'}
      Les termes des présentes conditions d’utilisation peuvent être amendés à
      tout moment, sans préavis, en fonction des modifications apportées à la
      plateforme, de l’évolution de la législation ou pour tout autre motif jugé
      nécessaire.
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default CGU;
