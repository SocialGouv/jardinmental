import VeryGoodSvg from '../assets/svg/veryGood.svg';
import GoodSvg from '../assets/svg/good.svg';
import MiddleSvg from '../assets/svg/middle.svg';
import BadSvg from '../assets/svg/bad.svg';
import VeryBadSvg from '../assets/svg/veryBad.svg';

export const icons = {
  veryGood: VeryGoodSvg,
  good: GoodSvg,
  middle: MiddleSvg,
  bad: BadSvg,
  veryBad: VeryBadSvg,
};

export const colors = {
  veryGood: '#E2FA80',
  good: '#F0F277',
  middle: '#FCE285',
  bad: '#FCD0A7',
  veryBad: '#FFC0C0',
};

export const categoryStates = {
  VERY_GOOD: {
    icon: icons.veryGood,
    color: colors.veryGood,
    label: 'Très bien',
  },
  GOOD: {
    icon: icons.good,
    color: colors.good,
    label: 'Bien',
  },
  MIDDLE: {
    icon: icons.middle,
    color: colors.middle,
    label: 'Moyen',
  },
  BAD: {
    icon: icons.bad,
    color: colors.bad,
    label: 'Mauvais',
  },
  VERY_BAD: {
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'Très mauvais',
  },
};

export const categories = {
  mood: 'Humeur',
  anxiety: 'Anxiété',
  badThoughts: 'Idées parasites',
  sleep: 'Sommeil',
  sensations: 'Sensations étranges',
};
