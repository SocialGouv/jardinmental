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
import { TOOL_BECK_ID, ToolItemEntity } from "./toolsData";
import ReactNativeBlobUtil from "react-native-blob-util";
import DownloadIcon from "@assets/svg/icon/Download";
import LinkIcon from "@assets/svg/icon/Link";
import LinkExternal from "@assets/svg/icon/LinkExternal";
import BookmarkAddIcon from "@assets/svg/icon/BookmarkAdd";
import BookmarkMinusIcon from "@assets/svg/icon/BookmarkMinus";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import logEvents from "@/services/logEvents";
import * as WebBrowser from "expo-web-browser";
import { useInAppBrowserConfig } from "@/hooks/useInAppBrowserConfig";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import EyeIcon from "@assets/svg/icon/Eye";
import * as Sharing from "expo-sharing";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const ToolBottomSheet = ({
  onClose,
  toolItem,
  navigation,
  onBookmarkChange,
}: {
  onClose: (treatment?: Drug[]) => void;
  toolItem: ToolItemEntity;
  navigation;
  onBookmarkChange;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const { closeBottomSheet } = useBottomSheet();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showAllThemes, setShowAllThemes] = useState<boolean>(false);
  const { useInAppBrowser } = useInAppBrowserConfig();

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

  const [renderedThemes, setRenderedThemes] = useState([]);
  const [maxWidth, setMaxWidth] = useState(0);
  useEffect(() => {
    if (!maxWidth) return;

    let currentWidth = 0;
    let lineCount = 1;
    const maxLines = 2;
    const spacing = 8; // ton `mr-2`

    const allowed = [];

    toolItem.themes.forEach((theme, index) => {
      // Estimation de la largeur du chip
      const chipWidth = theme.length * 7 + 30; // (texte approx + padding)
      if (currentWidth + chipWidth > maxWidth) {
        // nouvelle ligne
        lineCount++;
        if (lineCount === 2) {
          currentWidth = toolItem.themes.length - index - 1 <= 1 ? 0 : 100;
        }
      }

      if (lineCount > maxLines) return;
      allowed.push(theme);
      currentWidth += chipWidth + spacing;
    });
    setRenderedThemes(allowed);
  }, [maxWidth, toolItem.themes]);

  // Helper function to check if the tool type is a file/downloadable type
  const isFileType = () => {
    const types = Array.isArray(toolItem.type) ? toolItem.type : [toolItem.type];
    return types.some((t) => t === "Fichier");
  };

  const handleViewPDF = async () => {
    if (!toolItem.url) {
      Alert.alert("Erreur", "Aucun fichier à visualiser");
      return;
    }

    try {
      setIsViewing(true);
      await WebBrowser.openBrowserAsync(toolItem.url, {
        toolbarColor: "#3D6874",
        controlsColor: "#FFFFFF",
        enableBarCollapsing: false,
        showTitle: true,
        dismissButtonStyle: "done",
      });
    } catch (error) {
      console.error("Error viewing PDF:", error);
      Alert.alert("Erreur", "Impossible de visualiser le fichier");
    } finally {
      setIsViewing(false);
    }
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

      const { dirs } = ReactNativeBlobUtil.fs;

      if (Platform.OS === "android") {
        // 1. Download into sandbox
        const tempUri = FileSystem.cacheDirectory + fileName;

        const { uri: downloadedUri } = await FileSystem.downloadAsync(toolItem.url, tempUri);

        // 2. Ask user for a destination folder (SAF)
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!permissions.granted) {
          Alert.alert("Permission refusée");
          return;
        }

        // 3. Create an empty file in the chosen folder
        const destUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, "application/pdf");

        // 4. Read sandbox file in base64
        const base64Data = await FileSystem.readAsStringAsync(downloadedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 5. Write inside the chosen folder
        await FileSystem.writeAsStringAsync(destUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert("Succès", "Le fichier a été enregistré sur votre appareil.");
      } else {
        // iOS: Download to DocumentDir then use previewDocument to let user save where they want
        const filePath = `${dirs.DocumentDir}/${fileName}`;
        const response = await ReactNativeBlobUtil.config({
          path: filePath,
          fileCache: true,
        }).fetch("GET", toolItem.url);

        await ReactNativeBlobUtil.ios.previewDocument(response.path());
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
      if (useInAppBrowser) {
        // Open in in-app browser using expo-web-browser
        await WebBrowser.openBrowserAsync(toolItem.url, {
          toolbarColor: "#3D6874", // Color matching the app theme (CNAM cyan)
          controlsColor: "#FFFFFF",
          enableBarCollapsing: true,
          showTitle: true,
          dismissButtonStyle: "done", // iOS: Show "Done" button instead of checkmark
        });
      } else {
        // Open in external system browser (default behavior)
        const canOpen = await Linking.canOpenURL(toolItem.url);
        if (canOpen) {
          await Linking.openURL(toolItem.url);
        } else {
          Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
        }
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir le lien");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          bounces={false}
          // contentContainerStyle={{ paddingBottom: 0 }}
          contentContainerStyle={{ paddingBottom: 0, minHeight: "100%" }}
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: 20,
            height: height90vh,
          }}
          // style={{ paddingTop: 20 }}
        >
          <View className="self-end mr-4">
            {!isBookmarked ? (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const itemId = toolItem.id;
                    const updated = await localStorage.bookmarkToolItem(itemId);
                    setIsBookmarked(updated.includes(itemId));
                    onBookmarkChange?.();
                    // Log bookmark event
                    logEvents.logOutilsBookmark();
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
                    onBookmarkChange?.();
                    // Log bookmark event (also logged when removing)
                    logEvents.logOutilsBookmark();
                  } catch (error) {
                    console.error("Failed to mark resource as viewed:", error);
                  }
                }}
                className="flex-row items-center justify-between mb-4 space-x-1"
              >
                <BookmarkMinusIcon width={20} height={20} />
                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Retirer de mes favoris</Text>
              </TouchableOpacity>
            )}
          </View>
          <View onLayout={(e) => setMaxWidth(e.nativeEvent.layout.width)} className="flex-row self-start flex-wrap items-center p-2 space-x-0">
            {/* {toolItem.themes.slice(0, showAllThemes ? toolItem.themes.length : VISIBLE_THEMES_LIMIT).map((theme, index) => (
              <Text
                key={index}
                className={mergeClassNames(
                  typography.textSmSemibold,
                  "text-cnam-cyan-700-darken-40 text-left bg-[#E5F6FC] py-1 px-2 leading-[20px] mr-2"
                )}
              >
                {theme}
              </Text>
            ))} */}
            {!!showAllThemes &&
              toolItem.themes.map((theme, index) => (
                <Text
                  key={index}
                  className={mergeClassNames(
                    typography.textSmSemibold,
                    "text-cnam-cyan-700-darken-40 bg-[#E5F6FC] py-1 px-2 leading-[20px] mr-2 mb-2"
                  )}
                >
                  {theme}
                </Text>
              ))}
            {!showAllThemes &&
              renderedThemes.map((theme, index) => (
                <Text
                  key={index}
                  className={mergeClassNames(
                    typography.textSmSemibold,
                    "text-cnam-cyan-700-darken-40 bg-[#E5F6FC] py-1 px-2 leading-[20px] mr-2 mb-2"
                  )}
                >
                  {theme}
                </Text>
              ))}
            {toolItem.themes.length > renderedThemes.length && !showAllThemes && (
              <TouchableOpacity
                onPress={() => setShowAllThemes(!showAllThemes)}
                className="flex-row items-center bg-[#E5F6FC] py-1 px-2 space-x-1 mb-2 "
              >
                {!showAllThemes && (
                  <>
                    <SimplePlus color="#3D6874" width={16} height={16} />
                    <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-cyan-700-darken-40 leading-[20px]")}>
                      {toolItem.themes.length - renderedThemes.length}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
          <View className="p-4 flex-column">
            <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900")}>{toolItem.title}</Text>
          </View>
          <View className="p-4 flex-column flex-1">
            <Text className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-900")}>{toolItem.description}</Text>
          </View>
          <View className="w-full py-6 px-6">
            {/* {toolItem.embed === "breath-exercice" && (
              <JMButton
                className="mb-2"
                icon={<DownloadIcon color="white"></DownloadIcon>}
                onPress={() => {
                  navigation.navigate(toolItem.embed);
                  closeBottomSheet();
                }}
                title={"Faire l'exercice de respiration"}
              />
            )} */}
            {toolItem.video === "coherence-cardiaque-video" && (
              <JMButton
                icon={<DownloadIcon color="white"></DownloadIcon>}
                onPress={() => {
                  navigation.navigate(toolItem.video);
                  closeBottomSheet();
                }}
                title={"Faire l'exercice de respiration en video"}
              />
            )}
            {isFileType() && !toolItem.embed && !toolItem.video && (
              <>
                <JMButton
                  className="mb-2"
                  icon={<EyeIcon color="white" width={20} height={20} />}
                  onPress={handleViewPDF}
                  title={isViewing ? "Chargement..." : "Voir le fichier"}
                  disabled={isViewing || isDownloading}
                />
                <JMButton
                  icon={<DownloadIcon color="white" />}
                  onPress={handleDownloadFile}
                  title={isDownloading ? "Téléchargement..." : "Télécharger le fichier"}
                  disabled={isDownloading || isViewing}
                />
              </>
            )}
            {!isFileType() && !toolItem.embed && !toolItem.video && toolItem.id !== TOOL_BECK_ID && (
              <JMButton icon={<LinkExternal color="white" />} onPress={handleOpenUrl} title={"Voir l'outil"} />
            )}
            {toolItem.id === TOOL_BECK_ID && (
              <JMButton
                onPress={() => {
                  closeBottomSheet();
                  navigation.navigate("beck-home");
                }}
                title={"Accéder à Beck"}
              />
            )}
          </View>
          {toolItem.source && (
            <View className="w-full bg-gray-100 p-6 pb-20">
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
