import React from 'react';
import LegalScreen from './legal-screen';
import {StyleSheet, Text, Linking} from 'react-native';

const Privacy = ({navigation}) => {
  const sendMail = () => {
    Linking.openURL('mailto:monsuivipsy@fabrique.social.gouv.fr');
  };

  const goToCnil = () => {
    Linking.openURL(
      'https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces',
    );
  };

  const goToLegalMentions = () => {
    navigation.navigate('legal-mentions');
  };

  const goToCGU = () => {
    navigation.navigate('cgu');
  };

  const content = (
    <Text>
      <Text style={styles.title}>
        Traitement des données à caractère personnel
      </Text>
      {'\n\n'}
      Il n’y a pas de traitement de vos données de santé dans le cadre de
      l’utilisation du service MonSuiviPsy. En effet, les données saisies par
      l’utilisateur sont stockées exclusivement dans son téléphone. Il n’y a
      donc à ce titre aucun traitement de données de santé.
      {'\n'}
      Les données d’utilisation de l’outil comprennent des données personnelles
      anonymisées.
      {'\n'}
      La présente application “MonSuiviPsy” est un service développé et opéré
      par la Fabrique des Ministères Sociaux.
      {'\n\n'}
      Le Responsable de traitement est MonSuiviPsy :
      https://monsuivipsy.fabrique.social.gouv.fr/
      {'\n\n'}
      <Text style={styles.title}>Finalités</Text>
      {'\n\n'}
      L’application ne collecte aucune donnée de santé saisie par l’utilisateur
      pour le suivi de l’évolution de ses symptômes et effets indésirables. Les
      données sont exclusivement stockées dans le téléphone de l’usager.
      {'\n\n'}
      L’application ne collecte pas non plus de données à caractère personnel.
      {'\n'}
      Les seules données collectées concernent des données d’usage permettant
      des analyses statistiques ayant pour objectif de comprendre l’utilisation
      de l’outil et de l’améliorer.
      {'\n\n'}
      L’application permet sur la base du volontariat de transmettre la synthèse
      des saisies par mail à un professionnel compétent ou tout autre personne
      par l’Utilisateur.
      {'\n\n'}
      Ses finalités sont de :{'\n'}- Proposer un suivi personnel de l'évolution
      des symptômes et des effets indésirables des traitements.
      {'\n'}- Proposer la possibilité d’envoyer une synthèse à un professionnel
      compétent ou tout autre personne par l’Utilisateur.
      {'\n\n'}
      <Text style={styles.title}>Données à caractère personnel traitées</Text>
      {'\n\n'}
      Aucune donnée à caractère personnel n’est traitée. Les données sont
      stockées en local dans le téléphone de l’usager.
      {'\n\n'}
      Seules les données fonctionnelles d’utilisation de l’application sont
      traitées. Celles-ci sont anonymisées avant tout traitement de notre part.
      {'\n\n'}
      <Text style={styles.title}>
        Bases juridiques des traitements de données
      </Text>
      {'\n\n'}
      La base juridique qui s’applique autour du service MonSuiviPsy est
      l’exercice d’une mission d'intérêt public.
      {'\n\n'}
      <Text style={styles.title}>Durée de conservation</Text>
      {'\n\n'}
      Les données saisies par l’utilisateur (évolution des symptômes et des
      effets indésirables des traitements) sont conservées sur l’appareil mobile
      de l’Utilisateur et peuvent être supprimées à tout moment par
      l’utilisateur, en supprimant l’application. Les notes saisies peuvent
      également être supprimées une à une. Les données saisies ne sont pas
      transférées automatiquement, à qui que ce soit. La dernière adresse
      d’envoi des données saisies est conservée dans le téléphone exclusivement.
      {'\n\n'}
      <Text style={styles.title}>Droit des personnes concernées</Text>
      {'\n\n'}
      Vous disposez des droits suivants concernant vos données à caractère
      personnel :{'\n'}- Droit d’information et droit d’accès aux données
      {'\n'}- Droit de rectification et le cas échéant de suppression des
      données
      {'\n'}- Droit à la limitation du traitement des données
      {'\n'}- Droit au retrait du consentement
      {'\n\n'}
      Pour les exercer, faites-nous parvenir une demande en précisant la date et
      l’heure précise de la requête – ces éléments sont indispensables pour nous
      permettre de retrouver votre recherche – par voie électronique à l’adresse
      suivante :
      <Text style={styles.link} onPress={sendMail}>
        monsuivipsy@fabrique.social.gouv.fr
      </Text>
      {'\n\n'}
      En raison de l’obligation de sécurité et de confidentialité dans le
      traitement des données à caractère personnel qui incombe au responsable de
      traitement, votre demande ne sera traitée que si vous apportez la preuve
      de votre identité.
      {'\n\n'}
      <Text style={styles.link} onPress={goToCnil}>
        https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
      </Text>
      , un modèle de courrier élaboré par la CNIL.
      {'\n\n'}
      Le responsable de traitement s’engage à répondre dans un délai raisonnable
      qui ne saurait dépasser 1 mois à compter de la réception de votre demande.
      {'\n\n'}
      <Text style={styles.title}>Destinataires des données</Text>
      {'\n\n'}
      Etant donné qu’aucune donnée de santé ni de donnée à caractère personnel
      n’est collectée, la notion de destinataire des données ne s’applique pas.
      Le le produit était amené à évoluer et que de telles données existaient et
      étaient collectées, le responsable de traitement s'engageait alors à ce
      que les données de santé ou à caractère personnel soient traitées par les
      seules personnes autorisées : l’équipe de l’application MonSuiviPsy dans
      le cadre de l’application.
      {'\n\n'}
      <Text style={styles.title}>Sécurité et confidentialité des données</Text>
      {'\n\n'}
      Les données saisies concernant l’évolution des symptômes et des effets
      indésirables des traitements sont conservées sur l’appareil mobile de
      l’Utilisateur et peuvent être supprimées à tout moment par lui.
      {'\n\n'}
      Le récapitulatif des données saisies par l’Utilisateur est transmis via
      mail à la personne de son choix par un canal sécurisé et les données
      transmises par ce biais ne sont pas collectées.
      {'\n\n'}
      Les mesures techniques et organisationnelles de sécurité adoptées pour
      assurer la confidentialité, l’intégrité et protéger l’accès des données
      sont notamment :{'\n'}- Contrôle des accès
      {'\n'}- Chiffrement des données
      {'\n'}- Journalisation
      {'\n'}- Protection contre les virus, malwares et logiciels espions
      {'\n'}- Protection des réseaux
      {'\n'}- Sauvegarde
      {'\n'}- Mesures restrictives limitant l’accès physiques aux données à
      caractère personnel Cookies
      {'\n\n'}
      La Fabrique du Numérique - Incubateur des Ministères des Solidarités et de
      la Santé dans le cadre du service MonSuiviPsy, en tant qu’éditeur du
      service, pourra faire usage de cookies.
      {'\n\n'}
      Certains cookies sont dispensés du recueil préalable de votre consentement
      dans la mesure où ils sont strictement nécessaires à la fourniture du
      service. Les traceurs ont vocation à être conservés sur le poste
      informatique de l'Internaute pour une durée allant jusqu'à 13 mois.
      {'\n\n'}
      Ils permettent d’établir des mesures statistiques de fréquentation et
      d’utilisation du site pouvant être utilisées à des fins de suivi et
      d’amélioration du service :{'\n'}- Les données collectées ne sont pas
      recoupées avec d’autres traitements.
      {'\n'}- Le cookie déposé sert uniquement à la production de statistiques
      anonymes.
      {'\n'}- Le cookie ne permet pas de suivre la navigation de l’internaute
      sur d’autres sites
      {'\n\n'}
      La mesure d’audience (nombre de visites, pages consultées) est réalisée
      par un outil libre intitulé Matomo spécifiquement paramétré, respectant
      les conditions d’exemption du consentement de l’internaute définies par la
      recommandation « Cookies » de la Commission nationale informatique et
      libertés (CNIL)
      {'\n\n'}
      <Text style={styles.link} onPress={goToLegalMentions}>
        Mentions légales
      </Text>
      {'\n\n'}
      <Text style={styles.link} onPress={goToCGU}>
        Conditions générales d'utilisation
      </Text>
      {'\n\n\n'}
    </Text>
  );

  return (
    <LegalScreen
      navigation={navigation}
      title="Politique de confidentialité"
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
export default Privacy;
