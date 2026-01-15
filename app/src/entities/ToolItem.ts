// Tool item types
export type ToolItemType =
  | "Article"
  | "Vidéo"
  | "Podcast"
  | "Guide"
  | "Instagram"
  | "Site"
  | "Fiche pratique"
  | "Série"
  | "BD"
  | "Livre"
  | "Questionnaire"
  | "Outils"
  | "App"
  | "Chatbot"
  | "Fichier"
  | "Jeu"
  | "Audio"
  | "Carte"
  | "Formation"
  | "Exercice"
  | "Observation"
  | "Quizz";

// Tool item audience types
export type ToolItemAudience = "child" | "student" | "parent";

// Tool item themes
export const ToolItemThemes = [
  "Gérer le stress",
  "Gérer une crise",
  "Sommeil",
  "Émotions & pensées",
  "Bien-être & vie quotidienne",
  "Addictions",
  "Obtenir de l'aide",
] as const;

export type ToolItemTheme = (typeof ToolItemThemes)[number];

export type ToolThemeFilter = "Tout" | "Favoris" | ToolItemTheme;

// Tool item entity interface
export interface ToolItemEntity {
  id: string;
  title: string;
  description: string;
  type: ToolItemType[];
  themes: ToolItemTheme[];
  matomoId: number;
  audience: ToolItemAudience[];
  url?: string;
  source?: string;
  embed?: string;
  video?: string;
  innerPath?: {
    text: string;
    path: string;
  };
}
