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
  content: string;
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
    id: "1",
    title: "Pas de santé sans santé mentale",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article1.png"),
    category: CATEGORIES.CESTQUOI,
    content: `Prendre soin de sa santé, c’est aussi prendre soin de sa santé mentale.

Selon l’Organisation mondiale de la santé (OMS), la santé mentale est un « *état de bien-être qui permet à chacun de réaliser son potentiel, de faire face aux difficultés normales de la vie, de travailler avec succès et de manière productive, et d’être en mesure d’apporter une contribution à la communauté* ». Cependant, cette définition peut donner l’impression que le bien-être mental dépend uniquement de la réussite au travail. Or, on peut tout à fait se sentir bien, épanoui·e et utile, même sans avoir d’emploi.

La santé mentale fait partie intégrante de notre santé globale. **Il n’y a pas de santé sans santé mentale.** Longtemps taboue et mise de côté, elle reste pourtant aussi importante que la santé physique. Toutes deux sont étroitement liées : ce que l’on vit dans notre tête peut impacter notre corps, et inversement.

Oui, notre corps peut envoyer des signaux d'alerte. **Mais notre cerveau aussi.**`,
    nextContent: {
      title: "Psycom",
      text: "On a toutes et tous une santé mentale",
      url: "https://www.psycom.org/sinformer/la-sante-mentale/on-a-toutes-et-tous-une-sante-mentale/ ",
    },
  },
  {
    id: "2",
    title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ?",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article2.png"),
    category: CATEGORIES.CESTQUOI,
    content: `Nous avons toutes et tous besoin de prendre soin de notre santé mentale. **Même quand tout va bien.**

Tout au long de notre vie, notre état mental varie du bien-être au mal-être, et vice-versa. Le monde ne se divise pas en deux catégories distinctes : les personnes en bonne santé mentale d’un côté versus celles avec un trouble de l’autre.

**Quand on parle de santé mentale, on ne parle pas que de la maladie.** Même si je n’ai pas de trouble : est-ce que j’arrive tout de même à trouver du sens à ma vie ? Quel est le regard que je porte sur moi-même ? Est-ce que je me sens entouré·e ou profondément seul·e ?

**On peut par ailleurs tout à fait vivre avec un trouble psychique et se sentir bien, utile et épanoui·e. À l’inverse, on peut se sentir mal, vide et isolé·e sans avoir de trouble diagnostiqué.**

Une bonne santé mentale peut ainsi coexister avec un trouble psychique et l’absence de trouble ne garantit pas le bien-être mental !

**Chaque personne tente donc, à l’aide de ses ressources, de trouver son propre équilibre.**

Un équilibre qui lui fait du bien.`,
  },
  {
    id: "3",
    title: "Pourquoi et comment observer sa propre santé mentale ?",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article3.png"),
    category: CATEGORIES.CESTQUOI,
    content: `On parle souvent de santé mentale quand elle va mal, mais trop rarement de ce qu’on peut faire au quotidien pour la préserver. L’un des premiers réflexes utiles, c’est d’apprendre à s’observer **avec attention et bienveillance.**

Cela ne veut pas dire **tout analyser, ni devenir obsédé·e** par son humeur ou ses pensées. Il s’agit plutôt de développer une forme **d’écoute intérieure**, pour mieux comprendre ce qui nous affecte et repérer les petits signaux qui montrent qu’on ne se sent peut-être pas bien… mais aussi identifier ce qui nous fait du bien.

C’est justement ce que propose notre application ***Jardin Mental*** : un espace pour faire le point et suivre son état mental au fil du temps, même quand tout va bien.

Quelques repères pour s’auto-observer :

- **Les émotions** : suis-je souvent triste, irritable, anxieux·se ? Ou au contraire content·e, joyeux·se ?
- **Le sommeil** : est-ce que je dors bien ? Est-ce que je me réveille reposé·e ? Ai-je recours à des médications sans ordonnance afin d'améliorer la qualité de mon sommeil ?
- **L’énergie et la motivation** : est-ce que je me sens épuisé·e sans raison ? Est-ce que je trouve du plaisir dans mes activités quotidiennes, de loisirs ou de détente ?
- **Le rapport aux autres** : ai-je tendance à m’isoler ? Quel est mon rapport aux autres (famille, amis, collègues…) ?
- **Les pensées récurrentes** : est-ce qu'il m'arrive d'avoir des pensées négatives (sur moi-même, les autres, l'avenir) sans raison ? Des ruminations anxieuses ? Des inquiétudes? À quel point ces dernières freinent l'atteinte de mes objectifs ?
- **Les consommations :** ai-je tendance à augmenter ou à perdre le contrôle de mes consommations de substances ? Est-ce que j'ai régulièrement tendance à m'automédiquer pour me sentir mieux ?

En apprendre un peu plus sur le sujet, c’est déjà prendre soin de soi :)`,
  },
  {
    id: "4",
    title: "Mais au fait, avoir une bonne santé mentale : qu’est-ce que ça veut dire ?",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/Article4.png"),
    category: CATEGORIES.CESTQUOI,
    content: `Nous avons toutes et tous besoin de prendre soin de notre santé mentale. **Même quand tout va bien.**

Tout au long de notre vie, notre état mental varie du bien-être au mal-être, et vice-versa. Le monde ne se divise pas en deux catégories distinctes : les personnes en bonne santé mentale d’un côté versus celles avec un trouble de l’autre.

**Quand on parle de santé mentale, on ne parle pas que de la maladie.** Même si je n’ai pas de trouble : est-ce que j’arrive tout de même à trouver du sens à ma vie ? Quel est le regard que je porte sur moi-même ? Est-ce que je me sens entouré·e ou profondément seul·e ?

**On peut par ailleurs tout à fait vivre avec un trouble psychique et se sentir bien, utile et épanoui·e. À l’inverse, on peut se sentir mal, vide et isolé·e sans avoir de trouble diagnostiqué.**

Une bonne santé mentale peut ainsi coexister avec un trouble psychique et l’absence de trouble ne garantit pas le bien-être mental !

**Chaque personne tente donc, à l’aide de ses ressources, de trouver son propre équilibre.**

Un équilibre qui lui fait du bien.`,
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
