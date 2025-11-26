import CalendarIcon from "@assets/svg/icon/Calendar";
import Goal from "@assets/svg/icon/Goal";
import HealthIcon from "@assets/svg/icon/Health";
import ShareIcon from "@assets/svg/icon/Share";
import TrendUpIcon from "@assets/svg/icon/TrendUp";
import Pencil from "@assets/svg/icon/Pencil";
import LockerIcon from "@assets/svg/icon/Locker";

type FaqSlug = "indicateurs" | "objectifs" | "questionnaire" | "analyse" | "traitement" | "données" | "confidentialité";
interface FaqDataEntry {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  description: string;
  exemple?: string;
  accordion: {
    title: string;
    description: string;
  }[];
  matomoId: number;
  next: FaqSlug;
}

export const FAQ_DATA: Record<FaqSlug, FaqDataEntry> = {
  indicateurs: {
    icon: <Pencil />,
    title: "Paramétrer mes indicateurs",
    description: `Un indicateur est un repère sur l’état de votre santé mentale. Cela peut être une émotion, un symptôme ou un comportement.`,
    exemple: `_**_Par exemple_** : si vous dormez mal, vous pourriez suivre la « qualité de votre sommeil » et le « nombre de réveils nocturnes »._`,
    accordion: [
      {
        title: "Comment les choisir ?",
        description: `Concentrez-vous sur les indicateurs qui ont eu un impact sur votre bien-être **ces dernières semaines**.
        \nNous vous conseillons de ne pas choisir plus de 9 indicateurs. Vous serez plus régulier dans votre suivi et cela vous sera plus utile pour comprendre votre fonctionnement !`,
      },
      {
        title: `Comment créer un nouvel indicateur ?`,
        description: `- Rendez-vous dans les Paramètres Généraux de l’application (⚙️ en haut à droite) ; 
- Choisissez l’option « Personnaliser mes indicateurs » ;
- Cliquez ensuite sur le bouton  « Ajouter un nouvel indicateur ».`,
      },
      {
        title: `Comment supprimer un indicateur existant ?`,
        description: `- Rendez-vous dans les Paramètres Généraux de l’application (⚙️ en haut à droite) ; 
- Choisissez l’option « Personnaliser mes indicateurs » ; 
- Cliquez sur « Modifier mon questionnaire » ; 
- Puis sur la corbeille 🗑️ à côté de l’indicateur à retirer. `,
      },
    ],
    next: "objectifs",
    matomoId: 1,
  },
  objectifs: {
    icon: <Goal />,
    title: "Paramétrer mes objectifs",
    description: `Un objectif est une petit défi que vous souhaitez réaliser régulièrement pour améliorer ou stabiliser votre bien-être (par exemple : marcher 30 minutes par jour ou prendre votre traitement).`,
    accordion: [
      {
        title: "Comment les choisir ?",
        description: `Nous vous conseillons de vous fixer 1 ou 2 objectifs réalistes. Il est plus encourageant de célébrer des petites réussites régulières que de se décourager avec des buts inatteignables !`,
      },
      {
        title: `Comment créer un nouvel objectif ?`,
        description: `- Rendez-vous dans les Paramètres Généraux (⚙️ en haut à droite) ;
- Choisissez l’option « Personnaliser mes objectifs » ;
- Cliquez sur le bouton « Ajouter un objectif ». Vous pourrez alors définir le nom de votre objectif, sa fréquence et activer un rappel.`,
      },
      {
        title: "Comment modifier un objectif existant ?",
        description: `- Rendez-vous dans les Paramètres Généraux (⚙️ en haut à droite) ;
- Choisissez l’option « Personnaliser mes objectifs » ;
- Cliquez sur l’icône du stylo 🖊️ à côté de l’objectif en question. Vous pourrez alors modifier sa récurrence et activer / éteindre les rappels.`,
      },
      {
        title: "Comment supprimer un objectif existant ? ",
        description: `- Rendez-vous dans les Paramètres Généraux (⚙️ en haut à droite) ;
- Choisissez l’option « Personnaliser mes objectifs » ; 
- Cliquez sur l’icône du stylo 🖊️ à côté de l’objectif en question. Vous pourrez alors cliquer sur "Désactiver".`,
      },
    ],
    next: "questionnaire",
    matomoId: 2,
  },
  questionnaire: {
    icon: <CalendarIcon />,
    title: "Faire mon suivi quotidien",
    description: `Chaque jour, prenez quelques minutes pour faire le point sur votre santé mentale.`,
    accordion: [
      {
        title: "Comment remplir mon questionnaire ?",
        description: `Rendez-vous dans l’onglet « Mes Entrées » et cliquez sur « Renseigner mon état pour ce jour-là ».`,
      },
      {
        title: `Que puis-je renseigner chaque jour ?`,
        description: `Vous pourrez :

- évaluer vos indicateurs ;
- cocher les objectifs atteints ;
- ajouter une note pour préciser un événement marquant ;
- indiquer si vous avez consommé des substances ;
- confirmer la prise de votre traitement (si vous en avez renseigné un) ;
- noter une prise de médicament "si besoin".
`,
      },
      {
        title: `Jusqu’à quand puis-je compléter mon questionnaire ?`,
        description: `Vous pouvez remplir ou compléter votre questionnaire jusqu'à **7 jours en arrière**. Passé ce délai, il ne sera plus possible de le faire car les souvenirs deviennent moins fiables et risquent de fausser vos données.`,
      },
    ],
    next: "analyse",
    matomoId: 3,
  },
  analyse: {
    title: "Comprendre mes analyses",
    icon: <TrendUpIcon />,
    description: `Cette section rassemble les données que vous saisissez chaque jour et les met en perspective. Cela vous permet de suivre l’évolution de votre état et d’identifier les facteurs qui influencent votre bien-être.`,
    accordion: [
      {
        title: "Comment lire mes frises ?",
        description: `Les frises montrent l’évolution de vos indicateurs sur une période donnée. Elles permettent de repérer les variations dans le temps.`,
      },
      {
        title: `Comment lire mes statistiques ?`,
        description: `Les statistiques donnent un bilan global de vos indicateurs sur une période donnée.
Elles ne suivent pas l’évolution de vos indicateurs jour après jour mais offrent une vue d’ensemble de votre état.
Vous y trouverez aussi le taux de réussite de vos objectifs.`,
      },
      {
        title: `Comment lire mes courbes ?`,
        description: `Les courbes affichent l’évolution de vos indicateurs, jour après jour, semaine par semaine.
En cliquant sur un point, vous pouvez retrouver le contexte d’une journée précise.`,
      },
      {
        title: `Comment lire mes déclencheurs ?`,
        description: `Les déclencheurs affichent, pour l’indicateur et l’intensité choisis, les notes que vous avez écrites dans vos questionnaires quotidiens.
Ils vous aident à repérer les situations ou facteurs qui influencent vos indicateurs.`,
      },
    ],
    next: "traitement",
    matomoId: 4,
  },
  traitement: {
    icon: <HealthIcon />,
    title: "Renseigner mon traitement",
    description: `Jardin Mental vous permet de suivre la prise de votre traitement si votre professionnel de santé vous en a prescrit un.`,
    accordion: [
      {
        title: "Comment ajouter mon traitement ?",
        description: `Rendez-vous dans les *Paramètre généraux* (⚙️ en haut à droite) puis choisissez *« Saisir mon traitement ».* Vous pourrez alors sélectionner votre médicament dans la liste ou en ajouter un.
Un rappel apparaîtra dans votre questionnaire quotidien.`,
      },
      {
        title: `Puis-je créer un traitement qui n'est pas dans la liste ?`,
        description: `Si vous ne trouvez pas votre traitement dans la liste, vous pouvez créer une nouvelle entrée en cliquant sur le symbole ➕. `,
      },
    ],
    next: "données",
    matomoId: 5,
  },
  données: {
    title: "Gérer mes données",
    description: `Cette section répond à vos questions sur le récapitulatif de vos données et son utilisation.`,
    accordion: [
      {
        title: "À quoi sert la génération de récapitulatif de mes données ?",
        description: `Si vous êtes suivi·e par un·e professionnel·le de santé, vous pouvez si vous le souhaitez lui partager vos données.
        Ces informations lui permettront d'avoir une vue d'ensemble de votre état entre vos consultations et l'aideront à adapter son accompagnement et / ou votre traitement en conséquence.`,
      },
      {
        title: `Comment générer un récapitulatif de mes données ?`,
        description: `- Rendez-vous dans les *Paramètres généraux* (⚙️ en haut à droite) ;
- Cliquez sur « *Générer un récapitulatif de mes données* » ;
- Vous pourrez alors télécharger le fichier au format PDF.`,
      },
    ],
    icon: <ShareIcon />,
    next: "confidentialité",
    matomoId: 6,
  },
  confidentialité: {
    title: "Confidentialité de mes données",
    subtitle: "Qui peut voir mes données ?",
    description: `Les informations personnelles que vous saisissez dans Jardin Mental restent enregistrées uniquement sur votre appareil. Elles ne sont ni partagées ni accessibles à des tiers.\n
Seules des données anonymisées sur la fréquence d’utilisation de l’application sont recueillies par notre équipe afin d’améliorer continuellement Jardin Mental.`,
    accordion: [],
    icon: <LockerIcon />,
    next: "indicateurs",
    matomoId: 7,
  },
};
