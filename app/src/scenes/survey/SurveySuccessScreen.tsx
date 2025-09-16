import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
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

// Storage keys for motivational messages
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX = "@MOTIVATIONAL_MESSAGE_INDEX";
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER = "@MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER";

// Message types
type MessageType = "encouragement" | "health_tip";

type MotivationalMessage = {
  type: MessageType;
  emoji: string;
  text: string;
  source?: string;
  sourceUrl?: string;
};

// Engagement & auto-observation messages
const ENCOURAGEMENT_MESSAGES: MotivationalMessage[] = [
  { type: "encouragement", emoji: "👏", text: "Prendre le temps de remplir ton suivi, c'est déjà prendre soin de toi." },
  { type: "encouragement", emoji: "🧩", text: "Chaque saisie est une petite pièce du puzzle de ta santé mentale." },
  { type: "encouragement", emoji: "🌱", text: "Revenir régulièrement, c'est construire pas à pas une meilleure connaissance de toi-même." },
  { type: "encouragement", emoji: "✨", text: "L'auto-observation permet de mettre en lumière ce qui reste invisible au quotidien." },
  { type: "encouragement", emoji: "📈", text: "Observer tes indicateurs, c'est comprendre ce qui influence ton équilibre." },
  { type: "encouragement", emoji: "💡", text: "En notant tes ressentis, tu crées un journal de ton bien-être." },
  { type: "encouragement", emoji: "🙌", text: "Faire le point sur ta journée, c'est déjà un acte positif envers toi-même." },
  { type: "encouragement", emoji: "🕰️", text: "Deux minutes pour remplir ton suivi = un temps précieux que tu t'accordes." },
  { type: "encouragement", emoji: "🌙", text: "Même une petite observation aujourd'hui peut t'apporter des clés demain." },
  { type: "encouragement", emoji: "💪", text: "Tu fais de ton bien-être une priorité, un pas après l'autre." },
  { type: "encouragement", emoji: "🔍", text: "Chaque saisie est une observation qui compte." },
  { type: "encouragement", emoji: "🎯", text: "Ton engagement à noter régulièrement renforce ton parcours personnel." },
  { type: "encouragement", emoji: "🗝️", text: "L'auto-observation est une clé pour mieux comprendre ce qui agit sur toi." },
  { type: "encouragement", emoji: "📊", text: "Chaque indicateur noté enrichit ta compréhension de toi-même." },
  { type: "encouragement", emoji: "🤝", text: "Remplir ton suivi, c'est engager un dialogue bienveillant avec toi-même." },
  { type: "encouragement", emoji: "🌞", text: "Observer aujourd'hui, c'est préparer un demain plus serein." },
  { type: "encouragement", emoji: "🌍", text: "Tu contribues à ton équilibre rien qu'en prenant ce moment." },
  { type: "encouragement", emoji: "📝", text: "Noter tes ressentis, c'est prendre un temps pour les reconnaître." },
  { type: "encouragement", emoji: "🔄", text: "La régularité fait toute la différence dans l'auto-observation." },
  { type: "encouragement", emoji: "🌟", text: "Faire ton suivi, c'est déjà progresser." },
  { type: "encouragement", emoji: "⚖️", text: "Connaître tes variations, c'est apprendre à équilibrer ton quotidien." },
  { type: "encouragement", emoji: "📌", text: "Chaque point noté est une trace utile pour mieux avancer." },
  { type: "encouragement", emoji: "🚀", text: "Tu construis une base solide en revenant jour après jour." },
  { type: "encouragement", emoji: "💭", text: "L'auto-observation, c'est un espace pour écouter tes pensées." },
  { type: "encouragement", emoji: "🧘", text: "Ce petit rituel quotidien nourrit ton équilibre intérieur." },
  { type: "encouragement", emoji: "🎉", text: "Bravo pour ton engagement : chaque suivi est une victoire." },
  { type: "encouragement", emoji: "📖", text: "Ton suivi est ton histoire, jour après jour." },
  { type: "encouragement", emoji: "💬", text: "Noter tes ressentis, c'est apprendre à mieux dialoguer avec toi-même." },
  { type: "encouragement", emoji: "🌈", text: "Faire ton suivi, c'est un geste simple mais puissant." },
  { type: "encouragement", emoji: "🕊️", text: "Observer régulièrement, c'est semer des graines de sérénité." },
];

// Conseils & repères santé mentale messages
const HEALTH_TIP_MESSAGES: MotivationalMessage[] = [
  {
    type: "health_tip",
    emoji: "🚶",
    text: "Marcher 30 minutes par jour aide à réduire le stress et améliore l'humeur.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    type: "health_tip",
    emoji: "😴",
    text: "Avoir un rythme de sommeil régulier favorise un meilleur équilibre psychique.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🧘",
    text: "La méditation de pleine conscience peut réduire de 20 à 30 % les symptômes d'anxiété.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr/actualite/la-pleine-conscience-un-outil-pour-mieux-gerer-son-anxiete",
  },
  {
    type: "health_tip",
    emoji: "📓",
    text: "Noter ses ressentis contribue à mieux réguler ses émotions.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    type: "health_tip",
    emoji: "🎶",
    text: "Écouter de la musique qui te plaît peut améliorer ton humeur rapidement.",
    source: "Harvard Health",
    sourceUrl: "https://www.health.harvard.edu",
  },
  {
    type: "health_tip",
    emoji: "🌿",
    text: "Passer du temps dans la nature aide à diminuer l'anxiété et à se ressourcer.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "👥",
    text: "Entretenir des liens sociaux réguliers protège la santé mentale.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    type: "health_tip",
    emoji: "💧",
    text: "Boire suffisamment d'eau contribue à la concentration et à l'énergie mentale.",
    source: "EFSA",
    sourceUrl: "https://www.efsa.europa.eu",
  },
  {
    type: "health_tip",
    emoji: "📱",
    text: "Limiter son temps d'écran le soir améliore la qualité du sommeil.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "🥦",
    text: "Une alimentation équilibrée joue un rôle dans la régulation de l'humeur.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🛑",
    text: "Faire une pause régulière au travail améliore l'attention et réduit le stress.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "🌞",
    text: "S'exposer à la lumière naturelle en journée soutient ton horloge biologique.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "✍️",
    text: "Tenir un journal de gratitude favorise un état d'esprit positif.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    type: "health_tip",
    emoji: "🛌",
    text: "Une courte sieste (20 minutes max) peut améliorer l'énergie et l'humeur.",
    source: "INSERM",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🧃",
    text: "Prendre un petit-déjeuner équilibré contribue à une meilleure stabilité émotionnelle.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "📚",
    text: "Lire quelques pages d'un livre peut favoriser la détente avant de dormir.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
  },
  {
    type: "health_tip",
    emoji: "🎨",
    text: "S'accorder un temps créatif (dessin, musique, écriture) aide à exprimer ses émotions.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    type: "health_tip",
    emoji: "🧘",
    text: "Pratiquer la respiration profonde aide à calmer le corps et l'esprit.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🥗",
    text: "Consommer des fruits et légumes variés soutient le bien-être global.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    type: "health_tip",
    emoji: "🏃",
    text: "Faire du sport régulièrement diminue le risque de dépression.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🎧",
    text: "Écouter un podcast ou une histoire apaisante peut aider à se relaxer.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
  },
  {
    type: "health_tip",
    emoji: "🕑",
    text: "Garder des horaires réguliers dans sa journée soutient la stabilité mentale.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "☕",
    text: "Limiter la caféine en fin de journée améliore le sommeil.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🛋️",
    text: "Aménager un espace calme pour se détendre aide à réduire le stress.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    type: "health_tip",
    emoji: "🎯",
    text: "Se fixer de petits objectifs atteignables nourrit la motivation.",
    source: "OMS",
    sourceUrl: "https://www.who.int/fr",
  },
  {
    type: "health_tip",
    emoji: "🧂",
    text: "Réduire le sel dans son alimentation participe à une meilleure santé globale.",
    source: "Santé publique France",
    sourceUrl: "https://www.santepubliquefrance.fr",
  },
  {
    type: "health_tip",
    emoji: "📞",
    text: "Parler de ses émotions avec un proche favorise le soutien social.",
    source: "Psycom",
    sourceUrl: "https://www.psycom.org/",
  },
  {
    type: "health_tip",
    emoji: "🕺",
    text: "Danser sur une musique entraînante stimule l'énergie et la bonne humeur.",
    source: "Harvard Health",
    sourceUrl: "https://www.health.harvard.edu",
  },
  {
    type: "health_tip",
    emoji: "🌸",
    text: "Prendre le temps de respirer profondément dans la journée réduit la tension corporelle.",
    source: "Inserm",
    sourceUrl: "https://www.inserm.fr",
  },
  {
    type: "health_tip",
    emoji: "🛀",
    text: "Prendre une douche chaude avant de dormir favorise la détente.",
    source: "NHS UK",
    sourceUrl: "https://www.nhs.uk",
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

    let currentIndex = storedIndex ? parseInt(storedIndex, 10) : 0;
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
      messageOrder = JSON.parse(storedOrder);
    }

    // Get the message at the current position in the shuffled order
    const messageIndex = messageOrder[currentIndex];
    const message = ALL_MESSAGES[messageIndex];

    // Increment index for next time
    const nextIndex = currentIndex + 1;
    await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX, nextIndex.toString());

    return message;
  } catch (error) {
    console.warn("Error getting motivational message:", error);
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

  // Load sequential motivational message
  useEffect(() => {
    const loadMessage = async () => {
      const message = await getNextMotivationalMessage();
      setCurrentMessage(message);
    };
    loadMessage();
  }, []);

  // Animation values
  const panelTranslateY = useSharedValue(300); // Start below screen
  const buttonOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(1); // Start visible, fade out when panel opens

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

  const handleFinish = () => {
    // Call the callback if provided
    if (route?.params?.onComplete) {
      route.params.onComplete();
    }
  };

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
          <Text className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 text-center")}>
            L'observation du jour est terminée
          </Text>
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
            <Text
              className="text-3xl"
              onPress={async () => {
                const message = await getNextMotivationalMessage();
                setCurrentMessage(message);
              }}
            >
              {currentMessage.emoji}
            </Text>
          </View>
          {/* Encouragement */}
          {currentMessage.type === "encouragement" && (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              {/* Applause Hands Icon positioned at the top like in mockup */}
              {/* Content centered in the panel */}
              <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
                <Text className={mergeClassNames("text-2xl font-normal font-body text-cnam-primary-900 text-center")}>{currentMessage.text}</Text>
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
                      <Text className="text-lg">💡</Text>
                      <Text className="text-sm font-semibold text-white">Le saviez-vous ?</Text>
                    </View>
                  </View>

                  {/* Health tip text */}
                  <Text className={mergeClassNames("text-2xl text-body font-semibold text-cnam-primary-900 mb-3")}>{currentMessage.text}</Text>

                  {/* Source */}
                  {currentMessage.source && <Text className={mergeClassNames("text-sm text-gray-800 italic")}>Source : {currentMessage.source}</Text>}
                </View>

                {/* Feedback section for health tips */}
                <View className="mt-5 items-center flex flex-row gap-4 w-full pl-2">
                  <Text className={mergeClassNames("text-base text-gray-700")}>Cette info est-elle utile ?</Text>
                  <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    {/* Thumbs up */}
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 22,
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "#799092",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      <ThumbsUpIcon color="#799092" width={20} height={20} />
                    </View>

                    {/* Thumbs down */}
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 22,
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "#799092",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ThumbsDownIcon color="#799092" width={20} height={20} />
                    </View>
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
