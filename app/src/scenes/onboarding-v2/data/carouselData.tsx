import { colors } from "@/utils/colors";
import { CarouselSlide } from "../types";
import { Dimensions, Image, View, Text, TouchableOpacity } from "react-native";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { useNavigation } from "@react-navigation/native";
import { createElement } from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isLargeScreen = screenHeight >= 700;

const SlideWelcome: CarouselSlide = {
  id: "slide-jm-help-you",
  title: "Jardin Mental vous aide à y voir plus clair.",
  description:
    "Vous traversez peut-être une période floue où vous vous intéressez à votre santé mentale.\n\nIci, vous pourrez poser des mots sur ce que vous ressentez, et mieux comprendre ce que vous vivez.",
  type: "generic",
  backgroundColor: colors.WHITE,
  variant: "blue",
  illustration: (
    <View className="absolute -z-10">
      <Image
        style={
          isLargeScreen
            ? { width: 200, height: 200, top: -160, resizeMode: "contain" }
            : { width: 140, height: 140, top: -110, resizeMode: "contain" }
        }
        source={require("../../../../assets/imgs/onboarding/carousel/welcome.png")}
      />
    </View>
  ),
};

const SlideFinal: CarouselSlide = {
  id: "slide-made-by-professional",
  title: "Conçu par des professionnels de la santé mentale, pour vous.",
  type: "special",
  backgroundColor: colors.WHITE,
  illustration: (
    <View className="absolute right-4 -z-2">
      <Image
        style={{ width: 100, height: 100, top: -80, right: 0, resizeMode: "contain", zIndex: -1 }}
        source={require("../../../../assets/imgs/onboarding/carousel/commity.png")}
      />
    </View>
  ),
  variant: "green",
  bottomComponent: createElement(() => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("commity");
        }}
        className="rounded-xl p-4 mt-4"
        style={{
          backgroundColor: "#BBE7C6",
        }}
      >
        <Text className={mergeClassNames(typography.textMdSemibold, "text-mood-text-4")}>
          L’application est co-construite avec un comité éditorial et scientifique composé de 14 professionnels de santé
        </Text>
      </TouchableOpacity>
    );
  }),
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
    illustration: (
      <View className="absolute">
        <Image
          style={{ width: 200, height: 200, top: -130, resizeMode: "contain" }}
          source={require("../../../../assets/imgs/onboarding/carousel/outils.png")}
        />
      </View>
    ),
  },
  {
    id: "slide-suivi-share-with-you-psy",
    title: "Suivi par un professionnel ?",
    description:
      "Vous pouvez choisir de partager ce que vous notez avec le professionnel qui vous accompagne, pour appuyer vos échanges.\n\nTout est sous votre contrôle.",
    type: "generic",
    backgroundColor: colors.WHITE,
    variant: "red",
    illustration: (
      <View className="absolute right-0">
        <Image
          style={{ width: 200, height: 200, top: -150, resizeMode: "contain" }}
          source={require("../../../../assets/imgs/onboarding/carousel/psy.png")}
        />
      </View>
    ),
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
