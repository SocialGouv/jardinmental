import React from "react";

import AppMobileIcon from "@assets/svg/icon/AppMobile";
import BookOpenIcon from "@assets/svg/icon/BookOpen";
import BriefcaseIcon from "@assets/svg/icon/Briefcase";
import ChatbotIcon from "@assets/svg/icon/Chatbot";
import FormationIcon from "@assets/svg/icon/Formation";
import HeadphonesIcon from "@assets/svg/icon/Headphones";
import InstagramIcon from "@assets/svg/icon/Instagram";
import LinkIcon from "@assets/svg/icon/Link";
import MapIcon from "@assets/svg/icon/Map";
import PencilIcon from "@assets/svg/icon/Pencil";
import PlayCircleIcon from "@assets/svg/icon/PlayCircle";
import QuizzIcon from "@assets/svg/icon/Quizz";
import SurveyIcon from "@assets/svg/icon/Survey";
import WaveIcon from "@assets/svg/icon/Wave";

import PuzzlePieceIcon from "@assets/svg/icon/PuzzlePiece";
import File from "@assets/svg/icon/File";

import FilmIcon from "../../../assets/svg/icon/Film";
import { ToolItemType } from "./toolsData";

export function ToolItemIcon({
  type,
  color = "#3D6874",
  width = 20,
  height = 20,
}: {
  type: ToolItemType | ToolItemType[];
  color?: string;
  width?: number;
  height?: number;
}) {
  // If type is an array, use the first type for the icon
  const displayType = Array.isArray(type) ? type[0] : type;

  switch (displayType) {
    case "Article":
      return <BookOpenIcon color={color} width={width} height={height} />;
    case "Vidéo":
      return <PlayCircleIcon color={color} width={width} height={height} />;
    case "Podcast":
      return <HeadphonesIcon color={color} width={width} height={height} />;
    case "Guide":
      return <BookOpenIcon color={color} width={width} height={height} />;
    case "Instagram":
      return <InstagramIcon color={color} width={width} height={height} />;
    case "Site":
      return <LinkIcon strokeColor={color} size={width} />;
    case "Fiche pratique":
      return <BookOpenIcon color={color} width={width} height={height} />;
    case "Série":
      return <FilmIcon color={color} width={width} height={height} />;
    case "BD":
      return <BookOpenIcon color={color} width={width} height={height} />;
    case "Livre":
      return <BookOpenIcon color={color} width={width} height={height} />;
    case "Outils":
      return <BriefcaseIcon color={color} width={width} height={height} />;
    case "App":
      return <AppMobileIcon color={color} width={width} height={height} />;
    case "Questionnaire":
      return <SurveyIcon color={color} width={width} height={height} />;
    case "Chatbot":
      return <ChatbotIcon color={color} width={width} height={height} />;
    case "Carte":
      return <MapIcon color={color} width={width} height={height} />;
    case "Fichier":
      return <File color={color} width={width} height={height} />;
    case "Jeu":
      return <PuzzlePieceIcon color={color} width={width} height={height} />;
    case "Audio":
      return <HeadphonesIcon color={color} width={width} height={height} />;
    case "Formation":
      return <FormationIcon color={color} width={width} height={height} />;
    case "Exercice":
      return <PencilIcon color={color} width={width} height={height} />;
    case "Observation":
      return <WaveIcon color={color} width={width} height={height} />;
    case "Quizz":
      return <QuizzIcon color={color} width={width} height={height} />;
    default:
      return <BriefcaseIcon color={color} width={width} height={height} />;
  }
}
