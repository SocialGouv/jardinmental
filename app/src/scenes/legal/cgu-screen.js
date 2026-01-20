import React from "react";
import LegalScreen from "./legal-screen";
import { View } from "react-native";
import { Typography } from "@/components/Typography";
import Text from "../../components/MyText";

const CGU = ({ navigation }) => {
  const content = (
    <View className="px-2">
      <Typography className="text-blue-900 text-sm my-2">
        Les présentes conditions générales d’utilisation (ci-après « CGU ») fixent le cadre juridique de l’Application Jardin Mental (ci-après
        « Application ») et définissent les conditions d’accès et d’utilisation des Services par l’Utilisateur.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-3">Article 1 - Champ d’Application</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Application peut être téléchargée sans création de compte et demeure d’accès libre. L’utilisation de l’Application est subordonnée au
        respect et à l’acceptation des présentes CGU.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-3">Article 2 - Objet</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Application vise à accompagner les personnes qui le souhaitent à mieux connaître leur santé mentale et suivre leurs symptômes, leurs
        ressentis, leurs comportements, leurs pensées, ou toute activité personnalisée, leur permettant ainsi de faciliter leur accompagnement
        psychologique, notamment par un ou une professionnel(le) de santé ou psychologue.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-3">Article 3 – Définitions</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        « Application » désigne l’Application mobile Jardin Mental sous la responsabilité de la Caisse Nationale d’Assurance Maladie (CNAM) à
        l’initiative de la Fabrique numérique des ministères sociaux.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        « Éditeur » désigne la personne morale qui met à la disposition du public l’Application, à savoir la Caisse Nationale d’Assurance Maladie
        (CNAM).
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        « Services » désigne les fonctionnalités proposées par l’Application pour répondre à ses finalités.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        « Utilisateur » désigne toute personne physique qui télécharge l’Application et l’utilise après avoir accepté les présentes CGU.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-3">Article 4 - Fonctionnalités</Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">
        4.1 – Rubrique « Suivre » pour compléter son questionnaire d’auto-observation
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Au sein de son espace, l’Utilisateur peut s’aider du questionnaire qui lui permet de renseigner et de suivre son état par plusieurs moyens :
      </Typography>

      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Remplir le questionnaire ou renseigner son état, est accessible via « Suivre » par un simple clic, et peut se remplir de manière
          journalière. De plus, l’Utilisateur peut remplir l’état pour les précédentes journées s’il ne l’a pas fait le jour même (dans une amplitude
          de 7 jours) ;
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Renseigner son état, notamment en renseignant l’intensité des indicateurs de son choix, reflète l’état de santé mentale de l’Utilisateur ;
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Le questionnaire permet à l’Utilisateur d’utiliser des champs de texte totalement libres. Pour ce faire, l’Application met à sa disposition
          des espaces « note », dont l’ensemble des informations demeurent sur le téléphone mobile de l’Utilisateur ;
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          L’Utilisateur peut se fixer des objectifs à respecter et effectuer un suivi de ces derniers ;
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          L’Utilisateur peut personnaliser le questionnaire, en fonction de son état du moment ou de ses difficultés personnelles, accessible via les
          paramètres de l’Application. Cela permet de cibler le suivi souhaité. Le suivi peut concerner tous les aspects qui sont le reflet ou ont un
          impact sur la santé mentale de l’Utilisateur : humeur, ressentis, symptômes physiques, comportements spécifiques, pensées récurrentes,
          activités quotidiennes, etc ... L’Utilisateur peut également ajouter d’autres indicateurs qui lui sont propres et qui ne figureraient pas
          dans la liste.
        </Typography>
      </Li>

      <Typography className="text-blue-900 text-lg font-bold my-2">
        4.2 Rubrique « Analyser » pour prendre du recul ou repérer les tendances
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">Au sein de son espace, l’Utilisateur peut à tout moment accéder :</Typography>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Aux courbes d’évolution qui apparaissent au fur et à mesure des saisies quotidiennes et qui permettent de suivre son état sur différentes
          périodes allant de 7 jours à plus.
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">Aux statistiques (en diagramme circulaire)</Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Aux variations de ses indicateurs suivis sous forme de courbes d’évolution sur une période d’une semaine
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          Aux Tendances et liens : cet onglet permet de comparer jusqu’à 2 indicateurs entre eux pour identifier leurs évolutions et éventuellement
          des liens entre indicateurs
        </Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">Aux frises d’évolution</Typography>
      </Li>
      <Li>
        <Typography className="text-blue-900 text-sm my-2">
          A un moteur de recherche (« Déclencheurs ») de ses notes personnelles en lien avec un indicateur et une intensité de son choix
        </Typography>
      </Li>

      <Typography className="text-blue-900 text-lg font-bold my-2">
        4.3 – Rubrique « S’informer » pour mieux connaître la santé mentale, ses enjeux et les solutions disponibles
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Au sein de cette rubrique, l’Utilisateur trouve une bibliothèque de ressources externes fiables et validées par un comité éditorial et
        scientifique. Ces ressources (articles, vidéos, podcasts, etc.) sont organisées autour de 5 grands thèmes pour mieux connaître la santé
        mentale, ses enjeux et les solutions disponibles.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">
        4.4 - Rubrique « Agir » pour explorer et tester des outils pour agir en fonction de ses besoins
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Cette rubrique offre à l’Utilisateur des liens vers des exercices, vidéos, questionnaires, gratuits, validés par un comité éditorial et
        scientifique.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Utilisateur peut naviguer dans une boîte de plus de 60 outils grâce à des filtres, les outils sont classés selon différentes catégories.
        L’Utilisateur peut également mettre en favoris ses outils préférés pour les retrouver plus facilement.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">
        4.5 - Rubrique « Personnaliser » pour adapter son questionnaire à tout moment en fonction de sa situation
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Utilisateur peut personnaliser à tout moment son questionnaire de suivi : modifier, ajouter ou retirer des indicateurs ; des objectifs ; des
        traitements ; ajouter ou modifier un rappel programmé. Depuis cette rubrique l’Utilisateur peut générer sous format d’un fichier PDF un
        récapitulatif de ses données renseignées sur les 30 derniers jours dans l’Application. Aucune donnée n’est transférée à l’équipe de Jardin
        Mental. L’Utilisateur peut ensuite le partager avec la personne de son choix. L’Utilisateur peut également générer un fichier de sauvegarde de
        ses données afin de pouvoir les ré-importer dans un autre appareil.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">4.6 – Rubrique « Soutien 24h/24h – 7j/7 »</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Cette rubrique recense une liste de numéros d’urgence et de lignes d’écoutes gratuites et anonymes.
      </Typography>
      <Typography className="text-blue-900 text-lg font-bold my-2">4.7 – Rubrique « Plus d’infos »</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Cette rubrique propose une foire aux questions, la liste des membres du comité éditorial et scientifique.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Elle permet également à l’Utilisateur de donner son avis, ou de contacter l’équipe via une adresse mail de contact :
        jardinmental@fabrique.social.gouv.fr
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Utilisateur peut également recommander l’Application à une personne de son choix.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-3">Article 5 - Responsabilités</Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">5.1 – L’Éditeur de l’Application</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Les sources des informations diffusées sur l’Application sont réputées fiables mais l’Application ne garantit pas être exempte de défauts,
        d’erreurs ou d’omissions.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Éditeur s’engage à la sécurisation de l’Application, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité
        et la confidentialité des informations fournies.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie financière, à l’Application Il se
        réserve la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, l’Application pour des raisons de maintenance ou pour tout
        autre motif jugé nécessaire.
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        En cas de manquement à une ou plusieurs des stipulations des présentes CGU, l’Éditeur se réserve le droit de rendre inaccessible l’accès à
        l’Application à l’Utilisateur responsable.
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2">5.2 – L’Utilisateur</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        L’Utilisateur est seul responsable de tout contenu qu’il renseigne sur l’Application. Il s’engage notamment à ne pas mettre en ligne de
        contenus ou informations contraires au cadre juridique en vigueur.{" "}
      </Typography>
      <Typography className="text-blue-900 text-sm my-2">
        En cas d’utilisation de la fonctionnalité « Générer un récapitulatif » prévue à l’article 4.5, l’Utilisateur demeure seul responsable des
        éléments renseignés dans le récapitulatif et des personnes qui vont recevoir ce fichier.
      </Typography>
      <Typography className="text-blue-900 text-lg font-bold my-3">Article 6 - Mise à jour des conditions générales d’utilisation</Typography>
      <Typography className="text-blue-900 text-sm my-2">
        Les termes des présentes CGU peuvent être amendés à tout moment, sans préavis, en fonction des modifications apportées à la plateforme, de
        l’évolution de la législation ou pour tout autre motif jugé nécessaire. Chaque modification donne lieu à une nouvelle version qui est acceptée
        par l’Utilisateur.
      </Typography>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Conditions générales d'utilisation de l'Application Jardin Mental" content={content} />;
};

const Li = ({ children }) => (
  <View className="flex flex-row pl-5">
    <Typography className="pt-2 mr-2">•</Typography>
    {children}
  </View>
);

export default CGU;
