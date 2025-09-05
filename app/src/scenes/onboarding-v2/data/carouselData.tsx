import { colors } from "@/utils/colors";
import { CarouselSlide } from "../types";
import { AvatarGroup } from "@/components/AvatarGroup";
import { View } from "react-native";
import { TW_COLORS } from "@/utils/constants";

const SlideWelcome: CarouselSlide = {
  id: "slide-jm-help-you",
  title: "Jardin Mental vous aide à y voir plus clair.",
  description:
    "Vous traversez peut-être une période floue ou vous vous intéressez à votre santé mentale.\n\nIci, vous pourrez poser des mots sur ce que vous ressentez, et mieux comprendre ce que vous vivez.",
  type: "generic",
  backgroundColor: colors.WHITE,
  variant: "blue",
};

const SlideFinal: CarouselSlide = {
  id: "slide-made-by-professional",
  title: "Conçu par des professionnels de la santé mentale, pour vous.",
  type: "special",
  backgroundColor: colors.WHITE,
  variant: "green",
};

const carouselSlides: CarouselSlide[] = [
  SlideWelcome,
  // {
  //   id: 'slide-non-suivi-jm-give-ressources',
  //   title: "Des ressources pour avancer, à votre rythme.",
  //   description: "Des contenus simples et concrets pour prendre soin de votre santé mentale, à votre rythme.",
  //   type: 'generic',
  //   backgroundColor: colors.WHITE,
  //   variant: 'green'
  // },
  {
    id: "slide-non-suivi-jm-give-tools",
    title: "Des outils pour comprendre vos émotions, au quotidien.",
    description: "Un espace pour faire le point, sans jugement. Pour observer, nommer, apprendre et avancer.",
    type: "generic",
    backgroundColor: colors.WHITE,
    variant: "pink",
  },
  {
    id: "slide-suivi-share-with-you-psy",
    title: "Suivi par un thérapeute ?",
    description:
      "Vous pouvez choisir de partager ce que vous notez avec votre thérapeute, pour appuyer vos échanges.\n\nTout est sous votre contrôle.",
    type: "generic",
    backgroundColor: colors.WHITE,
    variant: "red",
  },
  SlideFinal,
];

const carouselSlidesSuivi: CarouselSlide[] = [
  SlideWelcome,
  {
    id: "slide-suivi-between-two-sessions",
    title: "Entre deux séances de suivi",
    description:
      "Entre deux séances, on oublie parfois ce qui compte.\nNoter ce que vous traversez au quotidien vous aide à avancer plus sereinement.",
    type: "generic",
    backgroundColor: colors.WHITE,
  },
  {
    id: "slide-suivi-share-with-you-psy",
    title: "Partager avec votre thérapeute.",
    description:
      "Vous pouvez choisir de partager ce que vous notez avec votre thérapeute,pour appuyer vos échanges.\n\nTout est sous votre contrôle.",
    type: "generic",
    backgroundColor: colors.WHITE,
  },
  // {
  //   id: 'slide-suivi-ressources',
  //   title: "Des ressources pour avancer, à votre rythme.",
  //   description: "Des contenus utiles, concrets et validés, pour prendre soin de vous entre deux séances.",
  //   type: 'generic',
  //   backgroundColor: colors.WHITE,
  // },
  SlideFinal,
];

export const VARIANT_COLORS = {
  red: "bg-[#FAEEEF]",
  pink: "bg-[#FEF8FB]",
  white: TW_COLORS.WHITE,
  green: `bg-[#EEF9F1]`,
  blue: `bg-[#E5F6FC]`,
};

export const VARIANT_BORDER_COLORS = {
  beige: "#E5F6FC",
  red: "#F5DDDE",
  pink: "#FCE8F2",
  white: TW_COLORS.WHITE,
  green: `#DDF3E3`,
  blue: `#CCEDF9`,
  yellow: "#FCF0D3",
};

const VARIANT_LEAF_COLORS = {
  beige: "#FCEBD9",
  white: TW_COLORS.WHITE,
  blue: TW_COLORS.LIGHT_BLUE,
  green: "#EBEEAC",
};

export default carouselSlides;
