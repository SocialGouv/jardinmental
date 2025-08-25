import React from "react";
import LegalScreen from "./legal-screen";
import { View } from "react-native";
import Text from "../../components/MyText";

const CGU = ({ navigation }) => {
  const content = (
    <View className="px-2">
      <Text className="text-blue-900 text-sm my-2">
        Les présentes conditions générales d'utilisation (ci-après « CGU ») fixent le cadre juridique de l'application Jardin Mental (ci-après «
        Application ») et définissent les conditions d'accès et d'utilisation des Services par l'Utilisateur.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 1 - Champ d'application</Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Application peut être téléchargée sans création de compte et demeure d'accès libre. L'utilisation de l'Application est subordonnée au
        respect et à l'acceptation des présentes CGU.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 2 - Objet</Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Application vise à accompagner les personnes qui le souhaitent à mieux connaître leur santé mentale et suivre leurs symptômes, leurs
        ressentis, leurs comportements, leurs pensées, ou toute activité personnalisée, leur permettant ainsi de faciliter leur accompagnement
        psychologique, notamment par un ou une professionnel(le) de santé.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 3 - Définitions</Text>
      <Text className="text-blue-900 text-sm my-2">
        « Application » désigne l'application mobile Jardin Mental sous la responsabilité de la Direction générale de la santé (DGS) à l'initiative de
        la Fabrique numérique des ministères sociaux
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Éditeur » désigne la personne morale qui met à la disposition du public l'Application, à savoir la DGS
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Services » désigne les fonctionnalités proposées par l'Application pour répondre à ses finalités
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        « Utilisateur » désigne toute personne physique qui télécharge l'application et l'utilise après avoir accepté les présentes CGU
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 4 - Fonctionnalités</Text>
      <Text className="text-blue-900 text-lg font-bold my-2">4.1 - S'aider du questionnaire via « Mes Entrées »</Text>
      <Text className="text-blue-900 text-sm my-2">
        Au sein de son espace, l'Utilisateur peut s'aider du questionnaire qui lui permet de suivre son état par plusieurs moyens :
      </Text>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Remplir le questionnaire ou renseigner son état, est accessible via « Mes Entrées » par un simple clic, et peut se remplir de manière
          journalière. De plus, l'Utilisateur peut remplir l'état pour les précédentes journées s'il ne l'a pas fait le jour même (dans une amplitude
          de 7 jours) ;
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Renseigner son état, notamment en renseignant l'intensité des indicateurs de son choix, reflète l'état de santé mentale de l'Utilisateur ;
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Le questionnaire permet à l'Utilisateur d'utiliser des champs de texte totalement libres. Pour ce faire, l'Application met à sa disposition
          des espaces « note », dont l'ensemble des informations demeurent sur le téléphone mobile de l'Utilisateur ;
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          L'Utilisateur peut se fixer des objectifs à respecter et effectuer un suivi de ces derniers ;
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          L'Utilisateur peut personnaliser le questionnaire, en fonction de son état du moment ou de ses difficultés personnelles, accessible via les
          paramètres de l'application. Cela permet de cibler le suivi souhaité. Le suivi peut concerner tous les aspects qui sont le reflet ou ont un
          impact sur la santé mentale de l'Utilisateur : humeur, ressentis, symptômes physiques, comportements spécifiques, pensées récurrentes,
          activités quotidiennes, etc ... L'Utilisateur peut également ajouter d'autres indicateurs qui lui sont propres et qui ne figureraient pas
          dans la liste.
        </Text>
      </Li>

      <Text className="text-blue-900 text-lg font-bold my-2">4.2 - Beck</Text>
      <Text className="text-blue-900 text-sm my-2">
        Au sein de son espace, l'Utilisateur peut effectuer l'exercice des colonnes de Beck. Cet exercice peut nécessiter des explications afin de le
        réaliser, et il est recommandé d'en discuter préalablement avec un thérapeute.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.3 - Mes Analyses</Text>
      <Text className="text-blue-900 text-sm my-2">Au sein de son espace, l'Utilisateur peut à tout moment accéder :</Text>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          Aux courbes d'évolution qui apparaissent au fur et à mesure des saisies quotidiennes et qui permettent de suivre son état sur des périodes
          de 7 jours.
        </Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">Aux des statistiques (en diagramme circulaire)</Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">Aux frises d'évolution</Text>
      </Li>
      <Li>
        <Text className="text-blue-900 text-sm my-2">
          A un moteur de recherche (« Déclencheurs ») de ses notes personnelles en lien avec un indicateur et une intensité de son choix
        </Text>
      </Li>

      <Text className="text-blue-900 text-lg font-bold my-2">4.4 - Parler à quelqu'un</Text>
      <Text className="text-blue-900 text-sm my-2">
        S'il le souhaite, l'Utilisateur peut contacter une personne susceptible de l'écouter via une liste de numéros officiels accessibles via la
        fonctionnalité « Parler à quelqu'un ».
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.5 - Envoyer un récapitulatif de mes données</Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Utilisateur peut exporter les données qu'il renseigne dans l'application sous format d'un courriel, en l'envoyant à la personne de son choix
        via une solution gérée par la société française « Sarbacane ». Un contrat de sous-traitance conforme aux dispositions de l'article 28-3 du
        RGPD a été conclu entre la DGS et Sarbacane, qui atteste des mesures prises par Sarbacane pour garantir la sécurité et la confidentialité des
        informations fournies par l'Utilisateur. Néanmoins, aucune donnée n'est transférée à l'équipe de Jardin Mental.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">4.6 - Contacter l'équipe de Jardin Mental</Text>
      <Text className="text-blue-900 text-sm my-2">
        Via la fonction « contribuer à Jardin Mental », l'Application permet la mise en contact avec l'équipe si l'Utilisateur souhaite transférer ses
        informations de contact à l'équipe.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 5 - Responsabilités</Text>
      <Text className="text-blue-900 text-lg font-bold my-2">5.1 L'Éditeur de l'Application</Text>
      <Text className="text-blue-900 text-sm my-2">
        Les sources des informations diffusées sur l'application sont réputées fiables mais l'Application ne garantit pas être exempte de défauts,
        d'erreurs ou d'omissions.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Éditeur s'engage à la sécurisation de l'Application, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité
        et la confidentialité des informations fournies.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie financière, à l'Application Il se
        réserve la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, l'Application pour des raisons de maintenance ou pour tout
        autre motif jugé nécessaire.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        En cas de manquement à une ou plusieurs des stipulations des présentes CGU, l'Éditeur se réserve le droit de rendre inaccessible l'accès à
        l'Application à l'Utilisateur responsable.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2">5.2 L'Utilisateur</Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Utilisateur est seul responsable de tout contenu qu'il renseigne sur l'Application. Il s'engage notamment à ne pas mettre en ligne de
        contenus ou informations contraires au cadre juridique en vigueur.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        L'Utilisateur qui utilise la fonctionnalité d'envoi du récapitulatif des données par courriel est seul responsable des éléments qu'il
        renseigne dans le courriel et des personnes qui vont recevoir ses informations. Il doit veiller à ne pas transmettre à des personnes non
        habilitées à en prendre connaissance des données sensibles ou des secrets protégés par la loi.
      </Text>
      <Text className="text-blue-900 text-sm my-2">
        La responsabilité de l'Éditeur ne saurait être engagée dans le cadre de l'utilisation par l'Utilisateur de cette fonctionnalité.
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-3">Article 6 - Mise à jour des conditions générales d'utilisation</Text>
      <Text className="text-blue-900 text-sm my-2">
        Les termes des présentes CGU peuvent être amendés à tout moment, sans préavis, en fonction des modifications apportées à la plateforme, de
        l'évolution de la législation ou pour tout autre motif jugé nécessaire. Chaque modification donne lieu à une nouvelle version qui est acceptée
        par l'Utilisateur.
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
