import MoonStar from "@assets/svg/icon/MoonStar";
import Heart from "@assets/svg/icon/Heart";
import Cart from "@assets/svg/icon/Cart";
import Huricane from "@assets/svg/icon/Huricane";
import Cognitive from "@assets/svg/icon/Cognitive";
import HeartHand from "@assets/svg/icon/HeartHand";
import Work from "@assets/svg/icon/Work";
import AlertTriangle from "@assets/svg/icon/AlertTriangle";
import LifeEvent from "@assets/svg/icon/LifeEvent";
import Zap from "@assets/svg/icon/Zap";
import PuzzlePiece from "@assets/svg/icon/PuzzlePiece";
import Substance from "@assets/svg/icon/Substance";

import { Difficulty } from "../types";
import { NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from "@/utils/liste_indicateurs.1";

export const HELP_FOR_CATEGORY: Record<
  Exclude<NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_CATEGORIES.OTHER>,
  { title: string; description: string } | null
> = {
  [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: {
    title: "Comment observer un comportement?",
    description: `Notez quotidiennement votre consommation de tabac, alcoool, médicaments hors prescription ou autres substances.\nC'est un repère, uniquement pour vous et sans jugement.`,
  },
  [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: {
    title: "Qu’est-ce qu’une manifestation physique ?",
    description: `Ce sont des sensations corporelles liées au stress ou à l’état émotionnel : douleurs, tensions, maux de tête, troubles digestifs, etc.\n
Observez ce que votre corps vous a signalé aujourd’hui. Ce suivi peut vous aider à faire des liens entre corps et mental.`,
  },
  [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: {
    title: "Comment observer des pensées envahissantes ?",
    description: `Ce sont les pensées qui tournent en boucle, qui prennent beaucoup de place, parfois négatives ou angoissantes.\n
Demandez-vous : est-ce que je me suis laissé submerger par ces pensées aujourd’hui ? Est-ce que cela a eu un impact sur mes émotions ou mon comportement ?\n
Noter leur présence peut aider à les apprivoiser.`,
  },
  [NEW_INDICATORS_CATEGORIES.EMOTIONS]: {
    title: "Comment observer une émotion?",
    description: `Pensez à son intensité aujourd’hui, sa durée ou son impact sur vous.\n
Il n’y a pas de bonne réponse — l’essentiel, c’est d’en prendre conscience au fil du temps.`,
  },
  [NEW_INDICATORS_CATEGORIES.SLEEP]: {
    title: "Comment observer votre sommeil ?",
    description: `Pour observer votre sommeil, posez-vous quelques questions simples : Ai-je mis du temps à m’endormir ? Me suis-je réveillé dans la nuit ? Suis-je reposé ce matin ?\n
Notez la qualité, la durée et les difficultés éventuelles (endormissement, réveils, fatigue au réveil). Vous n’avez pas besoin d’avoir un sommeil "parfait", l’idée est de remarquer ce qui change d’un jour à l’autre.`,
  },
  [NEW_INDICATORS_CATEGORIES.WORK]: {
    title: "Comment observer votre rapport au travail ?",
    description: `Pensez à votre journée de travail ou à votre activité habituelle (études…).\n
Était-ce fluide, difficile, source de stress ou de satisfaction ?\n
Ce suivi permet de prendre conscience des éventuelles tensions ou améliorations possibles.`,
  },
  [NEW_INDICATORS_CATEGORIES.ENERGY]: {
    title: "Comment observer votre niveau d’énergie ?",
    description: `Votre énergie peut varier selon votre sommeil, votre humeur ou ce que vous avez vécu dans la journée.\n
Vous pouvez vous demander : Est-ce que je me sens en forme ou plutôt épuisé ? Ai-je eu envie de faire des choses aujourd’hui ?\n
Il ne s’agit pas de performance, mais de sensations physiques et mentales.`,
  },
  [NEW_INDICATORS_CATEGORIES.FOOD]: {
    title: "Comment observer votre alimentation ?",
    description: `Observez votre rapport à l’alimentation aujourd’hui : Avez-vous eu faim ? Mangé avec plaisir ? Ressenti des compulsions, ou au contraire une perte d’appétit ?\n
Être attentif à votre rapport à la nourriture vous permet de mieux identifier les émotions qui y sont liées.`,
  },
  [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: {
    title: "Comment observer une consommation ou une addiction ?",
    description: `Les émotions influencent la consommation de produits ; et celle-ci influence ensuite les émotions et comportements.\n 
Notez quotidiennement votre consommation de tabac, alcoool, médicaments hors prescription ou autres substances. C'est un repère, uniquement pour vous et sans jugement.`,
  },
  [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: {
    title: "Comment observer vos relations sociales ?",
    description: `Pensez à vos échanges du jour : Ai-je vu du monde ? Ai-je eu envie d’être seul·e ou au contraire, de parler à quelqu’un ? Me suis-je senti soutenu, compris ?`,
  },
  [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: {
    title: "Comment observer un événement difficile ?",
    description: `Un évènement de vie difficile (deuil, rupture, chômage, conflit, maladie ...) peut avoir un impact sur votre état mental ou émotionnel.\n
Prendre un moment pour le noter peut vous aider à reconnaître son effet sur vos difficultés.`,
  },
  [NEW_INDICATORS_CATEGORIES.COGNITIVE]: {
    title: "Comment observer vos capacités cognitives ?",
    description: `Il s’agit de vos facultés mentales du jour : concentration, mémoire, clarté d’esprit. Vous pouvez vous demander : Ai-je eu du mal à me concentrer ? À retenir des choses ? À penser clairement ?\n 
Observer ces variations peut aider à mieux comprendre vos ressources ou limites du moment.`,
  },
};

export const INDICATOR_CATEGORIES_DATA: Record<NEW_INDICATORS_CATEGORIES, Difficulty> = {
  [NEW_INDICATORS_CATEGORIES.SLEEP]: {
    id: "sleep",
    name: "Mon sommeil",
    labelWithSecondPersonPrefix: "à votre sommeil",
    category: NEW_INDICATORS_CATEGORIES.SLEEP,
    selected: false,
    indicatorText: "Votre sommeil a un impact sur votre vie. Suivez ce qui compte pour vous",
    icon: MoonStar,
    label: "Sommeil",
    subCat: [
      // NEW_INDICATORS_SUBCATEGORIES.UNRESTORATIVE_SLEEP,
      NEW_INDICATORS_SUBCATEGORIES.SLEEP_DIFFICULTY,
      NEW_INDICATORS_SUBCATEGORIES.BAD_SLEEP_HABITS,
    ],
  },
  [NEW_INDICATORS_CATEGORIES.EMOTIONS]: {
    id: "mood",
    category: NEW_INDICATORS_CATEGORIES.EMOTIONS,
    name: "Mes émotions / Mon humeur",
    labelWithSecondPersonPrefix: "à votre humeur et vos émotions",
    selected: false,
    label: "Emotions/humeurs",
    icon: Heart,
    subCat: [
      NEW_INDICATORS_SUBCATEGORIES.POSITIVE_EMOTIONS,
      NEW_INDICATORS_SUBCATEGORIES.NEGATIVE_EMOTIONS,
      NEW_INDICATORS_SUBCATEGORIES.EMOTIONAL_STABILITY,
    ],
  },
  [NEW_INDICATORS_CATEGORIES.FOOD]: {
    id: "food",
    category: NEW_INDICATORS_CATEGORIES.FOOD,
    labelWithSecondPersonPrefix: "à votre alimentation",
    name: `Mon alimentation`,
    label: "Alimentation",
    selected: false,
    icon: Cart,
  },
  [NEW_INDICATORS_CATEGORIES.ENERGY]: {
    id: "energy",
    category: NEW_INDICATORS_CATEGORIES.ENERGY,
    labelWithSecondPersonPrefix: "à votre énergie",
    name: "Mon énergie",
    selected: false,
    label: "Énergie",
    icon: Zap,
  },
  [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: {
    id: "thought",
    category: NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS,
    labelWithSecondPersonPrefix: "aux pensées qui prennent de la place",
    name: `Des pensées envahissantes`,
    label: "Pensées Envahissantes",
    selected: false,
    icon: Huricane,
  },
  [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: {
    id: "toxic",
    name: `Consommations de produits & addictions`,
    labelWithSecondPersonPrefix: "à votre consommation ou vos addictions",
    label: `Consommations de produits & addictions`,
    category: NEW_INDICATORS_CATEGORIES.SUBSTANCE,
    indicatorText: "Précisez quelle consommation de produits ou addictions vous souhaitez observer.",
    selected: false,
    icon: Substance,
    // subCat: [
    //     NEW_INDICATORS_SUBCATEGORIES.BEHAVIORAL_ADDICTION,
    //     NEW_INDICATORS_SUBCATEGORIES.SUBSTANCE_USE
    // ]
  },
  [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: {
    id: "physical_signs",
    category: NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS,
    labelWithSecondPersonPrefix: "à votre état physique",
    name: "Manifestation physique",
    selected: false,
    label: "Manifestation physique",
    icon: Heart,
  },
  [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: {
    id: "social_relations",
    name: `Mes relations sociales`,
    labelWithSecondPersonPrefix: "à vos relations avec les autres",
    label: "Relations sociales",
    category: NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS,
    selected: false,
    icon: HeartHand,
  },
  [NEW_INDICATORS_CATEGORIES.WORK]: {
    id: "work_stress",
    labelWithSecondPersonPrefix: "à votre rapport au travail",
    name: `Mon travail`,
    label: "Travail",
    category: NEW_INDICATORS_CATEGORIES.WORK,
    selected: false,
    icon: Work,
  },
  [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: {
    id: "family_issues",
    name: "Un événement de vie difficile",
    labelWithSecondPersonPrefix: "à ce que vous traversez en ce moment",
    label: "Un évènement de vie difficile",
    category: NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
    indicatorText: "Un moment dur ? Notez-le pour prendre du recul plus tard.",
    description: `Divorce, deuil, perte d'emploi...`,
    selected: false,
    icon: LifeEvent,
  },
  [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: {
    id: "behaviour",
    label: "Comportements à risque",
    labelWithSecondPersonPrefix: "à vos comportements à risque ou impulsifs",
    name: `Des comportements à risque`,
    selected: false,
    category: NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
    indicatorText: "Dites-moi ce qui vous concerne le plus",
    icon: AlertTriangle,
  },
  [NEW_INDICATORS_CATEGORIES.COGNITIVE]: {
    id: "cognitive",
    name: `Cognitif`,
    label: "Le cognitif",
    labelWithSecondPersonPrefix: "à votre concentration ou vos facultés mentales",
    selected: false,
    icon: PuzzlePiece,
    category: NEW_INDICATORS_CATEGORIES.COGNITIVE,
    description: "Mémorisation, attention, projection...",
  },
  [NEW_INDICATORS_CATEGORIES.OTHER]: {
    id: "other",
    name: `Autre`,
    label: "Autre",
    labelWithSecondPersonPrefix: "à votre concentration ou vos facultés mentales",
    selected: false,
    icon: PuzzlePiece,
    category: NEW_INDICATORS_CATEGORIES.COGNITIVE,
    description: "Mémorisation, attention, projection...",
  },
};
