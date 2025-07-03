import { INDICATORS_CATEGORIES } from "@/entities/Indicator";

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
