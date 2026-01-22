import React, { JSX, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ImageSourcePropType, Animated } from "react-native";
import Header from "../../components/Header";
import { CATEGORIES, RESOURCES_DATA } from "./data/resources";
import logEvents from "../../services/logEvents";
import { TW_COLORS } from "@/utils/constants";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ValidatedStampIcon from "@assets/svg/icon/ValidatedStamp";
import ArrowCircleRightIcon from "@assets/svg/icon/ArrowCircleRight";

// Import des composants SVG pour les catégories
import CatLaSanteMentaleCestQuoi from "@assets/imgs/resources/cat-la-sante-mentale-cest-quoi";
import CatSigneMalEtre from "@assets/imgs/resources/cat-signe-mal-etre";
import CatPetitPas from "@assets/imgs/resources/cat-petit-pas";
import CatMieuxComprendre from "@assets/imgs/resources/cat-mieux-comprendre";
import CatAgirChercheDeLaide from "@assets/imgs/resources/cat-agir-chercher-de-laide";
import { Typography } from "@/components/Typography";

interface ResourceCategoriesProps {
  navigation: any;
}

interface CategoryCardProps {
  number: number;
  title: string;
  category: string;
  ImageSourceComponent: React.ComponentType<{ width?: number | string; height?: number | string }>;
  onPress: () => void;
}

const backgroundColor = ["#E5F6FC", "#FDF7E9", "#E5F7F4", "#F5EFF8", "#F1F3F9"];
const borderColor = ["#CCEDF9", "#F9E1A7", "#CCEEE8", "#FCE8F2", "#E3E8F2"];

const CategoryCard: React.FC<CategoryCardProps> = ({ number, title, onPress, ImageSourceComponent, category }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ backgroundColor: backgroundColor[number - 1], borderColor: borderColor[number - 1], minHeight: 82 }}
      className="bg-white border  rounded-xl mb-4 overflow-hidden"
    >
      <View className="flex-row items-center z-2">
        <View className="flex-1 p-4">
          <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{title}</Typography>
          <View className="flex-row items-center mt-1">
            <View
              style={{
                backgroundColor: borderColor[number - 1],
              }}
              className="p-1 rounded mr-1"
            >
              <Typography className={mergeClassNames(typography.textXsRegular, "text-cnam-primary-800")}>
                {RESOURCES_DATA.filter((r) => r.category === category).length} contenus
              </Typography>
            </View>
            <ArrowCircleRightIcon width={16} height={16} color={TW_COLORS.CNAM_PRIMARY_900} />
          </View>
        </View>
      </View>
      <ImageSourceComponent />
    </TouchableOpacity>
  );
};

const ResourceCategories: React.FC<ResourceCategoriesProps> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate opacity for info button
  const infoButtonOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Interpolate height scale for info button
  const infoButtonScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 0],
    extrapolate: "clamp",
  });

  // Interpolate height scale for info button
  const infoButtonTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const categories = [
    {
      key: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI,
      title: "La santé mentale, c'est quoi ?",
      number: 1,
      asset: CatLaSanteMentaleCestQuoi,
    },
    {
      key: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE,
      title: "Repérer les signes de mal-être",
      number: 2,
      asset: CatSigneMalEtre,
    },
    {
      key: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL,
      title: "Des petits pas pour son équilibre mental",
      number: 3,
      asset: CatPetitPas,
    },
    {
      key: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES,
      title: "Mieux comprendre les troubles psychiques",
      number: 4,
      asset: CatMieuxComprendre,
    },
    {
      key: CATEGORIES.AGIR_ET_CHERCHER_DE_L_AIDE_SANS_HONTE,
      title: "Agir et chercher de l'aide, sans honte",
      number: 5,
      asset: CatAgirChercheDeLaide,
    },
  ];

  const handleCategoryPress = (category: string, categoryNumber: number) => {
    logEvents.logSelectedCategory(categoryNumber);
    navigation.navigate("resource-category-list", { category });
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1">
      <ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180,
          //marginTop: 120,
          marginTop: 280,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="p-4 pt-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              number={category.number}
              title={category.title}
              category={category.key}
              ImageSourceComponent={category.asset}
              onPress={() => handleCategoryPress(category.key, category.number)}
            />
          ))}
        </View>
      </ScrollView>
      <View className="absolute">
        <View className="bg-cnam-primary-800 flex flex-row justify-between pb-0">
          <Header navigation={navigation} />
        </View>
        <View className="pt-6 px-4 bg-cnam-primary-50 z-1">
          <Typography className="text-cnam-primary-950 text-2xl font-semibold pb-2">S'informer</Typography>
        </View>
        <Animated.View
          className={"z-0"}
          style={{
            opacity: infoButtonOpacity,
            height: infoButtonScale,
            overflow: "hidden",
            transform: [
              {
                translateY: infoButtonTranslate,
              },
            ],
          }}
        >
          <View className="px-4">
            <Typography className="text-cnam-primary-800 text-base leading-6">
              Un guide simple et accessible pour mieux connaître la santé mentale, ses enjeux et les solutions disponibles
            </Typography>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("commity");
              }}
              className="flex-row bg-cnam-cyan-lighten-80 items-center space-x-1 rounded-full px-3 self-start mt-4"
            >
              <ValidatedStampIcon />
              <Typography className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-950")}>
                Comment ces contenus sont-ils vérifiés ?
              </Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ResourceCategories;
