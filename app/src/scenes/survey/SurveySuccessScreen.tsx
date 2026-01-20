import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import CircleCheckMark from "@assets/svg/icon/CircleCheckMark";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from "react-native-reanimated";
import JMButton from "@/components/JMButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThumbsUpIcon from "@assets/svg/icon/ThumbsUp";
import ThumbsDownIcon from "@assets/svg/icon/ThumbsDown";
import logEvents from "@/services/logEvents";
import * as Sentry from "@sentry/react-native";
import { Typography } from "@/components/Typography";

// Storage keys for motivational messages
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX = "@MOTIVATIONAL_MESSAGE_INDEX";
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER = "@MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER";

// Message types
type MessageType = "encouragement" | "health_tip";

type MotivationalMessage = {
  id: number;
  type: MessageType;
  emoji: string;
  text: string;
  source?: string;
  sourceUrl?: string;
};

// Engagement & auto-observation messages
const ENCOURAGEMENT_MESSAGES: MotivationalMessage[] = [
  { id: 1, type: "encouragement", emoji: "🌱", text: "Merci, prendre le temps de remplir votre suivi, c'est déjà prendre soin de vous." },
  { id: 2, type: "encouragement", emoji: "🧩", text: "Chaque saisie est un pas de plus vers une meilleure compréhension de vous-même." },
  { id: 3, type: "encouragement", emoji: "🌱", text: "Revenir régulièrement, c'est construire pas à pas une meilleure connaissance de vous-même." },
  { id: 4, type: "encouragement", emoji: "✨", text: "Noter vos ressentis aide à identifier des émotions qui passent souvent inaperçues." },
  { id: 5, type: "encouragement", emoji: "📈", text: "Observer vos indicateurs, c'est mieux comprendre ce qui agit sur votre équilibre." },
  { id: 6, type: "encouragement", emoji: "💡", text: "En notant vos ressentis régulièrement, vous apprenez à mieux vous connaître, à votre rythme." },
  { id: 7, type: "encouragement", emoji: "🙌", text: "Faire le point sur votre journée, c'est vous accorder de l'attention." },
  { id: 8, type: "encouragement", emoji: "🕰️", text: "Prendre ces quelques minutes pour votre suivi, c’est prendre un temps pour vous." },
  { id: 9, type: "encouragement", emoji: "🌙", text: "Une petite observation aujourd’hui peut être utile pour demain." },
  { id: 11, type: "encouragement", emoji: "🔍", text: "Chaque saisie vous aide à mieux vous comprendre." },
  { id: 12, type: "encouragement", emoji: "❤️", text: "Se connaître, c'est se donner les moyens de mieux prendre soin de soi." },
  { id: 13, type: "encouragement", emoji: "🗝️", text: "L'auto-observation aide à repérer ce qui influence votre équilibre." },
  { id: 14, type: "encouragement", emoji: "📊", text: "Chaque indicateur noté enrichit votre regard sur votre quotidien." },
  { id: 15, type: "encouragement", emoji: "🤝", text: "Remplir votre suivi, c'est nourrir un dialogue avec vous-même." },
  { id: 16, type: "encouragement", emoji: "🌞", text: "Observer aujourd'hui, c'est vous donner des repères pour les jours à venir." },
  { id: 17, type: "encouragement", emoji: "🌍", text: "Ce moment que vous prenez contribue à votre équilibre." },
  { id: 18, type: "encouragement", emoji: "📝", text: "Noter vos ressentis, c'est reconnaître ce que vous traversez." },
  { id: 19, type: "encouragement", emoji: "🔄", text: "La régularité dans l'observation vous permet de mieux percevoir vos évolutions." },
  { id: 20, type: "encouragement", emoji: "🌟", text: "Faire votre suivi régulièrement, c'est progresser." },
  { id: 21, type: "encouragement", emoji: "⚖️", text: "Connaître vos variations, c'est apprendre à équilibrer votre quotidien." },
  { id: 22, type: "encouragement", emoji: "📌", text: "Chaque saisie est une trace précieuse pour mieux avancer." },
  { id: 24, type: "encouragement", emoji: "💭", text: "L'auto-observation, c'est un espace pour vous écouter." },
  { id: 25, type: "encouragement", emoji: "🧘", text: "Ce petit rituel quotidien soutient votre équilibre intérieur." },
  { id: 27, type: "encouragement", emoji: "📖", text: "Votre suivi raconte votre histoire, jour après jour." },
  { id: 28, type: "encouragement", emoji: "💬", text: "Mettre des mots sur vos ressentis, c'est apprendre à mieux les comprendre." },
  { id: 29, type: "encouragement", emoji: "🌈", text: "Ce suivi est un geste simple, mais symbolique." },
  { id: 61, type: "encouragement", emoji: "🌿", text: "Merci d'avoir pris ce moment pour vous aujourd'hui." },
  { id: 66, type: "encouragement", emoji: "📅", text: "Belle régularité : votre constance crée de la clarté." },
  { id: 67, type: "encouragement", emoji: "🌱", text: "Pensez à vous féliciter d'être venu jusqu'ici — c'est un vrai effort." },
  { id: 68, type: "encouragement", emoji: "🧭", text: "Gardez le cap : vous progressez dans la compréhension de ce que vous vivez." },
  { id: 69, type: "encouragement", emoji: "⚖️", text: "Faire le point sur la journée aide à mieux vous situer." },
  { id: 70, type: "encouragement", emoji: "🕊️", text: "Pas besoin d'être \"parfait\" : l'essentiel c'est de faire le point." },
  { id: 71, type: "encouragement", emoji: "📌", text: "Prendre 1 minute pour soi, c’est déjà prendre soin de votre bien-être." },
  { id: 72, type: "encouragement", emoji: "🌱", text: "Une saisie de plus aide à mieux suivre votre évolution." },
  { id: 73, type: "encouragement", emoji: "🗂️", text: "Rassurez-vous : vos ressentis sont en sécurité et au bon endroit." },
  { id: 74, type: "encouragement", emoji: "🛠️", text: "Chaque observation enrichit votre suivi personnel." },
  { id: 75, type: "encouragement", emoji: "⚓", text: "Vous vous offrez un repère pour les jours faciles comme difficiles." },
  { id: 76, type: "encouragement", emoji: "⚓", text: "Garder ces petites habitudes contribue à votre équilibre. Bravo !" },
  { id: 77, type: "encouragement", emoji: "🧘", text: "Votre régularité crée de la stabilité, même quand tout bouge." },
  { id: 78, type: "encouragement", emoji: "🕰️", text: "Merci d’avoir pris ce temps pour vous." },
  { id: 79, type: "encouragement", emoji: "🛤️", text: "Votre trajectoire devient plus nette : continuez à votre rythme." },
  { id: 80, type: "encouragement", emoji: "🗺️", text: "Vous cartographiez votre quotidien, c'est précieux pour avancer." },
  { id: 81, type: "encouragement", emoji: "🧱", text: "Une brique de plus aujourd'hui : la structure se consolide." },
  { id: 82, type: "encouragement", emoji: "🚪", text: "Merci d'avoir \"ouvert la porte\" aujourd'hui — c'est souvent le plus dur." },
  { id: 83, type: "encouragement", emoji: "🧭", text: "La cohérence vient avec la répétition : vous êtes sur la bonne voie." },
  { id: 84, type: "encouragement", emoji: "🎯", text: "Gardez en tête vos intentions de départ : c’est ce qui compte le plus." },
  { id: 85, type: "encouragement", emoji: "🧺", text: 'Vous avez "rangé" votre journée — bravo pour l\'effort.' },
  { id: 86, type: "encouragement", emoji: "💬", text: "Merci d'avoir mis des mots — même simples — sur votre ressenti." },
  { id: 87, type: "encouragement", emoji: "🕊️", text: "Bravo pour votre engagement mais surtout prenez le temps qu’il vous faut." },
  { id: 88, type: "encouragement", emoji: "🌗", text: "Chaque jour est différent, mais votre suivi continue : c’est précieux." },
  { id: 89, type: "encouragement", emoji: "🧱", text: "Chaque petit pas compte : la régularité fait la différence." },
  { id: 90, type: "encouragement", emoji: "🔁", text: "Revenir aujourd'hui, c'est déjà gagner en clarté." },
  { id: 91, type: "encouragement", emoji: "🧭", text: "Ces observations servent de repères pour votre boussole personnelle." },
  { id: 92, type: "encouragement", emoji: "🧯", text: "Même dans l'urgence, une note aide à prendre du recul." },
  { id: 93, type: "encouragement", emoji: "🎒", text: "Vos notes construisent votre suivi, jour après jour." },
  { id: 94, type: "encouragement", emoji: "🧩", text: "Pas à pas, vos observations donnent une meilleure vue d’ensemble de votre quotidien." },
  { id: 95, type: "encouragement", emoji: "🧵", text: "Vous reliez les points pour mieux comprendre vos ressentis." },
  { id: 96, type: "encouragement", emoji: "🌤️", text: "Votre météo intérieure se précise à chaque saisie." },
  { id: 97, type: "encouragement", emoji: "🧰", text: "Votre suivi s’enrichit grâce à votre observation d’aujourd’hui. Bravo !" },
  { id: 98, type: "encouragement", emoji: "📍", text: "Noter vous aide à mieux vous repérer." },
  { id: 99, type: "encouragement", emoji: "💭", text: "Vous êtes dans un espace sûr, sans jugement." },
  { id: 100, type: "encouragement", emoji: "🧘", text: "C'est la régularité qui fait la différence." },
  { id: 101, type: "encouragement", emoji: "🧭", text: "Encore une étape vers un suivi qui vous ressemble." },
  { id: 102, type: "encouragement", emoji: "🪙", text: "Ces minutes investies aujourd'hui vous serviront demain." },
  { id: 103, type: "encouragement", emoji: "☀️", text: "Votre suivi régulier, vous apportera de la clarté." },
  { id: 104, type: "encouragement", emoji: "📊", text: "Une marche de plus : inutile de sauter les étapes." },
  { id: 105, type: "encouragement", emoji: "🧭", text: "Noter vos pensées, même brièvement, vous aide à garder le cap." },
  { id: 106, type: "encouragement", emoji: "🌿", text: "Prenez une respiration : vous avez fait votre part pour aujourd'hui." },
  { id: 107, type: "encouragement", emoji: "💬", text: "Visualiser ses données peut aider à repérer des déclencheurs émotionnels." },
  { id: 108, type: "encouragement", emoji: "🌿", text: "Merci d’avoir pris un moment pour vous : chaque petit pas compte." },
  { id: 109, type: "encouragement", emoji: "🙏", text: "Prendre ce moment, c'est déjà vous choisir. Merci pour cette attention." },
  { id: 110, type: "encouragement", emoji: "✨", text: "Merci pour votre constance : chaque saisie vous guide un peu plus." },
  { id: 111, type: "encouragement", emoji: "🍇", text: "Chaque instant passé à vous écouter portera ses fruits." },
  { id: 112, type: "encouragement", emoji: "⏸️", text: "Merci d'avoir fait une pause aujourd'hui, c'est précieux." },
  { id: 113, type: "encouragement", emoji: "💫", text: "Cette minute que vous vous accordez vous aidera pour la suite." },
  { id: 114, type: "encouragement", emoji: "📖", text: "Merci d’avoir pris du recul : chaque petit pas compte pour demain." },
  { id: 115, type: "encouragement", emoji: "⚖️", text: "En venant ici régulièrement, vous construisez votre stabilité." },
  { id: 116, type: "encouragement", emoji: "🌱", text: "Dédier un temps pour vous-même vous fait évoluer." },
  { id: 117, type: "encouragement", emoji: "🌱", text: "Vous cultivez votre bien-être, graine après graine." },
  { id: 118, type: "encouragement", emoji: "🔎", text: "S’observer sans jugement, c’est se faire un vrai cadeau." },
  { id: 119, type: "encouragement", emoji: "🧘", text: "Respirer, noter, prendre du recul, sont des gestes qui comptent vraiment." },
  { id: 120, type: "encouragement", emoji: "🎯", text: "Merci d'avoir posé des mots sur vos ressentis." },
  { id: 121, type: "encouragement", emoji: "🛠️", text: "Merci d'avoir pris ce temps : vous renforcez vos appuis, durablement." },
  { id: 122, type: "encouragement", emoji: "🌗", text: "Merci de vous accueillir tel que vous êtes, sans pression." },
  { id: 123, type: "encouragement", emoji: "🧭", text: "Merci d'avoir choisi ce rendez-vous régulier ; il vous aide à garder le cap." },
  { id: 125, type: "encouragement", emoji: "🧷", text: "Bravo d'avoir observé vos émotions et tout ce qui les entoure." },
  { id: 126, type: "encouragement", emoji: "📆", text: "Merci d'être fidèle à ce rituel. La constance fait la différence." },
];

// Conseils & repères santé mentale messages
const HEALTH_TIP_MESSAGES: MotivationalMessage[] = [
  {
    id: 31,
    type: "health_tip",
    emoji: "🚶",
    text: "Marcher 30 minutes par jour aide à réduire le stress et améliore l'humeur.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 32,
    type: "health_tip",
    emoji: "😴",
    text: "Avoir un rythme de sommeil régulier favorise un meilleur équilibre psychique.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 33,
    type: "health_tip",
    emoji: "🧘",
    text: "La méditation de pleine conscience peut réduire de 20 à 30 % les symptômes d'anxiété.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr/actualite/la-pleine-conscience-un-outil-pour-mieux-gerer-son-anxiete",
  },
  {
    id: 34,
    type: "health_tip",
    emoji: "📓",
    text: "Noter ses ressentis contribue à mieux réguler ses émotions.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    id: 35,
    type: "health_tip",
    emoji: "🎶",
    text: "Écouter de la musique qui vous plaît peut améliorer votre humeur rapidement.",
    source: "Harvard Health",
    sourceUrl: "https://www.health.harvard.edu",
  },
  {
    id: 36,
    type: "health_tip",
    emoji: "🌿",
    text: "Passer du temps dans la nature aide à diminuer l'anxiété et à se ressourcer.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 37,
    type: "health_tip",
    emoji: "👥",
    text: "Entretenir des liens sociaux réguliers protège la santé mentale.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 38,
    type: "health_tip",
    emoji: "💧",
    text: "Boire suffisamment d'eau contribue à la concentration et à l'énergie mentale.",
    source: "EFSA",
    sourceUrl: "https://www.efsa.europa.eu",
  },
  {
    id: 39,
    type: "health_tip",
    emoji: "📱",
    text: "Limiter son temps d'écran le soir améliore la qualité du sommeil.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 40,
    type: "health_tip",
    emoji: "🥦",
    text: "Une alimentation équilibrée joue un rôle dans la régulation de l'humeur.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 41,
    type: "health_tip",
    emoji: "🛑",
    text: "Faire une pause régulière au travail améliore l'attention et réduit le stress.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 42,
    type: "health_tip",
    emoji: "🌞",
    text: "S'exposer à la lumière naturelle en journée soutient votre horloge biologique.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 43,
    type: "health_tip",
    emoji: "✍️",
    text: "Tenir un journal de gratitude favorise un état d'esprit positif.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    id: 44,
    type: "health_tip",
    emoji: "🛌",
    text: "Une courte sieste (20 minutes max) peut améliorer l'énergie et l'humeur.",
    source: "INSERM",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 45,
    type: "health_tip",
    emoji: "🧃",
    text: "Prendre un petit-déjeuner équilibré contribue à une meilleure stabilité émotionnelle.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 46,
    type: "health_tip",
    emoji: "📚",
    text: "Lire quelques pages d'un livre peut favoriser la détente avant de dormir.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
  },
  {
    id: 47,
    type: "health_tip",
    emoji: "🎨",
    text: "S'accorder un temps créatif (dessin, musique, écriture) aide à exprimer ses émotions.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    id: 48,
    type: "health_tip",
    emoji: "🧘",
    text: "Pratiquer la respiration profonde aide à calmer le corps et l'esprit.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 49,
    type: "health_tip",
    emoji: "🥗",
    text: "Consommer des fruits et légumes variés soutient le bien-être global.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 50,
    type: "health_tip",
    emoji: "🏃",
    text: "Faire du sport régulièrement diminue le risque de dépression.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 51,
    type: "health_tip",
    emoji: "🎧",
    text: "Écouter un podcast ou une histoire apaisante peut aider à se relaxer.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
  },
  {
    id: 52,
    type: "health_tip",
    emoji: "🕑",
    text: "Garder des horaires réguliers dans sa journée soutient la stabilité mentale.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 53,
    type: "health_tip",
    emoji: "☕",
    text: "Limiter la caféine en fin de journée améliore le sommeil.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 54,
    type: "health_tip",
    emoji: "🛋️",
    text: "Aménager un espace calme pour se détendre aide à réduire le stress.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    id: 55,
    type: "health_tip",
    emoji: "🎯",
    text: "Se fixer de petits objectifs atteignables nourrit la motivation.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 56,
    type: "health_tip",
    emoji: "🧂",
    text: "Réduire le sel dans son alimentation participe à une meilleure santé globale.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 57,
    type: "health_tip",
    emoji: "📞",
    text: "Parler de ses émotions avec un proche favorise le soutien social.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    id: 58,
    type: "health_tip",
    emoji: "🕺",
    text: "Danser sur une musique entraînante stimule l'énergie et la bonne humeur.",
    source: "Harvard Health",
    sourceUrl: "https://www.health.harvard.edu",
  },
  {
    id: 59,
    type: "health_tip",
    emoji: "🌸",
    text: "Prendre le temps de respirer profondément dans la journée réduit la tension corporelle.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 60,
    type: "health_tip",
    emoji: "🛀",
    text: "Prendre une douche chaude avant de dormir favorise la détente.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
  },
  {
    id: 127,
    type: "health_tip",
    emoji: "🌍",
    text: "Plus d’un milliard de personnes dans le monde vivent avec des troubles psychiques.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 129,
    type: "health_tip",
    emoji: "👶",
    text: "Environ la moitié des troubles psychiques sévères commencent avant l’âge de 14 ans.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 140,
    type: "health_tip",
    emoji: "🇫🇷",
    text: "En France, environ 13 millions de personnes présentent un trouble psychique.",
    source: "Ministère de la Santé",
    sourceUrl: "https://sante.gouv.fr",
  },
  {
    id: 141,
    type: "health_tip",
    emoji: "💊",
    text: "Environ un quart des français prend des anxiolytiques ou antidépresseurs.",
    source: "Ministère de la Santé",
    sourceUrl: "https://sante.gouv.fr",
  },
  {
    id: 142,
    type: "health_tip",
    emoji: "ℹ️",
    text: "La dépression concerne environ 15 à 20% de la population française au cours de la vie.",
    source: "Ministère de la Santé",
    sourceUrl: "https://sante.gouv.fr",
  },
  {
    id: 146,
    type: "health_tip",
    emoji: "🤐",
    text: "70% des Français considèrent la santé mentale comme un sujet tabou (84% chez les personnes concernées).",
    source: "Parlons santé mentale 2025",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 150,
    type: "health_tip",
    emoji: "🧩",
    text: "Environ 600 000 personnes souffrent de schizophrénie en France, soit près de 1% de la population.",
    source: "Ameli.fr",
    sourceUrl: "https://www.ameli.fr",
  },
  {
    id: 155,
    type: "health_tip",
    emoji: "🙅‍♂️",
    text: "En Europe, 1 personne sur 2 souffrant d'un trouble mental n'a consulté aucun professionnel de santé mentale.",
    source: "Commission européenne",
    sourceUrl: "https://ec.europa.eu",
  },
  {
    id: 156,
    type: "health_tip",
    emoji: "🏃",
    text: "Le sport libère des endorphines, des « hormones du bien-être » qui procurent une sensation de plaisir et réduisent le stress.",
    source: "Institutducerveau.org",
    sourceUrl: "https://www.institutducerveau.org",
  },
  {
    id: 158,
    type: "health_tip",
    emoji: "😂",
    text: "Rire diminue le stress et procure un état de bien-être en libérant des endorphines, antidouleurs naturels produits par le cerveau.",
    source: "Institutducerveau.org",
    sourceUrl: "https://www.institutducerveau.org",
  },
  {
    id: 161,
    type: "health_tip",
    emoji: "🎨",
    text: "Une activité créative permet de réduire le stress : par exemple, le dessin ou la peinture fait chuter le cortisol (l'hormone du stress) de façon significative.",
    source: "Université de Drexel",
    sourceUrl: "https://drexel.edu",
  },
  {
    id: 162,
    type: "health_tip",
    emoji: "🚫",
    text: "L'isolement social augmente fortement le risque d'anxiété, de dépression et de maladies.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 163,
    type: "health_tip",
    emoji: "💡",
    text: "La luminothérapie est efficace contre la dépression saisonnière : 60 à 90 % des patients voient leur humeur s'améliorer en quelques jours grâce à la lumière intense",
    source: "Sante.fr",
    sourceUrl: "https://www.sante.fr",
  },
  {
    id: 164,
    type: "health_tip",
    emoji: "🧠",
    text: "Les troubles psychiques sont des maladies comme les autres, ils peuvent être soignés et accompagnés.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 165,
    type: "health_tip",
    emoji: "🤝",
    text: "Parler de sa santé mentale est un acte de courage, pas un signe de faiblesse.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 166,
    type: "health_tip",
    emoji: "🗣️",
    text: "Consulter un psychologue ou un psychiatre, c'est prendre soin de soi, comme on le ferait pour sa santé physique.",
    source: "Ministère de la Santé",
    sourceUrl: "https://sante.gouv.fr",
  },
  {
    id: 167,
    type: "health_tip",
    emoji: "🌱",
    text: "Aller mieux est un chemin unique, avec ses hauts, ses bas et ses progrès parfois invisibles.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 168,
    type: "health_tip",
    emoji: "🧩",
    text: "Un trouble psychique ne résume pas une personne et n’efface pas sa singularité.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 169,
    type: "health_tip",
    emoji: "🎯",
    text: "Trouble psychique ou non : vivre une vie épanouie est possible avec le bon accompagnement.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 170,
    type: "health_tip",
    emoji: "🌤️",
    text: "Beaucoup de personnes vivent avec des troubles psychiques, souvent plus qu’on ne l’imagine.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 171,
    type: "health_tip",
    emoji: "💬",
    text: "Mettre des mots sur ce qu'on ressent est déjà une forme de soin.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 172,
    type: "health_tip",
    emoji: "🤝",
    text: "La bienveillance envers soi-même est essentielle quand on traverse une période difficile.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 173,
    type: "health_tip",
    emoji: "📘",
    text: "Comprendre son trouble, c'est déjà reprendre du pouvoir sur sa santé mentale.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 174,
    type: "health_tip",
    emoji: "🧘",
    text: "Prendre soin de soi, c’est aussi écouter son corps.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 175,
    type: "health_tip",
    emoji: "🧠",
    text: "Souvent invisibles, les troubles psychiques existent et méritent d’être pris au sérieux.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 176,
    type: "health_tip",
    emoji: "🔄",
    text: "Ce n'est pas parce qu'on a déjà rechuté qu'on ne peut pas aller mieux. Le rétablissement n'est pas linéaire.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 177,
    type: "health_tip",
    emoji: "📊",
    text: "Un Français sur cinq est concerné chaque année par un trouble psychique. Ce n'est ni rare ni marginal.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 178,
    type: "health_tip",
    emoji: "💌",
    text: "Oser dire « je ne vais pas bien » à une personne de confiance est un premier pas vers l'apaisement.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 179,
    type: "health_tip",
    emoji: "🎧",
    text: "L'écoute active est un vrai soutien pour les personnes en souffrance : pas besoin d'avoir toutes les réponses.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 180,
    type: "health_tip",
    emoji: "📚",
    text: "Il existe de nombreuses formes de thérapies, chacune peut aider selon ses besoins et ses envies.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 181,
    type: "health_tip",
    emoji: "🌻",
    text: "Les émotions désagréables ne sont pas des faiblesses : elles ont toutes une fonction utile.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 182,
    type: "health_tip",
    emoji: "📆",
    text: "Se sentir mal aujourd'hui ne veut pas dire qu'on ira mal demain. Tout peut évoluer.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 183,
    type: "health_tip",
    emoji: "📣",
    text: "Moins on juge la souffrance des autres, plus on libère leur possibilité de guérir.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 185,
    type: "health_tip",
    emoji: "🧍‍♂️",
    text: "Avoir besoin d'aide n'est pas un échec mais une étape vers le mieux-être.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 186,
    type: "health_tip",
    emoji: "📖",
    text: "Les témoignages de rétablissement montrent qu'on peut surmonter une période difficile avec de l'aide.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 187,
    type: "health_tip",
    emoji: "🏞️",
    text: "La nature a des effets bénéfiques sur l'humeur et le stress : s'y reconnecter aide l'équilibre mental.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 188,
    type: "health_tip",
    emoji: "🕰️",
    text: "S'autoriser des pauses n'est pas un luxe, c'est une condition pour préserver sa santé mentale.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 189,
    type: "health_tip",
    emoji: "🧩",
    text: "Chaque personne vit la souffrance psychique différemment, il n'y a pas une seule bonne façon d'aller mieux.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 190,
    type: "health_tip",
    emoji: "🔍",
    text: "S'accepter tel que l'on est, même avec ses vulnérabilités, est un geste positif pour sa santé mentale.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 191,
    type: "health_tip",
    emoji: "💼",
    text: "Il est possible d'avoir un trouble psychique et de mener une carrière épanouissante.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 192,
    type: "health_tip",
    emoji: "🙋",
    text: "Demander de l'aide, c'est poser un acte fort pour sa santé, pas montrer une faiblesse.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 194,
    type: "health_tip",
    emoji: "🏛️",
    text: "La santé mentale est un droit, au même titre que la santé physique.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 195,
    type: "health_tip",
    emoji: "🧭",
    text: "Prendre soin de sa santé mentale, c'est apprendre à s'écouter et à mieux se connaître.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 196,
    type: "health_tip",
    emoji: "🔐",
    text: "Il est possible de vivre pleinement en ayant traversé un burn-out ou une dépression.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 197,
    type: "health_tip",
    emoji: "🌱",
    text: "Créer et nourrir des liens bienveillants avec les autres aide à mieux faire face aux difficultés.",
    source: "HAS",
    sourceUrl: "https://www.has-sante.fr",
  },
  {
    id: 198,
    type: "health_tip",
    emoji: "🧘‍♂️",
    text: "La respiration profonde apaise le système nerveux et réduit le stress.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 200,
    type: "health_tip",
    emoji: "📺",
    text: "Briser les clichés sur la santé mentale encourage davantage de personnes à demander de l’aide.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 201,
    type: "health_tip",
    emoji: "🧱",
    text: "La honte empêche souvent d’aller mieux. Parler à quelqu’un qui écoute sans juger aide à la surmonter.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    id: 202,
    type: "health_tip",
    emoji: "🎨",
    text: "La créativité aide à exprimer ce qui ne se dit pas toujours avec des mots.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    id: 203,
    type: "health_tip",
    emoji: "💬",
    text: "Se confier à un proche est souvent le premier pas vers un soutien plus large.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    id: 204,
    type: "health_tip",
    emoji: "🌅",
    text: "Se lever tous les jours à la même heure aide à améliorer l'humeur et le sommeil.",
    source: "Institut national du sommeil et de la vigilance",
    sourceUrl: "https://institut-sommeil-vigilance.org",
  },
  {
    id: 205,
    type: "health_tip",
    emoji: "☀️",
    text: "S'exposer à la lumière du jour au réveil est bénéfique pour le sommeil et l'humeur.",
    source: "Institut national du sommeil et de la vigilance",
    sourceUrl: "https://institut-sommeil-vigilance.org",
  },
  {
    id: 206,
    type: "health_tip",
    emoji: "⏰",
    text: "Il n'y a pas de durée idéale de sommeil. Le bon indicateur c'est de vous sentir reposé.",
    source: "Institut national du sommeil et de la vigilance",
    sourceUrl: "https://institut-sommeil-vigilance.org",
  },
  {
    id: 207,
    type: "health_tip",
    emoji: "🤳",
    text: "Limiter les écrans avant le coucher favorise un sommeil plus réparateur.",
    source: "Institut national du sommeil et de la vigilance",
    sourceUrl: "https://institut-sommeil-vigilance.org",
  },
  {
    id: 208,
    type: "health_tip",
    emoji: "😴",
    text: "Les cauchemars sont un mécanisme normal de régulation des émotions.",
    source: "Institut national du sommeil et de la vigilance",
    sourceUrl: "https://institut-sommeil-vigilance.org",
  },
];

// Combined messages for random selection
const ALL_MESSAGES = [...ENCOURAGEMENT_MESSAGES, ...HEALTH_TIP_MESSAGES];

// Helper function to shuffle array (Fisher-Yates shuffle)
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper functions for sequential message management
const getNextMotivationalMessage = async () => {
  try {
    // Get current index and shuffled order from storage
    const storedIndex = await AsyncStorage.getItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX);
    const storedOrder = await AsyncStorage.getItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER);

    // Parse and validate currentIndex
    let currentIndex = 0;
    if (storedIndex) {
      const parsed = parseInt(storedIndex, 10);
      // Check if parseInt returned a valid number
      if (!isNaN(parsed) && parsed >= 0) {
        currentIndex = parsed;
      }
    }

    let messageOrder: number[];

    // If we don't have a shuffled order or we've reached the end, create a new shuffled order
    if (!storedOrder || currentIndex >= ALL_MESSAGES.length || currentIndex < 0) {
      // Create shuffled indices
      const indices = Array.from({ length: ALL_MESSAGES.length }, (_, i) => i);
      const shuffledIndices = shuffleArray(indices);
      messageOrder = shuffledIndices;

      // Save new shuffled order and reset index
      await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER, JSON.stringify(shuffledIndices));
      currentIndex = 0;
    } else {
      // Parse JSON with validation
      try {
        const parsedOrder = JSON.parse(storedOrder);
        // Validate that it's an array
        if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
          messageOrder = parsedOrder;
        } else {
          throw new Error("Invalid message order format");
        }
      } catch (parseError) {
        console.warn("Failed to parse stored message order:", parseError);
        // Reset to shuffled order if parse fails
        const indices = Array.from({ length: ALL_MESSAGES.length }, (_, i) => i);
        messageOrder = shuffleArray(indices);
        await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER, JSON.stringify(messageOrder));
        currentIndex = 0;
      }
    }

    // Get the message at the current position in the shuffled order with bounds checking
    const messageIndex = messageOrder[currentIndex];

    // Validate messageIndex is within bounds
    if (messageIndex === undefined || messageIndex < 0 || messageIndex >= ALL_MESSAGES.length) {
      console.warn("Invalid message index, resetting:", messageIndex);
      // Reset and return first message
      await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX, "0");
      return ALL_MESSAGES[0];
    }

    const message = ALL_MESSAGES[messageIndex];

    // Additional safety check
    if (!message) {
      console.warn("Message not found at index:", messageIndex);
      return ALL_MESSAGES[0];
    }

    // Increment index for next time
    const nextIndex = currentIndex + 1;
    await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX, nextIndex.toString());

    return message;
  } catch (error) {
    console.warn("Error getting motivational message:", error);
    Sentry.captureException(error, {
      tags: { context: "survey_success_motivational_message" },
      extra: { storageKeys: [STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX, STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER] },
    });
    // Fallback to first message
    return ALL_MESSAGES[0];
  }
};

interface SurveySuccessScreenProps {
  navigation: any;
  route?: {
    params?: {
      onComplete?: () => void;
    };
  };
}

const SurveySuccessScreen: React.FC<SurveySuccessScreenProps> = ({ navigation, route }) => {
  const { setCustomColor } = useStatusBar();
  const [showPanel, setShowPanel] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(ALL_MESSAGES[0]); // Default fallback
  const [thumbSelection, setThumbSelection] = useState<"up" | "down" | null>(null);

  // Load sequential motivational message
  useEffect(() => {
    const initializeScreen = async () => {
      const message = await getNextMotivationalMessage();
      setCurrentMessage(message);
    };
    initializeScreen();
  }, []);

  // Animation values
  const panelTranslateY = useSharedValue(300); // Start below screen
  const buttonOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(1); // Start visible, fade out when panel opens

  const handleFinish = () => {
    // Log Matomo event based on thumb selection
    if (thumbSelection) {
      if (thumbSelection === "up") {
        logEvents.logHealthTipFeedbackUp(currentMessage.id);
      } else {
        logEvents.logHealthTipFeedbackDown(currentMessage.id);
      }
    }

    // Call the callback if provided with error handling
    if (route?.params?.onComplete) {
      try {
        route.params.onComplete();
      } catch (error) {
        console.error("Error in onComplete callback:", error);
        Sentry.captureException(error, {
          tags: { context: "survey_success_on_complete" },
          extra: { messageId: currentMessage.id },
        });
        // Don't block navigation, just log the error
      }
    }
  };

  const handleThumbPress = (thumbType: "up" | "down") => {
    setThumbSelection(thumbSelection === thumbType ? null : thumbType);
  };

  useEffect(() => {
    // Show panel after 1.5 seconds
    const timer = setTimeout(() => {
      setShowPanel(true);
      // Fade out content at the same time panel starts
      contentOpacity.value = withTiming(0, {
        duration: 750,
        easing: Easing.out(Easing.cubic),
      });
      // Animate panel sliding up
      panelTranslateY.value = withTiming(0, {
        duration: 750,
        easing: Easing.out(Easing.cubic),
      });
      // Show button with delay and opacity animation
      buttonOpacity.value = withDelay(
        1000,
        withTiming(1, {
          duration: 750,
          easing: Easing.out(Easing.cubic),
        })
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );
  // Animated styles
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: panelTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* White Background First Screen */}
      <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <Animated.View style={[{ alignItems: "center" }, contentAnimatedStyle]}>
          <View style={{ marginBottom: 32 }}>
            <CircleCheckMark color={"#0084B2"} width={40} height={41} />
          </View>
          <Typography className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 text-center")}>
            L'observation du jour est terminée
          </Typography>
        </Animated.View>
      </View>

      {/* Animated Bottom Panel */}
      {showPanel && (
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: currentMessage.type === "encouragement" ? "50%" : "60%", // Take 60% of screen height
              minHeight: currentMessage.type === "encouragement" ? 420 : 500, // Minimum height for small screens
              backgroundColor: TW_COLORS.CNAM_CYAN_50_LIGHTEN_90,
              borderTopLeftRadius: 80,
              borderTopRightRadius: 80,
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 40,
              justifyContent: "space-between",
            },
            panelAnimatedStyle,
          ]}
        >
          <View className="absolute top-[-38px] flex items-center justify-center w-full">
            <View className="ml-14 rounded-full w-16 h-16 p-2" style={{ backgroundColor: TW_COLORS.CNAM_CYAN_200_LIGHTEN_60 }}></View>
          </View>
          <View className="absolute top-[-30px] self-center rounded-full w-16 h-16 border border-white bg-cnam-cyan-lighten-80 p-2 flex items-center justify-center">
            <Typography className="text-3xl">{currentMessage.emoji}</Typography>
          </View>
          {/* Encouragement */}
          {currentMessage.type === "encouragement" && (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              {/* Applause Hands Icon positioned at the top like in mockup */}
              {/* Content centered in the panel */}
              <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
                <Typography className={mergeClassNames("text-2xl font-normal font-body text-cnam-primary-900 text-center")}>
                  {currentMessage.text}
                </Typography>
              </View>
            </View>
          )}
          {/* Health Tip */}
          {currentMessage.type === "health_tip" && (
            <View style={{ flex: 1, alignItems: "center" }} className="mt-8">
              {/* Applause Hands Icon positioned at the top like in mockup */}

              {/* Content centered in the panel */}
              <View style={{ alignItems: "center" }} className="w-full">
                <View className="bg-cnam-cyan-lighten-80 rounded-[32px] pt-[22px] pb-4 px-5 mb-4 w-full">
                  {/* Le saviez-vous? header */}
                  <View className="flex flex-row mb-3">
                    <View className="bg-cnam-cyan-700-darken-40 flex flex-row justify-center items-center rounded-lg px-1.5 py-0.5">
                      <Typography className="text-lg">💡</Typography>
                      <Typography className="text-sm font-semibold text-white">Le saviez-vous ?</Typography>
                    </View>
                  </View>

                  {/* Health tip text */}
                  <Typography
                    className={mergeClassNames(
                      "text-cnam-primary-900 mb-3",
                      Dimensions.get("window").width > 380 ? "text-2xl text-body font-semibold" : typography.textLgSemibold
                    )}
                  >
                    {currentMessage.text}
                  </Typography>

                  {/* Source */}
                  {currentMessage.source && (
                    <Typography className={mergeClassNames("text-sm text-gray-800 italic")}>Source : {currentMessage.source}</Typography>
                  )}
                </View>

                {/* Feedback section for health tips */}
                <View className="mt-5 items-center flex flex-row gap-4 w-full pl-2">
                  <Typography className={mergeClassNames("text-base text-gray-800")}>Cette info est-elle utile ?</Typography>
                  <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    {/* Thumbs up */}
                    <TouchableOpacity
                      onPress={() => handleThumbPress("up")}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 22,
                        backgroundColor: thumbSelection === "up" ? "#799092" : "white",
                        borderWidth: 1,
                        borderColor: "#799092",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      <ThumbsUpIcon color={thumbSelection === "up" ? "white" : "#799092"} width={20} height={20} />
                    </TouchableOpacity>

                    {/* Thumbs down */}
                    <TouchableOpacity
                      onPress={() => handleThumbPress("down")}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 22,
                        backgroundColor: thumbSelection === "down" ? "#799092" : "white",
                        borderWidth: 1,
                        borderColor: "#799092",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ThumbsDownIcon color={thumbSelection === "down" ? "white" : "#799092"} width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Animated Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <JMButton onPress={handleFinish} title="Retour à l'accueil" variant="primary" width="full" />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

export default SurveySuccessScreen;
