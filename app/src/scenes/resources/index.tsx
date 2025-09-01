import React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import Header from "../../components/Header";
import ResourceCard from "./ResourceCard";

export interface Resource {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: any;
  content: {
    title: string;
    imageCaption: string;
    markdown: string;
    author: string;
    authorDescription: string;
    authorIcon: any;
    rubrique: string;
  };
}

// Placeholder data - will be replaced with real content later
const RESOURCES_DATA: Resource[] = [
  {
    id: "mental-health-basics",
    title: "Pas de santé sans santé mentale",
    description: "Prendre soin de sa santé, c'est aussi prendre soin de sa santé mentale.",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/1.png"),
    content: {
      title: "Pas de santé sans santé mentale",
      imageCaption: "image : santé mentale info service.",
      markdown: `Prendre soin de sa santé, c'est aussi prendre soin de sa santé mentale.

La santé mentale fait partie intégrante de notre santé globale. Comme le rappelle l'Organisation mondiale de la santé (OMS) : **il n'y a pas de santé sans santé mentale**. Longtemps tabou et mise de côté, elle est pourtant aussi importante que la santé physique. Toutes deux sont étroitement liées : ce que l'on vit dans notre tête peut impacter notre corps, et inversement.

Oui, notre corps peut envoyer des signaux d'alerte. **Notre cerveau aussi**.`,
      author: "Santé mentale info service",
      authorDescription: "Le site de Santé publique France dédié à la santé mentale.",
      authorIcon: require("../../../assets/imgs/resources/sante-mentale-info-service.png"),
      rubrique: "Comprendre la santé mentale",
    },
  },
  {
    id: "mental-health-meaning",
    title: "Mais au fait, avoir une bonne santé mentale : qu'est-ce que ça veut dire ?",
    description: "Comprendre ce qu'est la santé mentale et son importance dans notre vie quotidienne.",
    duration: "2 min",
    image: require("../../../assets/imgs/resources/2.jpg"),
    content: {
      title: "Mais au fait, avoir une bonne santé mentale : qu'est-ce que ça veut dire ?",
      imageCaption: "image : personne souriante",
      markdown: `La santé mentale, c'est un état de bien-être dans lequel une personne peut s'épanouir, surmonter les tensions normales de la vie, accomplir un travail productif et contribuer à la vie de sa communauté.

Elle englobe nos émotions, nos pensées et nos comportements. C'est notre capacité à :
- **Gérer le stress**
- **Entretenir des relations saines**
- **Prendre des décisions**

Avoir une bonne santé mentale ne signifie pas être heureux tout le temps ou ne jamais ressentir d'émotions négatives. C'est plutôt avoir les outils pour faire face aux défis de la vie.`,
      author: "Équipe Jardin Mental",
      authorDescription: "Le site de Santé publique France dédié à la santé mentale.",
      authorIcon: require("../../../assets/imgs/resources/sante-mentale-info-service.png"),
      rubrique: "Comprendre la santé mentale",
    },
  },
  {
    id: "mental-health-not-personal",
    title: "La santé mentale, ce n'est pas qu'une affaire personnelle.",
    description: "L'impact de la santé mentale sur la société et l'importance du soutien collectif.",
    duration: "4 min",
    image: require("../../../assets/imgs/resources/3.jpg"),
    content: {
      title: "La santé mentale, ce n'est pas qu'une affaire personnelle.",
      imageCaption: "image : groupe de personnes",
      markdown: `La santé mentale nous concerne tous. Elle affecte notre façon d'interagir avec les autres, notre productivité au travail, et notre contribution à la société.

## Un enjeu de société

Les troubles de santé mentale touchent **une personne sur quatre** au cours de sa vie. C'est un enjeu majeur de santé publique qui nécessite une approche collective.

## L'importance du soutien

Le soutien de l'entourage, la sensibilisation et la déstigmatisation sont essentiels pour créer un environnement favorable à la santé mentale de tous.

Points clés :
- Sensibilisation du public
- Déstigmatisation des troubles mentaux
- Création d'environnements favorables
- Soutien communautaire`,
      author: "Organisation Mondiale de la Santé",
      authorDescription: "Le site de Santé publique France dédié à la santé mentale.",
      authorIcon: require("../../../assets/imgs/resources/sante-mentale-info-service.png"),
      rubrique: "Comprendre la santé mentale",
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
