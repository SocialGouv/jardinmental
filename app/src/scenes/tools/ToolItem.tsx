import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ToolItemEntity, ToolItemType } from "./toolsData";
import BookOpenIcon from "../../../assets/svg/icon/BookOpen";
import PlayCircleIcon from "../../../assets/svg/icon/PlayCircle";
import HeadphonesIcon from "../../../assets/svg/icon/Headphones";
import InstagramIcon from "../../../assets/svg/icon/Instagram";
import MapIcon from "@assets/svg/icon/Map";
import SurveyIcon from "@assets/svg/icon/Survey";
import AppMobileIcon from "@assets/svg/icon/AppMobile";
import PuzzlePieceIcon from "@assets/svg/icon/PuzzlePiece";
import ChatbotIcon from "@assets/svg/icon/Chatbot";
import QuizzIcon from "@assets/svg/icon/Quizz";
import File from "@assets/svg/icon/File";

import FilmIcon from "../../../assets/svg/icon/Film";
import LinkIcon from "../../../assets/svg/icon/Link";
import BriefcaseIcon from "../../../assets/svg/icon/Briefcase";
import localStorage from "@/utils/localStorage";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import WaveIcon from "@assets/svg/icon/Wave";
import PencilIcon from "@assets/svg/icon/Pencil";
import FormationIcon from "@assets/svg/icon/Formation";
import BookmarkIcon from "@assets/svg/icon/Bookmark";
import BookmarkAdded from "@assets/svg/icon/BookmarkAdd";
import BookmarkMinus from "@assets/svg/icon/BookmarkMinus";
import Bookmark from "@assets/svg/icon/Bookmark";

interface ToolItemCardProps {
  toolItem: ToolItemEntity;
  onPress: (resource: ToolItemEntity) => void;
}

// function textByType(type: ToolItemType) {
//   switch (type) {
//     case "Article":
//       return "Lire l'article";
//     case "Vidéo":
//       return "Regarder la vidéo";
//     case "Podcast":
//       return "Écouter le podcast";
//     case "Guide":
//       return "Découvrir le guide";
//     case "Instagram":
//       return "Voir sur Instagram";
//     case "Site":
//       return "Visiter le site";
//     case "Fiche pratique":
//       return "Voir la fiche pratique";
//     case "Série":
//       return "Voir le documentaire";
//     case "BD":
//       return "Découvrir la BD";
//     case "Livre":
//       return "Découvrir le livre";
//     case "Questionnaire":
//       return "Voir le questionnaire";
//     case "Outils":
//       return "Découvrir";
//   }
// }

function ToolItemIcon({ type }: { type: ToolItemType | ToolItemType[] }) {
  // If type is an array, use the first type for the icon
  const displayType = Array.isArray(type) ? type[0] : type;

  switch (displayType) {
    case "Article":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Vidéo":
      return <PlayCircleIcon color="#3D6874" width={20} height={20} />;
    case "Podcast":
      return <HeadphonesIcon color="#3D6874" width={20} height={20} />;
    case "Guide":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Instagram":
      return <InstagramIcon color="#3D6874" width={20} height={20} />;
    case "Site":
      return <LinkIcon strokeColor="#3D6874" size={20} />;
    case "Fiche pratique":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Série":
      return <FilmIcon color="#3D6874" width={20} height={20} />;
    case "BD":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Livre":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Outils":
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
    case "App":
      return <AppMobileIcon color="#3D6874" width={20} height={20} />;
    case "Questionnaire":
      return <SurveyIcon color="#3D6874" width={20} height={20} />;
    case "Chatbot":
      return <ChatbotIcon color="#3D6874" width={20} height={20} />;
    case "PDF":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Carte":
      return <MapIcon color="#3D6874" width={20} height={20} />;
    case "Fichier":
      return <File color="#3D6874" width={20} height={20} />;
    case "Jeu":
      return <PuzzlePieceIcon color="#3D6874" width={20} height={20} />;
    case "Audio":
      return <HeadphonesIcon color="#3D6874" width={20} height={20} />;
    case "Carte":
      return <LinkIcon strokeColor="#3D6874" size={20} />;
    case "Formation":
      return <FormationIcon color="#3D6874" width={20} height={20} />;
    case "Exercice":
      return <PencilIcon color="#3D6874" width={20} height={20} />;
    case "Observation":
      return <WaveIcon color="#3D6874" width={20} height={20} />;
    case "Quizz":
      return <QuizzIcon color="#3D6874" width={20} height={20} />;
    default:
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
  }
}

const ToolItemCard: React.FC<ToolItemCardProps> = ({ toolItem, onPress }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const itemId = toolItem.id;

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await localStorage.getBookmarkedToolItems();
        setIsBookmarked(ids.includes(itemId));
      } catch (error) {
        console.error("Failed to load viewed resources:", error);
      }
    };
    load();
  }, [itemId]);

  const handlePress = async () => {
    onPress(toolItem);
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handlePress} key={itemId}>
      <View className={`rounded-2xl flex flex-row  min-h-[112px] ${"border-2 border-cnam-primary-400 bg-white"}`}>
        <View className={`${"bg-cnam-cyan-lighten-90"} rounded-l-2xl flex items-center justify-center w-20`}>
          <ToolItemIcon type={toolItem.type} />
          <Text className="text-xs text-cnam-primary-900 font-medium pt-1 rounded text-center">
            {Array.isArray(toolItem.type) ? (
              toolItem.type[0] === "Questionnaire" ? (
                <>Question&shy;naire</>
              ) : (
                toolItem.type[0]
              )
            ) : toolItem.type === "Questionnaire" ? (
              <>Question&shy;naire</>
            ) : (
              toolItem.type
            )}
          </Text>
        </View>
        <View className="flex-1 flex">
          <View className="px-4 grow pt-4">
            <View className="flex flex-row items-start space-x-2">
              <Text className="flex-1 text-base font-semibold text-cnam-primary-950">{toolItem.title}</Text>
              {isBookmarked && <BookmarkMinus width={20} height={20} />}
              {!isBookmarked && <Bookmark width={20} height={20} />}
            </View>
          </View>
          <View className="px-4 grow pb-4 mt-2">
            <View className="flex flex-row items-start">
              <Text className={mergeClassNames(typography.textSmMedium, "flex-1 text-gray-800")} numberOfLines={2}>
                {toolItem.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ToolItemCard;
