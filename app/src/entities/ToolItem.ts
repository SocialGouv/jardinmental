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
export type ToolItemAudience = "Pour tous" | "Jeunes" | "Parents";

// Tool item themes
export const ToolItemThemes = [
  "Améliorer son sommeil",
  "Apprendre à se connaître",
  "Reconnaître ses besoins",
  "Reconnaître ses émotions",
  "Trouver de l'aide",
  "Agir sur mes addictions",
  "Bienveillance envers soi-même",
  "Gérer les pensées difficiles",
  "Vie quotidienne",
  "Diminuer le stress",
  "Se relaxer",
  "Gérer une crise",
  "Réguler ses émotions",
  "Aider un proche",
  "Se former",
  "Respecter ses limites",
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
}
