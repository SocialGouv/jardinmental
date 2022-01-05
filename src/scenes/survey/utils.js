import {icons, colors as colorsFromConstant} from '../../utils/constants';

export const answers = [
  {
    score: 1,
    backgroundColor: colorsFromConstant.veryBad,
    inactiveBackgroundColor: colorsFromConstant.veryBadTrans,
    iconColor: '#7F2121',
    inactiveIconColor: '#666666',
    icon: icons.veryBad,
  },
  {
    score: 2,
    backgroundColor: colorsFromConstant.bad,
    inactiveBackgroundColor: colorsFromConstant.badTrans,
    iconColor: '#7B3900',
    inactiveIconColor: '#666666',
    icon: icons.bad,
  },
  {
    score: 3,
    backgroundColor: colorsFromConstant.middle,
    inactiveBackgroundColor: colorsFromConstant.middleTrans,
    iconColor: '#7B5300',
    inactiveIconColor: '#666666',
    icon: icons.middle,
  },
  {
    score: 4,
    backgroundColor: colorsFromConstant.good,
    inactiveBackgroundColor: colorsFromConstant.goodTrans,
    iconColor: '#696B00',
    inactiveIconColor: '#666666',
    icon: icons.good,
  },
  {
    score: 5,
    backgroundColor: colorsFromConstant.veryGood,
    inactiveBackgroundColor: colorsFromConstant.veryGoodTrans,
    iconColor: '#537900',
    inactiveIconColor: '#666666',
    icon: icons.veryGood,
  },
];

export const answersYesNo = [
  {
    score: true,
    label: 'Oui',
  },
  {
    score: false,
    label: 'Non',
  },
];
