import React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import Header from "../../components/Header";
import ResourceCard from "./ResourceCard";

export interface Resource {
  id: string;
  title: string;
  duration: string;
  image: any;
  category: string;
  content: {
    title: string;
    markdown: string;
  };
  nextContent?: {
    title: string;
    text: string;
    url: string;
  };
}

const CATEGORIES = {
  CESTQUOI: "C'est quoi la santé mentale ?",
  COMPRENDRE: "Comprendre la santé mentale",
};

// Placeholder data - will be replaced with real content later
const RESOURCES_DATA: Resource[] = [
  {
    id: "mental-health-basics-1",
    title: "Pas de santé sans santé mentale",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article1.png"),
    category: CATEGORIES.CESTQUOI,
    content: {
      title: "Pas de santé sans santé mentale",
      markdown: `Prendre soin de sa santé, c’est aussi prendre soin de sa santé mentale.

Selon l’Organisation mondiale de la santé (OMS), la santé mentale est un « *état de bien-être qui permet à chacun de réaliser son potentiel, de faire face aux difficultés normales de la vie, de travailler avec succès et de manière productive, et d’être en mesure d’apporter une contribution à la communauté* ». Cependant, cette définition peut donner l’impression que le bien-être mental dépend uniquement de la réussite au travail. Or, on peut tout à fait se sentir bien, épanoui·e et utile, même sans avoir d’emploi.

La santé mentale fait partie intégrante de notre santé globale. **Il n’y a pas de santé sans santé mentale.** Longtemps taboue et mise de côté, elle reste pourtant aussi importante que la santé physique. Toutes deux sont étroitement liées : ce que l’on vit dans notre tête peut impacter notre corps, et inversement.

Oui, notre corps peut envoyer des signaux d'alerte. **Mais notre cerveau aussi.**`,
    },
    nextContent: {
      title: "Psycom",
      text: "On a toutes et tous une santé mentale",
      url: "https://www.psycom.org/sinformer/la-sante-mentale/on-a-toutes-et-tous-une-sante-mentale/ ",
    },
  },
  {
    id: "mental-health-basics-2",
    title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ? ",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article2.png"),
    category: CATEGORIES.CESTQUOI,
    content: {
      title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ? ",
      markdown: `Nous avons toutes et tous besoin de prendre soin de notre santé mentale. **Même quand tout va bien.**

Tout au long de notre vie, notre état mental varie du bien-être au mal-être, et vice-versa. Le monde ne se divise pas en deux catégories distinctes : les personnes en bonne santé mentale d’un côté versus celles avec un trouble de l’autre.

**Quand on parle de santé mentale, on ne parle pas que de la maladie.** Même si je n’ai pas de trouble : est-ce que j’arrive tout de même à trouver du sens à ma vie ? Quel est le regard que je porte sur moi-même ? Est-ce que je me sens entouré·e ou profondément seul·e ?

**On peut par ailleurs tout à fait vivre avec un trouble psychique et se sentir bien, utile et épanoui·e. À l’inverse, on peut se sentir mal, vide et isolé·e sans avoir de trouble diagnostiqué.**

Une bonne santé mentale peut ainsi coexister avec un trouble psychique et l’absence de trouble ne garantit pas le bien-être mental !

**Chaque personne tente donc, à l’aide de ses ressources, de trouver son propre équilibre.**

Un équilibre qui lui fait du bien.`,
    },
  },
];

interface ResourcesProps {
  navigation: any;
}

const Resources: React.FC<ResourcesProps> = ({ navigation }) => {
  const handleResourcePress = (resource: Resource) => {
    navigation.navigate("resource-article", { resource });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-cnam-primary-800 flex flew-row justify-between p-[5px] pb-0">
        <Header title="Ressources" navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="p-4">
          {RESOURCES_DATA.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onPress={() => handleResourcePress(resource)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Resources;
