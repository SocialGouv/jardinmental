import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity } from "react-native";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { useEffect, useState } from "react";
import Drugs from "@/scenes/drugs/drugs-list";
import { useBottomSheet } from "@/context/BottomSheetContext";
import localStorage from "@/utils/localStorage";
import { HELP_POSOLOGY } from "@/scenes/onboarding-v2/data/helperData";
import { Drug } from "@/entities/Drug";
import HelpView from "@/components/HelpView";
import JMButton from "@/components/JMButton";
import HealthIcon from "@assets/svg/icon/Health";
import { InputText } from "@/components/InputText";
import { ToolItemEntity } from "./toolsData";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import DownloadIcon from "@assets/svg/icon/Download";
import LinkIcon from "@assets/svg/icon/Link";
import LinkExternal from "@assets/svg/icon/LinkExternal";
import BookmarkAddIcon from "@assets/svg/icon/BookmarkAdd";
import BookmarkMinusIcon from "@assets/svg/icon/BookmarkMinus";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import SimpleMinus from "@assets/svg/icon/SimpleMinus";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const VISIBLE_THEMES_LIMIT = 3;

export const ToolBottomSheet = ({ onClose, toolItem }: { onClose: (treatment?: Drug[]) => void; toolItem: ToolItemEntity }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showAllThemes, setShowAllThemes] = useState<boolean>(false);

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

  // Helper function to check if the tool type is a file/downloadable type
  const isFileType = () => {
    const types = Array.isArray(toolItem.type) ? toolItem.type : [toolItem.type];
    return types.some((t) => t === "Fichier" || t === "PDF" || t === "Document");
  };

  const handleDownloadFile = async () => {
    if (!toolItem.url) {
      Alert.alert("Erreur", "Aucun fichier à télécharger");
      return;
    }

    try {
      setIsDownloading(true);

      // Extract filename from URL or use a default name
      const urlParts = toolItem.url.split("/");
      const fileName = urlParts[urlParts.length - 1] || `${toolItem.title}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(toolItem.url, fileUri);

      const result = await downloadResumable.downloadAsync();

      if (result) {
        // Check if sharing is available
        const isSharingAvailable = await Sharing.isAvailableAsync();

        if (isSharingAvailable) {
          // Share/open the file
          await Sharing.shareAsync(result.uri);
          Alert.alert("Succès", "Fichier téléchargé avec succès");
        } else {
          Alert.alert("Succès", "Fichier téléchargé");
        }
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Erreur", "Impossible de télécharger le fichier");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenUrl = async () => {
    if (!toolItem.url) {
      Alert.alert("Erreur", "Aucune URL disponible");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(toolItem.url);
      if (canOpen) {
        await Linking.openURL(toolItem.url);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir le lien");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false} style={{ paddingTop: 20 }}>
          <View className="self-end mr-4">
            {!isBookmarked ? (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const itemId = toolItem.id;
                    const updated = await localStorage.bookmarkToolItem(itemId);
                    setIsBookmarked(updated.includes(itemId));
                  } catch (error) {
                    console.error("Failed to mark resource as viewed:", error);
                  }
                }}
                className="flex-row items-center justify-between mb-4 space-x-1"
              >
                <BookmarkAddIcon width={20} height={20} />

                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Ajouter à mes favoris</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const itemId = toolItem.id;
                    const updated = await localStorage.removeBookmarkToolItem(itemId);
                    setIsBookmarked(updated.includes(itemId));
                  } catch (error) {
                    console.error("Failed to mark resource as viewed:", error);
                  }
                }}
                className="flex-row items-center justify-between mb-4 space-x-1"
              >
                <BookmarkMinusIcon width={20} height={20} />
                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Retirer des mes favoris</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row self-start flex-wrap items-center p-2 space-x-1 space-y-1">
            {toolItem.themes.slice(0, showAllThemes ? toolItem.themes.length : VISIBLE_THEMES_LIMIT).map((theme, index) => (
              <Text
                key={index}
                className={mergeClassNames(typography.textSmSemibold, "ml-1 text-cnam-cyan-700-darken-40 text-left bg-[#E5F6FC] py-1 px-2")}
              >
                {theme}
              </Text>
            ))}
            {toolItem.themes.length > VISIBLE_THEMES_LIMIT && !showAllThemes && (
              <TouchableOpacity
                onPress={() => setShowAllThemes(!showAllThemes)}
                className="flex-row items-center ml-1 bg-[#E5F6FC] py-1 px-2 space-x-1"
              >
                {!showAllThemes && (
                  <>
                    <SimplePlus color="#3D6874" width={16} height={16} />
                    <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-cyan-700-darken-40")}>
                      {toolItem.themes.length - VISIBLE_THEMES_LIMIT}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
          <View className="p-4 flex-column flex-1">
            <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900")}>{toolItem.title}</Text>
          </View>
          <View className="p-4 flex-column flex-1">
            <Text className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-900")}>{toolItem.description}</Text>
          </View>
          <View className="w-full py-6 px-6">
            {isFileType() && (
              <JMButton
                icon={<DownloadIcon color="white"></DownloadIcon>}
                onPress={handleDownloadFile}
                title={isDownloading ? "Téléchargement..." : "Télécharger le fichier"}
                disabled={isDownloading}
              />
            )}
            {!isFileType() && <JMButton icon={<LinkExternal color="white" />} onPress={handleOpenUrl} title={"Voir l'outil"} />}
          </View>
          {toolItem.source && (
            <View className="w-full bg-gray-100 p-6">
              <Text className={mergeClassNames(typography.textSmRegular, "text-gray-800")}>Fourni par : {toolItem.source}</Text>
            </View>
          )}
        </ScrollView>
        {/* <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          className={`flex-column justify-between items-center bg-white/90  w-full`}
        >
          <View className="w-full py-6 px-6">
            {isFileType() && (
              <JMButton
                icon={<DownloadIcon color="white"></DownloadIcon>}
                onPress={handleDownloadFile}
                title={isDownloading ? "Téléchargement..." : "Télécharger le fichier"}
                disabled={isDownloading}
              />
            )}
            {!isFileType() && <JMButton icon={<LinkExternal color="white" />} onPress={handleOpenUrl} title={"Voir l'outil"} />}
          </View>
          {toolItem.source && (
            <View className="w-full bg-gray-100 p-6">
              <Text>Fourni par : {toolItem.source}</Text>
            </View>
          )}
        </View> */}
      </View>
    </View>
  );
};
