import {
  categories,
  categoryStates,
  frequence,
  intensity,
  surveyDate,
} from '../constants';

export const surveyData = [
  {
    id: 'day',
    question: 'Commençons ! Pour quel jour souhaites-tu noter tes ressentis',
    answers: [surveyDate.TODAY, surveyDate.YESTERDAY],
    explanation: null,
  },
  {
    id: categories.mood,
    question: 'Quelle a été votre humeur aujourd’hui ?',
    answers: [
      categoryStates.VERY_GOOD,
      categoryStates.GOOD,
      categoryStates.MIDDLE,
      categoryStates.BAD,
      categoryStates.VERY_BAD,
    ],
    explanation:
      'L’humeur varie dans la journée et c’est normal, mais elle peut-être trop basse (quand on\n' +
      'se sent triste par exemple, ou en colère ou irritable), trop haute (quand on se sent\n' +
      'euphorique ou agité) ou varier trop fortement',
  },
  {
    id: `${categories.anxiety}-frequence`,
    question: 'Combien de temps vous êtes-vous senti anxieux aujourd’hui ?',
    answers: [frequence.NEVER, frequence.SEVERAL_TIMES, frequence.MANY_TIMES],
    explanation:
      'L’anxiété est un état d’appréhension, d’inquiétude, de peur ou de tension, désagréable, qui peut être ou non associé à un facteur de stress.',
  },
  {
    id: `${categories.anxiety}-intensity`,
    question: 'A quel point cela a-t-il été pénible ?',
    answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
    explanation:
      'L’anxiété est un état d’appréhension, d’inquiétude, de peur ou de tension, désagréable, qui peut être ou non associé à un facteur de stress.',
  },
  {
    id: `${categories.badThoughts}-frequence`,
    question: 'Avez-vous eu des pensées parasites aujourd’hui ?',
    answers: [frequence.NEVER, frequence.SEVERAL_TIMES, frequence.MANY_TIMES],

    explanation:
      'Ce sont des pensées que l’on ne contrôle pas. Elles peuvent nous envahir sans que l’on ne puisse rien y faire, ou pas beaucoup. Elles peuvent être tristes, angoissantes, effrayantes, gênantes, absurdes … On n’arrive pas à s’en débarrasser et, parfois, on n’arrive pas à penser à autre chose. On peut finir par se sentir triste, en colère, avoir peur ou devenir méfiant, parfois au point de ne plus rien pouvoir faire.',
  },
  {
    id: `${categories.badThoughts}-intensity`,
    question:
      'A quel point ces pensées parasites ont été désagréables/pénibles ?',
    answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
    explanation:
      'Ce sont des pensées que l’on ne contrôle pas. Elles peuvent nous envahir sans que l’on ne puisse rien y faire, ou pas beaucoup. Elles peuvent être tristes, angoissantes, effrayantes, gênantes, absurdes … On n’arrive pas à s’en débarrasser et, parfois, on n’arrive pas à penser à autre chose. On peut finir par se sentir triste, en colère, avoir peur ou devenir méfiant, parfois au point de ne plus rien pouvoir faire.',
  },
  {
    id: `${categories.sensations}-frequence`,
    question:
      'A quelle fréquence les sensations étranges ou les hallucinations ont été présentes aujourd’hui ?',
    answers: [frequence.NEVER, frequence.SEVERAL_TIMES, frequence.MANY_TIMES],
    explanation:
      'Elles regroupent un ensemble de phénomènes qui se rattachent à nos 5 sens : la vue, l’ouïe, l’odorat, le toucher et le goût. \n' +
      'Avoir une sensation étrange peut être lié à l’impression que la perception de ce qui nous entoure se modifie, est différente, n’est plus aussi performante qu’avant, par exemple :\n' +
      '\t•\tles choses ou les objets que l’on voit peuvent devenir plus sombres ou plus clairs, s’opacifier ou se tordre \n' +
      '\t•\tles sons peuvent sembler assourdis ou au contraire sembler très forts ou bien arriver déformés  (en écho …)\n' +
      '\t•\tles sensations tactiles (du toucher) peuvent sembler différentes ou la perception de son propre corps peut se modifier avec parfois l’impression que les organes fonctionnent différemment ou moins bien\n' +
      '\t•\tles goûts dans la bouche peuvent être différents, parfois bizarres ou mauvais\n' +
      '\t•\tles odeurs sont très fortes ou au contraire absentes \n' +
      'L’hallucination concerne le fait de percevoir des choses qui ne sont pas réellement là, par exemple :\n' +
      '\t•\tvoir des choses que les autres ne semblent pas voir, parfois de manière incertaine, parfois de manière très claire (des ombres, des formes, des personnes, des animaux …)\n' +
      '\t•\tentendre des bruits, des sons, son prénom appelé, des chuchotements, des voix distinctes, ses propres pensées; \n' +
      '\t•\tsentir sur sa peau l’impression d’être touché, effleuré, tiré … ou avoir des sensations internes incompréhensibles parfois étranges, gênantes ou douloureuses, à l’intérieur de notre corps, dans certains organes ; \n' +
      '\t•\tsentir des odeurs ou avoir des goûts dans la bouche inhabituels, sans que quelque chose en soit clairement l’origine\n',
  },
  {
    id: `${categories.sensations}-intensity`,
    question: 'A quel point leur présence a-t-elle été pénible ?',
    answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
    explanation:
      'Elles regroupent un ensemble de phénomènes qui se rattachent à nos 5 sens : la vue, l’ouïe, l’odorat, le toucher et le goût. \n' +
      'Avoir une sensation étrange peut être lié à l’impression que la perception de ce qui nous entoure se modifie, est différente, n’est plus aussi performante qu’avant, par exemple :\n' +
      '\t•\tles choses ou les objets que l’on voit peuvent devenir plus sombres ou plus clairs, s’opacifier ou se tordre \n' +
      '\t•\tles sons peuvent sembler assourdis ou au contraire sembler très forts ou bien arriver déformés  (en écho …)\n' +
      '\t•\tles sensations tactiles (du toucher) peuvent sembler différentes ou la perception de son propre corps peut se modifier avec parfois l’impression que les organes fonctionnent différemment ou moins bien\n' +
      '\t•\tles goûts dans la bouche peuvent être différents, parfois bizarres ou mauvais\n' +
      '\t•\tles odeurs sont très fortes ou au contraire absentes \n' +
      'L’hallucination concerne le fait de percevoir des choses qui ne sont pas réellement là, par exemple :\n' +
      '\t•\tvoir des choses que les autres ne semblent pas voir, parfois de manière incertaine, parfois de manière très claire (des ombres, des formes, des personnes, des animaux …)\n' +
      '\t•\tentendre des bruits, des sons, son prénom appelé, des chuchotements, des voix distinctes, ses propres pensées; \n' +
      '\t•\tsentir sur sa peau l’impression d’être touché, effleuré, tiré … ou avoir des sensations internes incompréhensibles parfois étranges, gênantes ou douloureuses, à l’intérieur de notre corps, dans certains organes ; \n' +
      '\t•\tsentir des odeurs ou avoir des goûts dans la bouche inhabituels, sans que quelque chose en soit clairement l’origine\n',
  },
  {
    id: categories.sleep,
    question: 'Selon vous, quelle est la qualité générale de votre nuit ?',
    answers: [
      categoryStates.VERY_GOOD,
      categoryStates.GOOD,
      categoryStates.MIDDLE,
      categoryStates.BAD,
      categoryStates.VERY_BAD,
    ],
    explanation:
      'Quand on s’intéresse au sommeil, on regarde principalement sa durée et sa qualité.\n' +
      'En effet, un bon sommeil est la base d’une bonne hygiène de vie et contribue à maintenir\n' +
      'un état psychique satisfaisant et stable, quelles que soit les difficultés que l’on rencontre.',
  },
];
