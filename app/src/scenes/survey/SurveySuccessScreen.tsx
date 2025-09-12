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

// Storage keys for motivational messages
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX = "@MOTIVATIONAL_MESSAGE_INDEX";
const STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER = "@MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER";

// Motivational messages list
const MOTIVATIONAL_MESSAGES = [
  { emoji: "👏", text: "Prendre le temps de remplir ton suivi, c'est déjà prendre soin de toi." },
  { emoji: "🧩", text: "Chaque saisie est une petite pièce du puzzle de ta santé mentale." },
  { emoji: "🌱", text: "Revenir régulièrement, c'est construire pas à pas une meilleure connaissance de toi-même." },
  { emoji: "✨", text: "L'auto-observation permet de mettre en lumière ce qui reste invisible au quotidien." },
  { emoji: "📈", text: "Observer tes indicateurs, c'est comprendre ce qui influence ton équilibre." },
  { emoji: "💡", text: "En notant tes ressentis, tu crées un journal de ton bien-être." },
  { emoji: "🙌", text: "Faire le point sur ta journée, c'est déjà un acte positif envers toi-même." },
  { emoji: "🕰️", text: "Deux minutes pour remplir ton suivi = un temps précieux que tu t'accordes." },
  { emoji: "🌙", text: "Même une petite observation aujourd'hui peut t'apporter des clés demain." },
  { emoji: "💪", text: "Tu fais de ton bien-être une priorité, un pas après l'autre." },
  { emoji: "🔍", text: "Chaque saisie est une observation qui compte." },
  { emoji: "🎯", text: "Ton engagement à noter régulièrement renforce ton parcours personnel." },
  { emoji: "🗝️", text: "L'auto-observation est une clé pour mieux comprendre ce qui agit sur toi." },
  { emoji: "📊", text: "Chaque indicateur noté enrichit ta compréhension de toi-même." },
  { emoji: "🤝", text: "Remplir ton suivi, c'est engager un dialogue bienveillant avec toi-même." },
  { emoji: "🌞", text: "Observer aujourd'hui, c'est préparer un demain plus serein." },
  { emoji: "🌍", text: "Tu contribues à ton équilibre rien qu'en prenant ce moment." },
  { emoji: "📝", text: "Noter tes ressentis, c'est prendre un temps pour les reconnaître." },
  { emoji: "🔄", text: "La régularité fait toute la différence dans l'auto-observation." },
  { emoji: "🌟", text: "Faire ton suivi, c'est déjà progresser." },
  { emoji: "⚖️", text: "Connaître tes variations, c'est apprendre à équilibrer ton quotidien." },
  { emoji: "📌", text: "Chaque point noté est une trace utile pour mieux avancer." },
  { emoji: "🚀", text: "Tu construis une base solide en revenant jour après jour." },
  { emoji: "💭", text: "L'auto-observation, c'est un espace pour écouter tes pensées." },
  { emoji: "🧘", text: "Ce petit rituel quotidien nourrit ton équilibre intérieur." },
  { emoji: "🎉", text: "Bravo pour ton engagement : chaque suivi est une victoire." },
  { emoji: "📖", text: "Ton suivi est ton histoire, jour après jour." },
  { emoji: "💬", text: "Noter tes ressentis, c'est apprendre à mieux dialoguer avec toi-même." },
  { emoji: "🌈", text: "Faire ton suivi, c'est un geste simple mais puissant." },
  { emoji: "🕊️", text: "Observer régulièrement, c'est semer des graines de sérénité." },
];

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
    if (!storedOrder || currentIndex >= MOTIVATIONAL_MESSAGES.length || currentIndex < 0) {
      // Create shuffled indices
      const indices = Array.from({ length: MOTIVATIONAL_MESSAGES.length }, (_, i) => i);
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
    const message = MOTIVATIONAL_MESSAGES[messageIndex];

    // Increment index for next time
    const nextIndex = currentIndex + 1;
    await AsyncStorage.setItem(STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX, nextIndex.toString());

    return message;
  } catch (error) {
    console.warn("Error getting motivational message:", error);
    // Fallback to first message
    return MOTIVATIONAL_MESSAGES[0];
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
  const [currentMessage, setCurrentMessage] = useState(MOTIVATIONAL_MESSAGES[0]); // Default fallback

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

  useEffect(() => {
    // Show panel after 1.5 seconds
    const timer = setTimeout(() => {
      setShowPanel(true);
      // Animate panel sliding up
      panelTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      // Show button with delay and opacity animation
      buttonOpacity.value = withDelay(
        200,
        withTiming(1, {
          duration: 300,
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

  return (
    <View style={{ flex: 1 }}>
      {/* White Background First Screen */}
      <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ marginBottom: 32 }}>
            <CircleCheckMark color={"#0084B2"} width={40} height={41} />
          </View>
          <Text className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 text-center")}>
            L'observation du jour est terminée
          </Text>
        </View>
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
              height: "60%", // Take 60% of screen height
              backgroundColor: TW_COLORS.CNAM_CYAN_50_LIGHTEN_90,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 40,
              justifyContent: "space-between",
            },
            panelAnimatedStyle,
          ]}
        >
          <View className="absolute top-[-38px] flex items-center justify-center w-full">
            <View className="ml-14 rounded-full w-16 h-16 bg-cnam-cyan-500-0 p-2"></View>
          </View>
          <View className="absolute top-[-30px] self-center rounded-full w-16 h-16 border border-white bg-cnam-cyan-lighten-80 p-2 flex items-center justify-center">
            <Text className="text-3xl">{currentMessage.emoji}</Text>
          </View>
          {/* Top Content Area */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* Applause Hands Icon positioned at the top like in mockup */}

            {/* Content centered in the panel */}
            <View style={{ alignItems: "center" }}>
              {/* Bravo Title */}
              <Text className={mergeClassNames("text-lg font-bold text-cnam-primary-900 text-center mb-6")}>Bravo !</Text>

              {/* Sequential Motivational Text */}
              <Text className={mergeClassNames("text-lg font-normal text-cnam-primary-900 text-center leading-6")}>{currentMessage.text}</Text>
            </View>
          </View>

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
