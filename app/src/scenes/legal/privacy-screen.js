import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import LegalScreen from './legal-screen';

const Privacy = ({navigation}) => {
  const [isTracked, setIsTracked] = useState(true);

  const content = (
    <View>
      <Text style={styles.h2}>Qui est responsable de Jardin mental?</Text>
      <Text style={styles.default}>
        L'application mobile « Jardin mental » est à l'initiative de la Direction générale de la santé (DGS) au sein de la Fabrique numérique des ministères sociaux. L'objectif de
        l'application vise à accompagner les personnes qui le souhaitent à mieux connaître leur santé mentale et suivre leurs symptômes, leurs ressentis, leurs comportements, leurs
        pensées, ou toute activité personnalisée, leur permettant ainsi de faciliter leur accompagnement psychologique, notamment par un ou une professionnel(le) de santé.
      </Text>
      <Text style={styles.h2}>Pourquoi traitons-nous des données à caractère personnel ?</Text>
      <Text style={styles.default}>L'application mobile Jardin mental traite des données à caractère personnel pour les raisons suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          Permettre aux utilisateurs de l'application de contacter l'équipe de Jardin Mental pour proposer des améliorations sur l'application mobile.
        </Text>
      </Li>
      <Text style={styles.h2}>Quelles sont les données à caractère personnel que nous traitons ?</Text>
      <Text style={styles.default}>Jardin mental traite les données suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          <Text style={styles.bold}>Données relatives aux usagers du service</Text> : adresse e-mail, numéro de téléphone. La communication de ces données est une simple
          possibilité proposée pour améliorer l'application.
        </Text>
      </Li>

      <Text style={styles.h2}>Qu'est-ce qui nous autorise à traiter des données à caractère personnel ?</Text>
      <Text style={styles.default}>L'application mobile Jardin mental traite des données à caractère personnel en se basant sur :</Text>
      <Li>
        <Text style={styles.default}>
          L'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable de traitement au sens de l'article 6-1 e) du
          RGPD.
        </Text>
      </Li>
      <Text style={styles.default}>Cette mission d'intérêt public se traduit en pratique par :</Text>
      <Li>
        <Text style={styles.default}>L'article D. 1421-1 du code de la santé publique ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>L'arrêté du 6 avril 2016 portant organisation de la direction générale de la santé, notamment ses articles 5 et 6.</Text>
      </Li>

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
        Pour les exercer, contactez-nous par voie électronique : <Text style={styles.link}>jardinmental@fabrique.social.gouv.fr</Text>
      </Text>

      <Text style={styles.default}>Par voie postale :</Text>
      <Text style={styles.default}>Ministère du Travail, de la Santé et des Solidarités</Text>
      <Text style={styles.default}>Direction générale de la santé</Text>
      <Text style={styles.default}>14 avenue Duquesne</Text>
      <Text style={styles.default}>75007 Paris</Text>
      <Text style={styles.default}>France</Text>

      <View style={styles.break} />

      <Text style={styles.default}>
        Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous identifier. Dans le cas où nous ne parvenons pas à vous
        identifier, nous pouvons être amenés à vous demander une preuve de votre identité.
      </Text>
      <Text style={styles.default}>Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la Cnil.</Text>

      <Text style={styles.default}>
        CNIL ici :
        <TouchableOpacity onPress={() => Linking.openURL('https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces')}>
          <Text style={styles.link}>https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces</Text>
        </TouchableOpacity>
      </Text>
      <Text style={styles.default}>Nous nous engageons à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre demande.</Text>

      <Text style={styles.h2}>Qui va avoir accès à ces données ?</Text>
      <Text style={styles.default}>Les accès aux données sont strictement encadrés et juridiquement justifiés. Les personnes suivantes vont avoir accès aux données :</Text>
      <Li>
        <Text style={styles.default}>Les membres de l'équipe Jardin Mental au sein de la Fabrique numérique des ministères sociaux.</Text>
      </Li>

      <Text style={styles.h2}>Quelles mesures de sécurité mettons-nous en place ?</Text>
      <Text style={styles.default}>Nous mettons en place plusieurs mesures pour sécuriser les données :</Text>

      <Li>
        <Text style={styles.default}>Stockage des données en base de données ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Cloisonnement des données ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Mesures de traçabilité ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Surveillance ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Protection contre les virus, malwares et logiciels espions ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Protection des réseaux ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Sauvegarde ;</Text>
      </Li>
      <Li>
        <Text style={styles.default}>Mesures restrictives limitant l'accès physique aux données à caractère personnel.</Text>
      </Li>

      <View style={styles.break} />
      <Text style={styles.h2}>Qui nous aide à traiter les données à caractère personnel ?</Text>
      <ConservationTable />

      <View style={styles.break} />
      <Text style={styles.h2}>Témoins de connexion et traceurs</Text>
      <Text style={styles.default}>
        Un témoin de connexion ou traceur est un fichier déposé sur votre appareil lorsque vous accédez à l'application mobile pour collecter certaines de vos informations. Sur
        l'application Jardin Mental, des témoins de connexion ou traceurs de mesure d'audience sont déposés mais ne nécessitent pas le recueil de votre consentement conformément
        aux recommandations de la CNIL. Nous utilisons la solution « Matomo » configurée en mode exempté.
      </Text>
      <Text style={styles.default}>Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale de l'Informatique et des Libertés (CNIL) :</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi')}>
        <Text style={styles.link}>Cookies & traceurs : que dit la loi ?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser')}>
        <Text style={styles.link}>Cookies : les outils pour les maîtriser</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => setIsTracked(!isTracked)}>
          <Text style={[styles.default, {marginRight: 10}]}>{isTracked ? '☒' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={styles.default}>Vous êtes suivis de manière anonyme. Décochez cette case pour ne plus être suivi.</Text>
      </View>
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
          <TouchableOpacity onPress={() => Linking.openURL('https://us.ovhcloud.com/legal/data-processing-agreement/')}>
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
          <Text style={styles.default}>Solution utilisée lorsque l'utilisateur choisit d'envoyer par courriel un récapitulatif de ses données à la personne de son choix</Text>
        </View>
        <View style={styles.tableCol}>
          <TouchableOpacity onPress={() => Linking.openURL('https://assets.sarbacane-cdn.com/legal/FR_DataProcessingAddendum.pdf')}>
            <Text style={styles.link}>https://assets.sarbacane-cdn.com/legal/FR_DataProcessingAddendum.pdf</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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

const Li = ({children, dot = '-'}) => (
  <View style={styles.li}>
    <Text style={styles.dotLi}>{dot}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  table: {
    display: 'flex',
    borderWidth: 1,
    borderColor: colors.BLUE,
  },
  tableHeader: {
    backgroundColor: '#dedede',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCol: {
    padding: 5,
    flex: 1,
    borderColor: colors.BLUE,
    borderWidth: 1,
    alignItems: 'center',
  },
  center: {
    textAlign: 'center',
  },
  //Article x - Titre
  h1: {
    color: colors.DARK_BLUE,
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },

  // x.y - Sous titre
  h2: {
    color: colors.DARK_BLUE,
    fontSize: 17,
    marginVertical: 8,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },

  li: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  dotLi: {
    paddingTop: 8,
    marginRight: 10,
  },
  link: {
    color: colors.LIGHT_BLUE,
    textDecorationLine: 'underline',
  },
  break: {
    height: 20,
  },
});

export default Privacy;
