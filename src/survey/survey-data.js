import {categories, categoryStates, surveyDate} from '../constants';

export const surveyData = [
  {
    id: 'day',
    question: 'Commençons ! Pour quel jour souhaites-tu noter tes ressentis',
    answers: [surveyDate.YESTERDAY, surveyDate.TODAY],
    explanation: '',
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
  /*{
    id: categories.anxiety,
    question: '',
    answers: [],
    explanation: '',
  },
  {
    id: categories.badThoughts,
    question: '',
    answers: [],
    explanation: '',
  },
  {
    id: categories.sensations,
    question: '',
    answers: [],
    explanation: '',
  },*/
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
