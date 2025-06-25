import { colors } from '@/utils/colors';
import { CarouselSlide } from '../types';

const SlideWelcome: CarouselSlide = {
  id: 'slide-jm-help-you',
  title: "Jardin Mental vous aide à y voir plus clair.",
  description: "Vous traversez peut-être une période floue ou pesante. \nIci, vous pourrez poser des mots sur ce que vous ressentez,et mieux comprendre ce que vous vivez.",
  type: 'generic',
  backgroundColor: colors.WHITE,
}

const SlideFinal : CarouselSlide = {
  id: 'slide-made-by-professional',
  title: "Conçus par des professionnels de la santé mentale, pour vous.",
  description: "Votre voyage vers un meilleur équilibre mental commence maintenant. Prenons quelques minutes pour personnaliser votre expérience.",
  type: 'special',
  backgroundColor: colors.WHITE,
}

export const carouselSlides: CarouselSlide[] = [
  SlideWelcome,
  {
    id: 'slide-non-suivi-jm-give-ressources',
    title: "Des ressources pour avancer, à votre rythme.",
    description: "Des contenus simples et concrets pour prendre soin de votre santé mentale, à votre rythme.",
    type: 'generic',
    backgroundColor: colors.WHITE,
  },
  {
    id: 'slide-non-suivi-jm-give-tools',
    title: "Des outils pour comprendre vos émotions, au quotidien",
    description: "Un espace pour faire le point, sans jugement. Pour observer, nommer, et avancer.",
    type: 'generic',
    backgroundColor: colors.WHITE,
  },
  SlideFinal,
];

export const carouselSlidesSuivi: CarouselSlide[] = [
  SlideWelcome,
  {
    id: 'slide-suivi-between-two-sessions',
    title: "Entre deux séances de suivi",
    description: "Entre deux séances, on oublie parfois ce qui compte.\nNoter ce que vous traversez au quotidien vous aide à avancer plus sereinement.",
    type: 'generic',
    backgroundColor: colors.WHITE,
  },
  {
    id: 'slide-suivi-share-with-you-psy',
    title: "Partager avec votre thérapeute.",
    description: "Vous pouvez choisir de partager ce que vous notez avec votre thérapeute,pour appuyer vos échanges.\nTout est sous votre contrôle.",
    type: 'generic',
    backgroundColor: colors.WHITE,
  },
  {
    id: 'slide-suivi-ressources',
    title: "Des ressources pour avancer, à votre rythme.",
    description: "Des contenus utiles, concrets et validés, pour prendre soin de vous entre deux séances.",
    type: 'generic',
    backgroundColor: colors.WHITE,
  },
  SlideFinal
];


export default carouselSlides;
