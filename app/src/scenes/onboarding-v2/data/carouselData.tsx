import { colors } from '@/utils/colors';
import { CarouselSlide } from '../types';
import { AvatarGroup } from '@/components/AvatarGroup';
import { View } from 'react-native';

const SlideWelcome: CarouselSlide = {
  id: 'slide-jm-help-you',
  title: "Jardin Mental vous aide à y voir plus clair.",
  description: "Vous traversez peut-être une période floue ou pesante. \nIci, vous pourrez poser des mots sur ce que vous ressentez,et mieux comprendre ce que vous vivez.",
  type: 'generic',
  backgroundColor: colors.WHITE,
  variant: 'beige'
}

const SlideFinal: CarouselSlide = {
  id: 'slide-made-by-professional',
  title: "Conçus par des professionnels de la santé mentale, pour vous.",
  type: 'special',
  children: <View className="w-full flex-1 justify-center items-center my-4"><AvatarGroup
    avatars={[
      {
        uri: require('@assets/imgs/people/men1.jpg'),
        //uri: 'https://randomuser.me/api/portraits/men/1.jpg',
        alt: 'Remy Sharp'
      },
      { //uri: 'https://randomuser.me/api/portraits/men/2.jpg', 
        uri: require('@assets/imgs/people/men2.jpg'),
        // uri: 'https://i.pravatar.cc/150?img=54',
        alt: 'Travis Howard'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=10',
        uri: require('@assets/imgs/people/women1.jpg'),
        //uri: 'https://randomuser.me/api/portraits/women/3.jpg',
        alt: 'Cindy Baker'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=15',
        uri: require('@assets/imgs/people/women2.jpg'),

        //uri: 'https://randomuser.me/api/portraits/women/4.jpg',
        alt: 'Agnes Walker'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=34',
        uri: require('@assets/imgs/people/men3.jpg'),

        //uri: 'https://randomuser.me/api/portraits/men/5.jpg',
        alt: 'Trevor Henderson'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=65',
        uri: require('@assets/imgs/people/women3.jpg'),
        //uri: 'https://randomuser.me/api/portraits/women/6.jpg',
        alt: 'Agnes Walker'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=22',
        uri: require('@assets/imgs/people/men5.jpg'),
        //uri: 'https://randomuser.me/api/portraits/men/6.jpg',
        alt: 'Trevor Henderson'
      },
      {
        // uri: 'https://i.pravatar.cc/150?img=19',
        uri: require('@assets/imgs/people/women4.jpg'),
        //uri: 'https://randomuser.me/api/portraits/women/8.jpg',
        alt: 'Agnes Walker'
      },

    ]}
    max={8}
    size={40}
  /></View>,
  backgroundColor: colors.WHITE,
  variant: 'beige'
}

export const carouselSlides: CarouselSlide[] = [
  SlideWelcome,
  {
    id: 'slide-non-suivi-jm-give-ressources',
    title: "Des ressources pour avancer, à votre rythme.",
    description: "Des contenus simples et concrets pour prendre soin de votre santé mentale, à votre rythme.",
    type: 'generic',
    backgroundColor: colors.WHITE,
    variant: 'green'
  },
  {
    id: 'slide-non-suivi-jm-give-tools',
    title: "Des outils pour comprendre vos émotions, au quotidien",
    description: "Un espace pour faire le point, sans jugement. Pour observer, nommer, et avancer.",
    type: 'generic',
    backgroundColor: colors.WHITE,
    variant: 'blue'
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
