import {Alert} from 'react-native';
import {categories} from '../../utils/constants';
import localStorage from '../../utils/localStorage';
import {beforeToday, formatDay} from '../../utils/date/helpers';
import {isToday, parseISO} from 'date-fns';
import logEvents from '../../services/logEvents';

// build an array of the question that the user has selected.
export const buildSurveyData = async () => {
  const userSymptoms = await localStorage.getSymptoms();
  const data = await getAvailableData();
  let res = [];
  data.forEach((question, index) => {
    // we get the category name if there is a _
    const [categoryName] = question.id.split('_');
    // if the user selected this category or a category that
    Object.keys(userSymptoms).forEach((userSymptom) => {
      const [userSymptomName] = userSymptom.split('_');
      if (userSymptomName === categoryName && userSymptoms[userSymptom]) {
        res.push(question);
      }
    });
  });
  return res;
};

export const getAvailableData = async () => {
  const customAvailableData = await getCustomAvailableData();
  return availableData.concat(customAvailableData);
};

export const getCustomAvailableData = async () => {
  const userCustomSymptoms = await localStorage.getCustomSymptoms();
  const res = [];
  userCustomSymptoms.forEach((custom) => {
    res.push({
      id: custom,
      label: custom,
      custom: true,
    });
  });
  return res;
};

export const availableData = [
  {
    id: 'day',
    question:
      'Commençons ! Pour quel jour souhaites-tu remplir ton questionnaire ?',
    explanation: null,
  },
  {
    id: categories.MOOD,
    label: 'Humeur',
    explanation:
      'L’humeur varie dans la journée et c’est normal, mais elle peut-être trop basse (quand on\n' +
      'se sent triste par exemple, ou en colère ou irritable), trop haute (quand on se sent\n' +
      'euphorique ou agité) ou varier trop fortement',
  },
  {
    id: categories.ANXIETY,
    label: 'Anxiété',
    explanation:
      'L’anxiété est un état d’appréhension, d’inquiétude, de peur ou de tension, désagréable, qui peut être ou non associé à un facteur de stress.',
  },
  {
    id: categories.BADTHOUGHTS,
    label: 'Pensées parasites',
    explanation:
      'Ce sont des pensées que l’on ne contrôle pas. Elles peuvent nous envahir sans que l’on ne puisse rien y faire, ou pas beaucoup. Elles peuvent être tristes, angoissantes, effrayantes, gênantes, absurdes … On n’arrive pas à s’en débarrasser et, parfois, on n’arrive pas à penser à autre chose. On peut finir par se sentir triste, en colère, avoir peur ou devenir méfiant, parfois au point de ne plus rien pouvoir faire.',
  },
  {
    id: categories.SENSATIONS,
    label: 'Sensations étranges',
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
    id: categories.SLEEP,
    label: 'Sommeil',
    explanation:
      'Quand on s’intéresse au sommeil, on regarde principalement sa durée et sa qualité.\n' +
      'En effet, un bon sommeil est la base d’une bonne hygiène de vie et contribue à maintenir\n' +
      'un état psychique satisfaisant et stable, quelles que soit les difficultés que l’on rencontre.',
  },
  {
    id: categories.DAILYACTIVITIES,
    label: 'Faire mes activités quotidiennes',
    // explanation:
    //   'Quand on s’intéresse au sommeil, on regarde principalement sa durée et sa qualité.\n' +
    //   'En effet, un bon sommeil est la base d’une bonne hygiène de vie et contribue à maintenir\n' +
    //   'un état psychique satisfaisant et stable, quelles que soit les difficultés que l’on rencontre.',
  },
  {
    id: categories.COMMUNICATION,
    label: 'Communication avec mon entourage',
    // explanation:
    //   'Quand on s’intéresse au sommeil, on regarde principalement sa durée et sa qualité.\n' +
    //   'En effet, un bon sommeil est la base d’une bonne hygiène de vie et contribue à maintenir\n' +
    //   'un état psychique satisfaisant et stable, quelles que soit les difficultés que l’on rencontre.',
  },
  {
    id: 'NOTES',
    question: 'Ajoutez un commentaire sur votre journée si vous le souhaitez',
  },
];

export const startAtFirstQuestion = async (date, navigation) => {
  const symptoms = await localStorage.getSymptoms();
  if (!symptoms) {
    navigation.navigate('symptoms', {
      redirect: true,
      showExplanation: true,
      date,
    });
  } else {
    navigation.navigate(`day-survey`, {
      currentSurvey: {
        date,
        answers: {},
      },
    });
  }
};

export const alertNoDataYesterday = ({date, diaryData, navigation}) => {
  console.log({date});
  if (isToday(parseISO(date)) && !diaryData[formatDay(beforeToday(1))]) {
    Alert.alert('Souhaitez-vous renseigner vos ressentis pour hier ?', '', [
      {
        text: 'Oui, je les renseigne maintenant',
        onPress: () => {
          logEvents.logFeelingStartYesterday(true);
          startAtFirstQuestion(formatDay(beforeToday(1)), navigation);
        },
        style: 'default',
      },
      {
        text: 'Plus tard',
        onPress: () => {
          logEvents.logFeelingStartYesterday(false);
        },
        style: 'cancel',
      },
    ]);
  }
};
