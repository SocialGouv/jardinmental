import React from "react";
import { EMOTION_COLORS, iconColors } from "./constants";
import SmileyVeryGood from "@assets/svg/smileys/veryGood";
import SmileyBad from "@assets/svg/smileys/bad";
import SmileyVeryBad from "@assets/svg/smileys/veryBad";
import SmileyMiddle from "@assets/svg/smileys/middle";
import SmileyGood from "@assets/svg/smileys/good";

export interface MoodEmoji {
  backgroundColor: string;
  text: string;
  label: string;
  icon: React.ReactElement;
}

export const moodEmojis: MoodEmoji[] = [
  {
    backgroundColor: EMOTION_COLORS.veryBad,
    text: iconColors.veryBad,
    label: "Très mauvais",
    icon: <SmileyVeryBad width={25} height={25} />,
  },
  {
    backgroundColor: EMOTION_COLORS.bad,
    text: iconColors.bad,
    label: "Mauvais",
    icon: <SmileyBad width={25} height={25} />,
  },
  {
    backgroundColor: EMOTION_COLORS.middle,
    text: iconColors.middle,
    label: "Rien de spécial",
    icon: <SmileyMiddle width={25} height={25} />,
  },
  {
    backgroundColor: EMOTION_COLORS.good,
    text: iconColors.good,
    label: "Bon",
    icon: <SmileyGood width={25} height={25} />,
  },
  {
    backgroundColor: EMOTION_COLORS.veryGood,
    text: iconColors.veryGood,
    label: "Très bon",
    icon: <SmileyVeryGood width={25} height={25} />,
  },
];

export const moodBackgroundColors = [EMOTION_COLORS.veryBad, EMOTION_COLORS.bad, EMOTION_COLORS.middle, EMOTION_COLORS.good, EMOTION_COLORS.veryGood];
