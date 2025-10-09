import React from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import { CATEGORIES } from "./data/resources";
import logEvents from "../../services/logEvents";

interface ResourceCategoriesProps {
  navigation: any;
}

interface CategoryCardProps {
  number: number;
  title: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ number, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-white border-2 border-cnam-primary-400 rounded-xl mb-4 overflow-hidden">
      <View className="flex-row items-center">
        <View className="bg-cnam-primary-700 p-4">
          <View className="w-12 h-12 bg-cnam-primary-50 border border-cnam-cyan-200-lighten-60 rounded-full items-center justify-center">
            <Text className="text-cnam-primary-800 text-2xl font-bold">{number}</Text>
          </View>
        </View>
        <View className="flex-1 p-4">
          <Text className="text-cnam-primary-950 text-base font-medium leading-6">{title}</Text>
        </View>
        <View className="justify-center items-center pr-4">
          <Text className="text-lg text-cnam-primary-950 font-bold">→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ResourceCategories: React.FC<ResourceCategoriesProps> = ({ navigation }) => {
  const categories = [
    { key: CATEGORIES.LA_SANTE_MENTALE_C_EST_QUOI, title: "La santé mentale, c'est quoi ?", number: 1 },
    { key: CATEGORIES.REPERER_LES_SIGNES_DE_MAL_ETRE, title: "Repérer les signes de mal-être", number: 2 },
    { key: CATEGORIES.DES_PETITS_PAS_POUR_SON_EQUILIBRE_MENTAL, title: "Des petits pas pour son équilibre mental", number: 3 },
    { key: CATEGORIES.MIEUX_COMPRENDRE_LES_TROUBLES_PSYCHIQUES, title: "Mieux comprendre les troubles psychiques", number: 4 },
  ];

  const handleCategoryPress = (category: string, categoryNumber: number) => {
    logEvents.logSelectedCategory(categoryNumber);
    navigation.navigate("resource-category-list", { category });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-cnam-primary-800 flex flex-row justify-between p-[5px] pb-0">
        <Header title="Ressources" navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="p-4 mt-4">
          <View className="mb-10">
            <Text className="text-cnam-primary-950 text-2xl font-semibold mb-3">La santé mentale, qu'est-ce que c'est ?</Text>
            <Text className="text-cnam-primary-800 text-base leading-6">
              Un guide simple et accessible pour mieux connaître la santé mentale, ses enjeux et les solutions disponibles
            </Text>
          </View>

          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              number={category.number}
              title={category.title}
              onPress={() => handleCategoryPress(category.key, category.number)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResourceCategories;
