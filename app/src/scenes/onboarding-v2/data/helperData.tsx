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
import { Difficulty } from "../types";
import { NEW_INDICATORS, NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from "@/utils/liste_indicateurs.1";

export const HELP_FOR_CATEGORY: Record<INDICATORS_CATEGORIES, { title: string, description: string } | null> = {
    [INDICATORS_CATEGORIES["Comportements"]]: {
        title: 'Comment observer un comportement?',
        description: `Appuyez-vous sur ce que vous avez vécu aujourd’hui : sa fréquence, son intensité ou l’effet qu’il a eu sur vous.\n
Pas besoin d’être précis·e : c’est l’observation régulière qui compte.\n
Il ne s’agit pas de bien ou mal faire, mais de mieux comprendre ce que vous vivez.`
    },
    [INDICATORS_CATEGORIES["Manifestations physiques"]]: null,
    [INDICATORS_CATEGORIES["Pensées"]]: null,
    [INDICATORS_CATEGORIES["Emotions/sentiments"]]: {
        title: 'Comment observer une émotion?',
        description: `Pensez à son intensité aujourd’hui, sa durée ou son impact sur vous.\n
Il n’y a pas de bonne réponse — l’essentiel, c’est d’en prendre conscience au fil du temps.`
    }
}

export const INDICATOR_CATEGORIES_DATA: Record<NEW_INDICATORS_CATEGORIES, Difficulty> = {
    [NEW_INDICATORS_CATEGORIES.SLEEP]: {
        id: 'sleep',
        name: 'Mon sommeil',
        category: NEW_INDICATORS_CATEGORIES.SLEEP,
        selected: false,
        icon: MoonStar,
        label: 'Sommeil',
        subCat: [
            NEW_INDICATORS_SUBCATEGORIES.UNRESTORATIVE_SLEEP,
            NEW_INDICATORS_SUBCATEGORIES.SLEEP_DIFFICULTY,
            NEW_INDICATORS_SUBCATEGORIES.BAD_SLEEP_HABITS
            // {
            //     id: 'unrestorative-sleep',
            //     name: `Mon sommeil n'est pas réparateur ou régulier`
            // },
            // {
            //     id: 'sleep-difficulty',
            //     name: `J’ai des difficultés à dormir ou je dors mal`
            // },
            // {
            //     id: 'bad-sleep-habits',
            //     name: `Certaines habitudes gênent mon sommeil`
            // }
        ]
    },
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: {
        id: 'mood',
        category: NEW_INDICATORS_CATEGORIES.EMOTIONS,
        name: 'Mes émotions / Mon humeur',
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
        name: `Mon alimentation`,
        label: 'Alimentation',
        selected: false,
        icon: Cart
    },
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: {
        id: 'thought',
        category: NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS,
        name: `Des pensées envahissantes`,
        label: 'Pensées Envahissantes',
        selected: false,
        icon: Huricane
    },
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: {
        id: 'toxic',
        name: `Ma consommation de produits`,
        label: `Consommations de produits & addictions`,
        category: NEW_INDICATORS_CATEGORIES.SUBSTANCE,
        selected: false,
        icon: Cognitive,
        subCat: [
            NEW_INDICATORS_SUBCATEGORIES.BEHAVIORAL_ADDICTION,
            NEW_INDICATORS_SUBCATEGORIES.SUBSTANCE_USE
        ]
    },
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: {
        id: 'social_relations',
        name: `Mes relations sociales`,
        label: 'Relations sociales',
        category: NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS,
        selected: false,
        icon: HeartHand,
    },
    [NEW_INDICATORS_CATEGORIES.WORK]: {
        id: 'work_stress',
        name: `Mon travail`,
        label: 'Travail',
        category: NEW_INDICATORS_CATEGORIES.WORK,
        selected: false,
        icon: Work
    },
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: {
        id: 'family_issues',
        name: 'Un événement de vie difficile',
        label: 'Un évènement de vie difficile',
        category: NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
        description: `Divorce, deuil, perte d'emploi...`,
        selected: false,
        icon: LifeEvent
    },
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: {
        id: 'behaviour',
        label: 'Comportements à risque',
        name: `Des comportements à risque`,
        selected: false,
        category: NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
        icon: AlertTriangle
    },
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: {
        id: 'cognitive',
        name: `Cognitif`,
        label: 'Cognitif',
        selected: false,
        icon: Cognitive,
        category: NEW_INDICATORS_CATEGORIES.COGNITIVE,
        description: "Mémorisation, attention, projection..."
    }
};

export const difficultiesData: Difficulty[] = [
    {
        id: 'sleep',
        name: 'Mon sommeil',
        category: NEW_INDICATORS_CATEGORIES.SLEEP,
        selected: false,
        icon: MoonStar,
        subCat: [
            {
                id: 'unrestorative-sleep',
                name: `Mon sommeil n'est pas réparateur ou régulier`
            },
            {
                id: 'sleep-difficulty',
                name: `J’ai des difficultés à dormir ou je dors mal`
            },
            {
                id: 'bad-sleep-habits',
                name: `Certaines habitudes gênent mon sommeil`
            }
        ]
    },
    {
        id: 'mood',
        category: NEW_INDICATORS_CATEGORIES.EMOTIONS,
        name: 'Mes émotions / Mon humeur',
        selected: false,
        icon: Heart,
        subCat: [
            {
                id: 'positive-emotions',
                name: `Emotions positivies`
            },
            {
                id: 'negative-emotions',
                name: `Emotions négatives`
            },
            {
                id: 'emotional-stability',
                name: `Stabilité émotionnelle`
            }
        ]
    },
    {
        id: 'food',
        category: NEW_INDICATORS_CATEGORIES.FOOD,
        name: `Mon alimentation`,
        selected: false,
        icon: Cart,
        subCat: [
            {
                id: 'food-relationship',
                name: `Rapport à l'alimentation`
            },
            {
                id: 'appetite',
                name: `Appétit`
            }
        ]
    },
    {
        id: 'thought',
        category: NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS,
        name: `Des pensées envahissantes`,
        selected: false,
        icon: Huricane
    },
    {
        id: 'toxic',
        name: `Ma consommation de produits`,
        category: NEW_INDICATORS_CATEGORIES.SUBSTANCE,
        selected: false,
        icon: Cognitive,
        subCat: [
            {
                id: 'substance-use',
                name: `Consommation de produit`
            },
            {
                id: 'behavioral-addiction',
                name: `Addiction sans substance`
            }
        ]
    },
    {
        id: 'social_relations',
        name: `Mes relations sociales`,
        category: NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS,
        selected: false,
        icon: HeartHand
    },
    {
        id: 'work_stress',
        name: `Mon travail`,
        category: NEW_INDICATORS_CATEGORIES.WORK,
        selected: false,
        icon: Work
    },
    {
        id: 'family_issues',
        name: 'Un événement de vie difficile',
        category: NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
        description: `Divorce, deuil, perte d'emploi...`,
        selected: false,
        icon: LifeEvent
    },
    {
        id: 'behaviour',
        name: `Des comportements à risque`,
        selected: false,
        category: NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
        icon: AlertTriangle
    },
    {
        id: 'cognitive',
        name: `Cognitif`,
        selected: false,
        icon: Cognitive,
        category: NEW_INDICATORS_CATEGORIES.COGNITIVE,
        description: "Mémorisation, attention, projection..."
    }
];