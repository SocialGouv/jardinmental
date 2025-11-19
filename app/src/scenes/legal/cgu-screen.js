import React from "react";
import LegalScreen from "./legal-screen";
import { View } from "react-native";
import Text from "../../components/MyText";

const CGU = ({ navigation }) => {
  const content = (
    <View className="px-2">
      <Text className="text-blue-900 text-sm my-2">
        Les présentes conditions générales d’utilisation (ci-après « CGU ») fixent le cadre juridique de l’application Jardin Mental (ci-après «
        Application ») et définissent les conditions d’accès et d’utilisation des Services par l’Utilisateur.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 1 - Champ d’application</Text>
      <Text className="text-blue-900 text-sm my-2">
        L’Application peut être téléchargée sans création de compte et demeure d’accès libre. L’utilisation de l’Application est subordonnée au
        respect et à l’acceptation des présentes CGU.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 2 - Objet</Text>
      <Text className="text-blue-900 text-sm my-2">
        L’Application vise à accompagner les personnes qui le souhaitent à mieux connaître leur santé mentale et suivre leurs symptômes, leurs
        ressentis, leurs comportements, leurs pensées, ou toute activité personnalisée, leur permettant ainsi de faciliter leur accompagnement
        psychologique, notamment par un ou une professionnel(le) de santé.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 3 – Définitions</Text>
      <Text className="text-blue-900 text-sm my-2">
        « Application » désigne l’application mobile Jardin Mental sous la responsabilité de la Direction générale de la santé (DGS) à l’initiative de
        la Fabrique numérique des ministères sociaux.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Éditeur » désigne la personne morale qui met à la disposition du public l’Application, à savoir la Caisse nationale de l’Assurance Maladie
        (CNAM).
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Services » désigne les fonctionnalités proposées par l’Application pour répondre à ses finalités.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Utilisateur » désigne toute personne physique qui télécharge l’application et l’utilise après avoir accepté les présentes CGU.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 4 - Fonctionnalités</Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.1 – S’aider du questionnaire via « Mes Entrées »</Text>
      <Text className="text-blue-900 text-sm my-2">
        Au sein de son espace, l’Utilisateur peut s’aider du questionnaire qui lui permet de suivre son état par plusieurs moyens :
      </Text>

      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Remplir le questionnaire ou renseigner son état, est accessible via « Mes Entrées » par un simple clic, et peut se remplir de manière
          journalière. De plus, l’Utilisateur peut remplir l’état pour les précédentes journées s’il ne l’a pas fait le jour même (dans une amplitude
          de 7 jours).
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Renseigner son état, notamment en renseignant l’intensité des indicateurs de son choix, reflète l’état de santé mentale de l’Utilisateur.
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Le questionnaire permet à l’Utilisateur d’utiliser des champs de texte totalement libres. Pour ce faire, l’Application met à sa disposition
          des espaces « note », dont l’ensemble des informations demeurent sur le téléphone mobile de l’Utilisateur.
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          L’Utilisateur peut se fixer des objectifs à respecter et effectuer un suivi de ces derniers.
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          L’Utilisateur peut personnaliser le questionnaire, en fonction de son état du moment ou de ses difficultés personnelles, via les paramètres
          de l’application. Le suivi peut concerner tous les aspects ayant un impact sur la santé mentale : humeur, ressentis, symptômes,
          comportements, pensées récurrentes, activités quotidiennes, etc. Il peut aussi ajouter ses propres indicateurs.
        </Text>
      </Li>

      <Text className="text-blue-900 text-lg font-bold my-2">4.2 – Beck</Text>
      <Text className="text-blue-900 text-sm my-2">
        Au sein de son espace, l’Utilisateur peut effectuer l’exercice des colonnes de Beck. Cet exercice peut nécessiter des explications et il est
        recommandé d’en discuter préalablement avec un thérapeute.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.3 – Mes Analyses</Text>
      <Text className="text-blue-900 text-sm my-2">Au sein de son espace, l’Utilisateur peut à tout moment accéder :</Text>

      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Aux courbes d’évolution basées sur ses saisies quotidiennes, permettant de suivre son état sur une période de 7 jours.
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">À des statistiques (en diagramme circulaire).</Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">À des frises d’évolution.</Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          À un moteur de recherche (« Déclencheurs ») de ses notes personnelles selon un indicateur et une intensité choisis.
        </Text>
      </Li>

      <Text className="text-blue-900 text-lg font-bold my-2">4.4 – Contacts utiles</Text>
      <Text className="text-blue-900 text-sm my-2">
        S’il le souhaite, l’Utilisateur peut contacter une personne susceptible de l’écouter via une liste de numéros officiels accessibles via «
        Contacts utiles – Soutien 24h/24 – 7J/7 ».
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.5 – Envoyer un récapitulatif de mes données</Text>
      <Text className="text-blue-900 text-sm my-2">
        L’Utilisateur peut exporter les données qu’il renseigne dans l’application sous forme de courriel, via la société française « Sarbacane ». Un
        contrat de sous-traitance conforme au RGPD a été conclu entre la CNAM et Sarbacane, garantissant la sécurité et la confidentialité des
        informations fournies. Aucune donnée n’est transférée à l’équipe Jardin Mental.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.6 – Contacter l’équipe de Jardin Mental</Text>
      <Text className="text-blue-900 text-sm my-2">
        Via la fonction « contribuer à Jardin Mental », l’Utilisateur peut transmettre ses informations de contact à l’équipe.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 5 - Responsabilités</Text>

      <Text className="text-blue-900 text-lg font-bold my-2">5.1 – L’Éditeur de l’Application</Text>
      <Text className="text-blue-900 text-sm my-2">
        Les informations diffusées sont réputées fiables mais l’Application ne garantit pas être exempte de défauts ou d’erreurs.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        L’Éditeur s’engage à sécuriser l’Application et à garantir la confidentialité des informations fournies.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        L’Éditeur assure un accès continu et gratuit à l’Application, mais peut la modifier ou la suspendre sans préavis.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        En cas de non-respect des présentes CGU, l’Éditeur peut rendre l’Application inaccessible à l’Utilisateur fautif.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">5.2 – L’Utilisateur</Text>
      <Text className="text-blue-900 text-sm my-2">L’Utilisateur est responsable de tout contenu renseigné dans l’Application.</Text>
      <Text className="text-blue-900 text-sm my-2">
        Concernant l’envoi du récapitulatif par courriel, il est responsable des informations transmises et des destinataires choisis.
      </Text>
      <Text className="text-blue-900 text-sm my-2">La responsabilité de l’Éditeur ne saurait être engagée pour cette fonctionnalité.</Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 6 - Mise à jour des CGU</Text>
      <Text className="text-blue-900 text-sm my-2">
        Les CGU peuvent être modifiées à tout moment sans préavis selon les évolutions de l’Application ou du cadre légal. Toute modification crée une
        nouvelle version acceptée par l’Utilisateur.
      </Text>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Conditions générales d'utilisation de l'application Jardin Mental" content={content} />;
};

const Li = ({ children }) => (
  <View className="flex flex-row pl-5">
    <Text className="pt-2 mr-2">•</Text>
    {children}
  </View>
);

export default CGU;
