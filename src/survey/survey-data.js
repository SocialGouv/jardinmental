import {
  categoryStates,
  frequence,
  intensity,
  surveyDate,
  categories,
} from '../common/constants';
import localStorage from '../utils/localStorage';

// build an array of the question's index that the user selected.
export const buildSurveyData = async () => {
  const userSymptoms = await localStorage.getSymptoms();
  const data = await getAvailableData();
  let res = [];
  data.forEach((question, index) => {
    const category = question.id;
    // get the name and the suffix of the category
    const [categoryName, suffix] = category.split('_');

    // if the user selected this category
    if (userSymptoms[category] || userSymptoms[categoryName]) {
      res.push(index);

      // if it's one category with the suffix 'FREQUENCE' :
      // add the next question if it's the same categoryName (i.e. the question on the intensity of the same category)
      if (suffix && suffix === 'FREQUENCE' && !question.custom) {
        const nextCategory = availableData[index + 1].id;
        const [nextCategoryName, _] = nextCategory.split('_');
        nextCategoryName === categoryName && res.push(index + 1);
      }
    }
  });
  return res;
};

export const getAvailableData = async () => {
  const customAvailableData = await getCustomAvailableData();
  return availableData.concat(customAvailableData);
};

export const getCustomAvailableData = async () => {
  const userCustomSymptoms = await localStorage.getCustomSymptoms();
  res = [];
  userCustomSymptoms.forEach((custom) => {
    res.push(
      {
        id: `${custom}_FREQUENCE`,
        question: `A quelle fréquence avez-vous eu "${custom}" aujourd’hui ?`,
        yesterdayQuestion: `A quelle fréquence avez-vous eu "${custom}" hier ?`,
        answers: [
          frequence.NEVER,
          frequence.SEVERAL_TIMES,
          frequence.MANY_TIMES,
        ],
        dynamic: true,
        custom: true,
      },
      {
        id: `${custom}_INTENSITY`,
        question: 'A quel point cela a-t-il été pénible ?',
        yesterdayQuestion: 'A quel point cela a-t-il été pénible ?',
        answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
        dynamic: true,
        custom: true,
      },
    );
  });
  return res;
};

export const availableData = [
  {
    id: 'day',
    question: 'Commençons ! Pour quel jour souhaitez-vous noter vos ressentis',
    answers: [surveyDate.TODAY, surveyDate.YESTERDAY],
    explanation: null,
  },
  {
    id: categories.MOOD,
    question: 'Comment a été votre humeur aujourd’hui ?',
    yesterdayQuestion: 'Comment a été votre humeur hier ?',
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
    dynamic: true,
  },
  {
    id: categories.ANXIETY_FREQUENCE,
    question: 'Combien de temps vous êtes-vous senti anxieux aujourd’hui ?',
    yesterdayQuestion: 'Combien de temps vous êtes-vous senti anxieux hier ?',
    answers: [frequence.NEVER, frequence.SEVERAL_TIMES, frequence.MANY_TIMES],
    explanation:
      'L’anxiété est un état d’appréhension, d’inquiétude, de peur ou de tension, désagréable, qui peut être ou non associé à un facteur de stress.',
    dynamic: true,
  },
  {
    id: categories.ANXIETY_INTENSITY,
    question: 'A quel point cela a-t-il été pénible ?',
    yesterdayQuestion: 'A quel point cela a-t-il été pénible ?',
    answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
    explanation:
      'L’anxiété est un état d’appréhension, d’inquiétude, de peur ou de tension, désagréable, qui peut être ou non associé à un facteur de stress.',
    dynamic: true,
  },
  {
    id: categories.BADTHOUGHTS_FREQUENCE,
    question: 'Avez-vous eu des pensées parasites aujourd’hui ?',
    yesterdayQuestion: 'Avez-vous eu des pensées parasites hier ?',
    answers: [frequence.NEVER, frequence.SEVERAL_TIMES, frequence.MANY_TIMES],

    explanation:
      'Ce sont des pensées que l’on ne contrôle pas. Elles peuvent nous envahir sans que l’on ne puisse rien y faire, ou pas beaucoup. Elles peuvent être tristes, angoissantes, effrayantes, gênantes, absurdes … On n’arrive pas à s’en débarrasser et, parfois, on n’arrive pas à penser à autre chose. On peut finir par se sentir triste, en colère, avoir peur ou devenir méfiant, parfois au point de ne plus rien pouvoir faire.',
    dynamic: true,
  },
  {
    id: categories.BADTHOUGHTS_INTENSITY,
    question:
      'A quel point ces pensées parasites ont été désagréables/pénibles ?',
    yesterdayQuestion:
      'A quel point ces pensées parasites ont été désagréables/pénibles ?',
    answers: [intensity.LIGHT, intensity.MIDDLE, intensity.HIGH],
    explanation:
      'Ce sont des pensées que l’on ne contrôle pas. Elles peuvent nous envahir sans que l’on ne puisse rien y faire, ou pas beaucoup. Elles peuvent être tristes, angoissantes, effrayantes, gênantes, absurdes … On n’arrive pas à s’en débarrasser et, parfois, on n’arrive pas à penser à autre chose. On peut finir par se sentir triste, en colère, avoir peur ou devenir méfiant, parfois au point de ne plus rien pouvoir faire.',
    dynamic: true,
  },
  {
    id: categories.SENSATIONS_FREQUENCE,
    question:
      'A quelle fréquence les sensations étranges ou les hallucinations ont été présentes aujourd’hui ?',
    yesterdayQuestion:
      'A quelle fréquence les sensations étranges ou les hallucinations ont été présentes hier ?',
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
    dynamic: true,
  },
  {
    id: categories.SENSATIONS_INTENSITY,
    question: 'A quel point leur présence a-t-elle été pénible ?',
    yesterdayQuestion: 'A quel point leur présence a-t-elle été pénible ?',
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
    dynamic: true,
  },
  {
    id: categories.SLEEP,
    question: 'Selon vous, quelle est la qualité générale de votre nuit ?',
    yesterdayQuestion:
      'Selon vous, quelle est la qualité générale de votre nuit d’hier ?',
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
    dynamic: true,
  },
  {
    id: categories.NOTES,
    question: 'Ajoutez un commentaire sur votre journée si vous le souhaitez',
    yesterdayQuestion:
      "Ajoutez un commentaire sur votre journée d'hier si vous le souhaitez",
  },
];
