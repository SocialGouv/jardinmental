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
    title: "Définir mes indicateurs",
    subtitle: `Qu'est-ce qu'un indicateur ?`,
    description: `Un indicateur est un repère sur l'état de votre santé mentale. Cela peut être une émotion, un symptôme ou un comportement.
    \nSuivre leur évolution vous permettra de mieux comprendre ce que vous traversez et d'identifier ce qui influence vos hauts et vos bas.`,
    exemple: `_**_Par exemple_** : si vous dormez mal, vous pourriez suivre la « qualité de votre sommeil » et le « nombre de réveils nocturnes »._`,
    accordion: [
      {
        title: "Comment les choisir ?",
        description: `Concentrez-vous sur les indicateurs qui ont eu un impact sur votre bien-être **ces dernières semaines**.
        \nNous vous conseillons de ne pas choisir plus de 9 indicateurs. Vous serez plus régulier dans votre suivi et cela vous sera plus utile pour comprendre votre fonctionnement !`,
      },
      {
        title: `Comment les paramétrer ?`,
        description: `Vous pouvez accéder aux paramètres de vos indicateurs soit lorsque vous remplissez votre questionnaire quotidien, soit depuis les *Paramètres généraux* (⚙️ en haut à droite) en cliquant sur « *Personnaliser mes indicateurs* » : 
- Pour **modifier vos indicateurs existants** : cliquez sur « *Modifier mon questionnaire* ». Vous pourrez alors supprimer vos indicateurs en cliquant sur la corbeille 🗑️ .
- Pour **créer un nouvel indicateur** : cliquez sur le bouton « Ajouter un nouvel indicateur ». Vous pourrez alors définir le nom de votre indicateur et choisir son échelle d'évaluation. Vous pouvez vous inspirer des exemples proposés ou réactiver un indicateur archivé.`,
      },
    ],
    next: "objectifs",
    matomoId: 1,
  },
  objectifs: {
    icon: <Goal />,
    title: "Définir mes objectifs",
    subtitle: `Qu'est-ce qu'un objectif ?`,
    description: `Un objectif est un petit défi que vous souhaitez réaliser régulièrement pour améliorer ou stabiliser votre bien-être. Cela peut être une activité comme marcher 30 minutes par jour, faire un exercice de respiration ou encore une habitude de soin comme prendre son traitement.`,
    accordion: [
      {
        title: "Comment les choisir ?",
        description: `Commencez par 1 ou 2 objectifs seulement et fixez-vous des objectifs réalistes. C'est beaucoup plus motivant de cocher régulièrement ses réussites que de se décourager avec des objectifs inatteignables ! Vous pouvez aussi ajuster leur fréquence : un objectif peut être quotidien, mais aussi 2 fois par semaine ou seulement le week-end, selon ce qui vous convient. 
\nLeur but est de vous aider à progresser pas à pas, pas de bousculer toutes vos habitudes d'un coup 😊`,
      },
      {
        title: `Comment les paramétrer ?`,
        description: `Vous pouvez accéder aux paramètres de vos objectifs soit lorsque vous remplissez votre questionnaire quotidien, soit depuis les *Paramètres généraux* (⚙️ en haut à droite) en cliquant sur « *Personnaliser mes objectifs* » : 
- Pour **créer un nouvel objectif** : cliquez sur le bouton « Ajouter un objectif ». Vous pourrez alors définir le nom de votre objectif. Vous pouvez vous inspirer des exemples proposés ou réactiver un objectif archivé.
- Pour **modifier vos objectifs existants** :
    - Si vous souhaitez modifier la récurrence d'un objectif existant ou activer / éteindre les rappels, cliquez sur l'icône du stylo 🖊️ à côté de l'objectif en question.
    - Si vous souhaitez supprimer un objectif existant, cliquez sur l'icône du stylo 🖊️ à côté de l'objectif en question puis sur le bouton "Désactiver mon objectif"`,
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
        description: `Pour cela, rendez-vous dans l'onglet « Mes Entrées » et cliquez sur « Renseigner mon état pour ce jour-là ».`,
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
        title: `Jusqu'à combien de jours en arrière puis-je compléter ?`,
        description: `Vous pouvez remplir ou compléter votre questionnaire jusqu'à **7 jours en arrière**. Passé ce délai, il ne sera plus possible de le faire car les souvenirs deviennent moins fiables et risquent de fausser vos données.

👉 **La régularité est essentielle** : plus vous prenez l'habitude de remplir votre questionnaire chaque jour, plus vous aurez une vision claire de ce qui influence votre état — que ce soit positivement ou négativement.`,
      },
    ],
    next: "analyse",
    matomoId: 3,
  },
  analyse: {
    title: "Comprendre mes analyses",
    icon: <TrendUpIcon />,
    description: `Cette section rassemble les données que vous saisissez chaque jour et les met  en perspective. Cela vous permet de suivre l’évolution de votre état et d’identifier les facteurs qui influencent votre bien-être.`,
    accordion: [
      {
        title: "Comment lire mes frises ?",
        description: `Les frises montrent l’évolution de vos indicateurs sur une période donnée. Elles permettent de repérer les variations dans le temps.`,
      },
      {
        title: `Comment lire mes statistiques ?`,
        description: `Les statistiques donnent un bilan global de vos indicateurs sur une période donnée.
Elles ne suivent pas l’évolution de vos indicateur sjour après jour mais offrent une vue d’ensemble de votre état.
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
        description: `Pour renseigner votre traitement, allez dans les *Paramètres généraux* (⚙️ en haut à droite) puis cliquez sur *« Saisir mon traitement »*. Vous pourrez alors ajouter votre traitement en sélectionnant dans la liste le nom de votre médicament, ou en ajouter un.
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
        title: "Qui peut voir mes données ?",
        description: `Les informations personnelles que vous saisissez dans Jardin Mental restent enregistrées uniquement sur votre appareil. Elles ne sont ni partagées ni accessibles à des tiers.
Seules des données anonymisées sur la fréquence d’utilisation de l’application sont recueillies par notre équipe afin d’améliorer continuellement Jardin Mental.`,
      },
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
