import React from 'react';
import LegalScreen from './legal-screen';
import {StyleSheet} from 'react-native';
import Text from '../../components/MyText';

const Privacy = ({navigation}) => {
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
      La présente application MonSuiviPsy est à l’initiative de la Direction
      Générale de la Santé au sein de la Fabrique numérique des ministères
      sociaux.
      {'\n\n'}
      <Text style={styles.title}>Finalités</Text>
      {'\n\n'}
      L’application « MonSuiviPsy » vise à suivre l’évolution des symptômes et
      des effets indésirables de traitements. Elle permet notamment :{'\n'}- La
      saisie de notes libres
      {'\n'}- La saisie de données via un questionnaire.
      {'\n'}- L&#39;export de données saisies par mail à toute personne choisie
      par l&#39;utilisateur.
      {'\n\n'}
      <Text style={styles.title}>Données à caractère personnel traitées</Text>
      {'\n\n'}
      Sont traitées les données suivantes :{'\n'}- Données relatives aux notes
      libres et au suivi et à l’évolution des symptômes
      {'\n'}- Données de connexion (et notamment, les identifiants de connexion,
      nature des opérations, date et heure de l’opération)
      {'\n'}- Cookies.
      {'\n\n'}
      Les données relatives aux notes libres et au suivi sont conservées sur le
      terminal de l’utilisateur et ne sont pas transférées à l’équipe
      MonSuiviPsy, à la Fabrique numérique des ministères sociaux ou à la
      Direction Générale de la Santé.{'\n\n'}
      <Text style={styles.title}>
        Bases juridiques des traitements de données
      </Text>
      {'\n\n'}
      Les données traitées à l’occasion de ces traitements ont plusieurs
      fondements juridiques : {'\n\n'}- L’obligation légale à laquelle est
      soumise le responsable de traitements au sens de l’article 6-c du RGPD ;
      {'\n\n'}- Des motifs d’intérêt public important au sens de l’article 9
      paragraphe 2-g du RGPD.
      {'\n\n'}
      Ces fondements sont précisés ci-dessous :{'\n\n'}
      <Text style={styles.subtitle}>
        a. Données relatives aux notes libres et à l’évolution des symptômes
      </Text>
      {'\n\n'}
      Ce traitement est nécessaire pour des motifs d’intérêt public important au
      sens de l’article 9 paragraphe 2-g du règlement (UE) 2016/679 du Parlement
      européen et du Conseil du 27 avril 2016 relatif à la protection des
      personnes physiques à l’égard du traitement des données à caractère
      personnel et à la libre circulation de ces données. {'\n\n'}Le motif
      d’intérêt public important est notamment posé par l’article 5 de l’arrêté
      du 6 avril 2016 portant organisation de la Direction générale santé.
      {'\n\n'}
      <Text style={styles.subtitle}>b. Données de connexion</Text>
      {'\n\n'}
      Ce traitement est nécessaire au respect d'une obligation légale à laquelle
      le responsable de traitement est soumis au sens de l'article 6-c du
      Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril
      2016 relatif à la protection des personnes physiques à l'égard du
      traitement des données à caractère personnel et à la libre circulation de
      ces données. {'\n\n'}L'obligation légale est posée par la loi LCEN n°
      2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique et
      par les articles 1 et 3 du décret n°2011-219 du 25 février 2011.
      {'\n\n'}
      <Text style={styles.subtitle}>c. Cookies</Text>
      {'\n\n'}
      En application de l’article 5(3) de la directive 2002/58/CE modifiée
      concernant le traitement des données à caractère personnel et la
      protection de la vie privée dans le secteur des communications
      électroniques, transposée à l’article 82 de la loi n°78-17 du 6 janvier
      1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs
      ou cookies suivent deux régimes distincts.{'\n\n'} Les cookies strictement
      nécessaires au service ou ayant pour finalité exclusive de faciliter la
      communication par voie électronique sont dispensés de consentement
      préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier 1978.
      {'\n\n'}
      Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas
      pour finalité exclusive de faciliter la communication par voie
      électronique doivent être consenti par l’utilisateur.{'\n\n'} Ce
      consentement de la personne concernée pour une ou plusieurs finalités
      spécifiques constitue une base légale au sens du RGPD et doit être entendu
      au sens de l'article 6-a du Règlement (UE) 2016/679 du Parlement européen
      et du Conseil du 27 avril 2016 relatif à la protection des personnes
      physiques à l'égard du traitement des données à caractère personnel et à
      la libre circulation de ces données.
      {'\n\n'}
      <Text style={styles.title}>Durée de conservation</Text>
      {'\n\n'}
      Données relatives aux notes libres et à l’évolution des symptômes : Dès la
      suppression ou dans un délai de 2 ans à compter de la dernière utilisation
      {'\n\n'}
      Données d’hébergeur : 1 an, conformément au décret n°2011-219 du 25
      février 2011.
      {'\n\n'}
      Cookies : Dans un délai de 13 mois, conformément aux recommandations de la
      CNIL
      {'\n\n'}
      <Text style={styles.title}>Droit des personnes concernées</Text>
      {'\n\n'}
      Vous disposez des droits suivants concernant vos données à caractère
      personnel : {'\n\n'}- Droit d’information et droit d’accès des données ;
      {'\n\n'}- Droit de rectification et le cas échéant de suppression des
      données ;{'\n\n'}
      Pour les exercer, faites-nous parvenir une demande en précisant la date et
      l’heure précise de la requête - ces éléments sont indispensables pour nous
      permettre de retrouver votre recherche :{'\n\n'}- par voie électronique à
      l’adresse suivante : monsuivipsy@fabrique.social.gouv.fr {'\n\n'}- par
      voie postale : Fabrique numérique des ministères sociaux{'\n'} Ministère
      des solidarités et de la santé{'\n'}
      39-43 Quai André Citroën{'\n'} 75015 PARIS{'\n\n'}
      En raison de l’obligation de sécurité et de confidentialité dans le
      traitement des données à caractère personnel qui incombe au responsable de
      traitement, votre demande ne sera traitée que si vous apportez la preuve
      de votre identité.{'\n'} Pour vous aider dans votre démarche, vous
      trouverez ici
      https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces , un
      modèle de courrier élaboré par la Cnil.{'\n'} Nous nous engageons à ne
      jamais céder ces informations à des tiers.{'\n\n'}
      <Text style={styles.title}>Délais de réponse</Text>
      {'\n\n'}
      Le responsable de traitement s’engage à répondre dans un délai raisonnable
      qui ne saurait dépasser 1 mois à compter de la réception de votre demande.
      {'\n\n'}
      <Text style={styles.title}>Destinataires des données</Text>
      {'\n\n'}
      Le responsable de traitement s’engage à ce que les données à caractères
      personnels soient traitées par les seules personnes autorisées.
      {'\n\n'}
      <Text style={styles.title}>Sous-traitants</Text>
      {'\n\n'}
      Certaines des données sont envoyées à des sous-traitants pour réaliser
      certaines missions. Le responsable de traitement s’est assuré de la mise
      en œuvre par ses sous-traitants de garanties adéquates et du respect de
      conditions strictes de confidentialité, d’usage et de protection des
      données.
      {'\n\n'}
      <Text style={{fontWeight: '700'}}>Partenaire : </Text>Microsoft Azure
      {'\n'}
      <Text style={{fontWeight: '700'}}>Pays destinataire : </Text>France{'\n'}
      <Text style={{fontWeight: '700'}}>Traitement réalisé : </Text>Hébergement
      de l’application{'\n'}
      <Text style={{fontWeight: '700'}}>Garanties</Text>
      https://privacy.microsoft.com/fr-fr/privacystatement{'\n\n'}
      <Text style={styles.title}>Sécurité et confidentialité des données</Text>
      {'\n\n'}
      Le responsable de traitements ne conserve pas de données à caractère
      personnel sur le réseau. Elles sont conservées sur la machine locale de
      l’utilisateur. Dès lors il en a la maîtrise, et est le seul à même d’en
      garantir la sécurité et la confidentialité.
      {'\n\n'}
      <Text style={styles.title}>
        Utilisation de témoins de connexion (« cookies »)
      </Text>
      {'\n\n'}
      Un cookie est un fichier déposé sur votre terminal lors de la visite d’une
      application. Il a pour but de collecter des informations relatives à votre
      navigation et de vous adresser des services adaptés à votre terminal
      (ordinateur, mobile ou tablette).{'\n'} Nous collectons donc des données
      par l’intermédiaire de dispositifs appelés “cookies” permettant d’établir
      des mesures statistiques.{'\n'} L’application dépose des cookies de mesure
      d’audience (nombre de visites, pages consultées), respectant les
      conditions d’exemption du consentement de l’internaute définies par la
      recommandation « Cookies » de la Commission nationale informatique et
      libertés (CNIL).{'\n\n'}
      Nous utilisons pour cela Matomo, un outil de mesure d’audience web libre,
      paramétré pour être en conformité avec la recommandation « Cookies » de la
      CNIL. Cela signifie que votre adresse IP, par exemple, est anonymisée
      avant d’être enregistrée. Il est donc impossible d’associer vos visites
      sur ce cette application à votre personne. Il convient d’indiquer que :
      {'\n'}- Les données collectées ne sont pas recoupées avec d’autres
      traitements.{'\n'}- Les cookies ne permettent pas de suivre la navigation
      de l’internaute sur d’autres sites.
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    textDecorationLine: 'underline',
  },
  table: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cell: {
    flex: 1,
  },
});
export default Privacy;
