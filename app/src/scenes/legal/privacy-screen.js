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
        Le service numérique « Jardin mental » est à l'initiative de la Direction générale de la santé au sein de la Fabrique numérique des ministères sociaux.
      </Text>
      <Text style={styles.h2}>Pourquoi traitons-nous des données à caractère personnel ?</Text>
      <Text style={styles.default}>Jardin mental traite des données à caractère personnel pour les raisons suivantes :</Text>
      <Li>
        <Text style={styles.default}>
          Accompagner les personnes qui le souhaitent à mieux connaître et suivre leurs symptômes, leurs ressentis ou toute activité personnalisée, leur permettant de faciliter
          leur accompagnement psychologique.
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
      <Text style={styles.default}>Jardin mental traite des données à caractère personnel en se basant sur :</Text>
      <Li>
        <Text style={styles.default}>
          L'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable de traitement au sens de l'article 6-1 e) du
          RGPD.
        </Text>
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
      <Text style={styles.default}>Direction du Numérique des ministères sociaux</Text>
      <Text style={styles.default}>Ministère des solidarités et de la santé</Text>
      <Text style={styles.default}>39-43 Quai André Citroën</Text>
      <Text style={styles.default}>75015 Paris</Text>

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
      <Text style={styles.h2}>Cookies</Text>
      <Text style={styles.default}>
        Un cookie est un fichier déposé sur votre terminal lors de la visite d'un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser
        des services adaptés à votre terminal (ordinateur, mobile ou tablette).
      </Text>
      <Text style={styles.default}>
        En application de l'article 5(3) de la directive 2002/58/CE modifiée concernant le traitement des données à caractère personnel et la protection de la vie privée dans le
        secteur des communications électroniques, transposée à l'article 82 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, les
        traceurs ou cookies suivent deux régimes distincts.
      </Text>
      <Text style={styles.default}>
        Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter la communication par voie électronique sont dispensés de consentement préalable
        au titre de l'article 82 de la loi n° 78-17 du 6 janvier 1978.
      </Text>
      <Text style={styles.default}>
        Les cookies n'étant pas strictement nécessaires au service ou n'ayant pas pour finalité exclusive de faciliter la communication par voie électronique doivent être consenti
        par l'utilisateur.
      </Text>
      <Text style={styles.default}>
        Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques constitue une base légale au sens du RGPD et doit être entendu au sens de l'article 6-a
        du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à
        caractère personnel et à la libre circulation de ces données.
      </Text>
      <Text style={styles.default}>
        À tout moment, vous pouvez refuser l'utilisation des cookies et désactiver le dépôt sur votre ordinateur en utilisant la fonction dédiée de votre navigateur (fonction
        disponible notamment sur Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari et Opera).
      </Text>
      <Text style={styles.default}>Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale de l'Informatique et des Libertés (CNIL) :</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi')}>
        <Text style={styles.link}>Cookies & traceurs : que dit la loi ?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser')}>
        <Text style={styles.link}>Cookies : les outils pour les maîtriser</Text>
      </TouchableOpacity>
      <Text style={styles.default}>
        Nous utilisons Matomo, une solution de mesure d'audience, configuré en "mode exempté" ne nécessitant pas le recueil du consentement des utilisateurs conformément aux
        recommandations de la CNIL.
      </Text>
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
          <Text style={styles.default}>OVH</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>France</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Hébergement</Text>
        </View>
        <View style={styles.tableCol}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/9e74492-OVH_Data_Protection_Agreement-FR-6.0.pdf')
            }>
            <Text style={styles.link}>https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/9e74492-OVH_Data_Protection_Agreement-FR-6.0.pdf</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Tipimail </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>France</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>Envoi d'e-mails</Text>
        </View>
        <View style={styles.tableCol}>
          <TouchableOpacity onPress={() => Linking.openURL('https://fr.tipimail.com/dpa')}>
            <Text style={styles.link}>https://fr.tipimail.com/dpa</Text>
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
          <Text style={styles.default}>Données relatives aux usagers du service Données relatives aux usagers du service </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.default}>3 ans à compter de la dernière utilisation</Text>
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
