import { INDICATORS_CATEGORIES } from "@/entities/Indicator";
import MoonStar from '@assets/svg/icon/MoonStar'
import Heart from '@assets/svg/icon/Heart'
import Cart from '@assets/svg/icon/Cart'
import Huricane from '@assets/svg/icon/Huricane'
import Cognitive from '@assets/svg/icon/Cognitive'
import HeartHand from '@assets/svg/icon/HeartHand'
import Work from '@assets/svg/icon/Work'
import AlertTriangle from '@assets/svg/icon/AlertTriangle'
import LifeEvent from '@assets/svg/icon/LifeEvent'
import Zap from '@assets/svg/icon/Zap'
import PuzzlePiece from '@assets/svg/icon/PuzzlePiece'
import Substance from '@assets/svg/icon/Substance'


import { Difficulty } from "../types";
import { NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from "@/utils/liste_indicateurs.1";

export const HELP_FOR_CATEGORY: Record<NEW_INDICATORS_CATEGORIES, { title: string, description: string } | null> = {
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: {
        title: 'Comment observer un comportement?',
        description: `Appuyez-vous sur ce que vous avez vécu aujourd’hui : sa fréquence, son intensité ou l’effet qu’il a eu sur vous.\n
Pas besoin d’être précis·e : c’est l’observation régulière qui compte.\n
Il ne s’agit pas de bien ou mal faire, mais de mieux comprendre ce que vous vivez.`
    },
    [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: null,
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: null,
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: {
        title: 'Comment observer une émotion?',
        description: `Pensez à son intensité aujourd’hui, sa durée ou son impact sur vous.\n
Il n’y a pas de bonne réponse — l’essentiel, c’est d’en prendre conscience au fil du temps.`
    },
    [NEW_INDICATORS_CATEGORIES.SLEEP]: null,
    [NEW_INDICATORS_CATEGORIES.WORK]: null,
    [NEW_INDICATORS_CATEGORIES.ENERGY]: null,
    [NEW_INDICATORS_CATEGORIES.FOOD]: null,
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: null,
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: null,
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: null,
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: null
}


export const INDICATOR_CATEGORIES_DATA: Record<NEW_INDICATORS_CATEGORIES, Difficulty> = {
    [NEW_INDICATORS_CATEGORIES.SLEEP]: {
        id: 'sleep',
        name: 'Mon sommeil',
        labelWithSecondPersonPrefix: 'à votre sommeil',
        category: NEW_INDICATORS_CATEGORIES.SLEEP,
        selected: false,
        indicatorText: "Votre sommeil a un impact sur votre vie. Suivez ce qui compte pour vous",
        icon: MoonStar,
        label: 'Sommeil',
        subCat: [
            // NEW_INDICATORS_SUBCATEGORIES.UNRESTORATIVE_SLEEP,
            NEW_INDICATORS_SUBCATEGORIES.SLEEP_DIFFICULTY,
            NEW_INDICATORS_SUBCATEGORIES.BAD_SLEEP_HABITS
        ]
    },
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: {
        id: 'mood',
        category: NEW_INDICATORS_CATEGORIES.EMOTIONS,
        name: 'Mes émotions / Mon humeur',
        labelWithSecondPersonPrefix: 'à votre humeur et vos émotions',
        selected: false,
        label: 'Emotions/humeurs',
        icon: Heart,
        subCat: [
            NEW_INDICATORS_SUBCATEGORIES.POSITIVE_EMOTIONS,
            NEW_INDICATORS_SUBCATEGORIES.NEGATIVE_EMOTIONS,
            NEW_INDICATORS_SUBCATEGORIES.EMOTIONAL_STABILITY
        ]
    },
    [NEW_INDICATORS_CATEGORIES.FOOD]: {
        id: 'food',
        category: NEW_INDICATORS_CATEGORIES.FOOD,
        labelWithSecondPersonPrefix: 'à votre alimentation',
        name: `Mon alimentation`,
        label: 'Alimentation',
        selected: false,
        icon: Cart
    },
    [NEW_INDICATORS_CATEGORIES.ENERGY]: {
        id: 'energy',
        category: NEW_INDICATORS_CATEGORIES.ENERGY,
        labelWithSecondPersonPrefix: 'à votre énergie',
        name: 'Mon énergie',
        selected: false,
        label: 'Énergie',
        icon: Zap,
    },
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: {
        id: 'thought',
        category: NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS,
        labelWithSecondPersonPrefix: 'aux pensées qui prennent de la place',
        name: `Des pensées envahissantes`,
        label: 'Pensées Envahissantes',
        selected: false,
        icon: Huricane
    },
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: {
        id: 'toxic',
        name: `Consommations de produits & addictions`,
        labelWithSecondPersonPrefix: 'à votre consommation ou vos addictions',
        label: `Consommations de produits & addictions`,
        category: NEW_INDICATORS_CATEGORIES.SUBSTANCE,
        indicatorText: 'Précisez quelle consommation de produits ou addictions vous souhaitez observer.',
        selected: false,
        icon: Substance,
        // subCat: [
        //     NEW_INDICATORS_SUBCATEGORIES.BEHAVIORAL_ADDICTION,
        //     NEW_INDICATORS_SUBCATEGORIES.SUBSTANCE_USE
        // ]
    },
    [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: {
        id: 'physical_signs',
        category: NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS,
        labelWithSecondPersonPrefix: 'à votre état physique', 
        name: 'Manifestation physique',
        selected: false,
        label: 'Manifestation physique',
        icon: Heart,
    },
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: {
        id: 'social_relations',
        name: `Mes relations sociales`,
        labelWithSecondPersonPrefix: 'à vos relations avec les autres', 
        label: 'Relations sociales',
        category: NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS,
        selected: false,
        icon: HeartHand,
    },
    [NEW_INDICATORS_CATEGORIES.WORK]: {
        id: 'work_stress',
        labelWithSecondPersonPrefix: 'à votre rapport au travail', 
        name: `Mon travail`,
        label: 'Travail',
        category: NEW_INDICATORS_CATEGORIES.WORK,
        selected: false,
        icon: Work
    },
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: {
        id: 'family_issues',
        name: 'Un événement de vie difficile',
        labelWithSecondPersonPrefix: 'à ce que vous traversez en ce moment', 
        label: 'Un évènement de vie difficile',
        category: NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
        indicatorText: 'Un moment dur ? Notez-le pour prendre du recul plus tard.',
        description: `Divorce, deuil, perte d'emploi...`,
        selected: false,
        icon: LifeEvent
    },
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: {
        id: 'behaviour',
        label: 'Comportements à risque',
        labelWithSecondPersonPrefix: 'à vos comportements à risque ou impulsifs', 
        name: `Des comportements à risque`,
        selected: false,
        category: NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
        indicatorText: 'Dites-moi ce qui vous concerne le plus',
        icon: AlertTriangle
    },
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: {
        id: 'cognitive',
        name: `Cognitif`,
        label: 'Le cognitif',
        labelWithSecondPersonPrefix: 'à votre concentration ou vos facultés mentales', 
        selected: false,
        icon: PuzzlePiece,
        category: NEW_INDICATORS_CATEGORIES.COGNITIVE,
        description: "Mémorisation, attention, projection..."
    }
};
