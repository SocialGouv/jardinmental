import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import * as Contacts from "expo-contacts";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrisisHeader from "./CrisisHeader";
import { TW_COLORS } from "@/utils/constants";
import PencilIcon from "@assets/svg/icon/Pencil";
import CrisisNavigationButtons from "./CrisisNavigationButtons";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { CrisisBottomSheet } from "./CrisisBottomSheet";
import CrisisListBottomSheet from "./CrisisListBottomSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InputText } from "@/components/InputText";
import ImageIcon from "@assets/svg/icon/ImageIcon";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import { CrisisMediaBottomSheet } from "./CrisisMediaBottomSheet";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import CrisisProgressBar from "./CrisisProgressBar";
import { Typography } from "@/components/Typography";

// Handles fallback logic for displaying images
const ImageWithFallback = ({ localUri, originalUri, style }: { localUri: string; originalUri: string; style?: any }) => {
  const [uriToShow, setUriToShow] = React.useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const checkUris = async () => {
      // Check localUri first
      if (localUri) {
        try {
          const info = await FileSystem.getInfoAsync(localUri);
          if (info.exists && isMounted) {
            setUriToShow(localUri);
            setChecked(true);
            return;
          }
        } catch {}
      }
      // Fallback to originalUri
      if (originalUri) {
        try {
          const info = await FileSystem.getInfoAsync(originalUri);
          if (info.exists && isMounted) {
            setUriToShow(originalUri);
            setChecked(true);
            return;
          }
        } catch {}
      }
      // Neither exists
      if (isMounted) {
        setUriToShow(null);
        setChecked(true);
      }
    };
    checkUris();
    return () => {
      isMounted = false;
    };
  }, [localUri, originalUri]);

  if (!checked) {
    return (
      <View style={[style, { alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (uriToShow) {
    return <Image source={{ uri: uriToShow }} style={style} resizeMode="cover" />;
  }

  // Placeholder with message
  return (
    <View style={[style, { alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }]}>
      <ImageIcon />
      <Typography style={{ textAlign: "center", color: "#888", fontSize: 12, marginTop: 4 }}>la photo n'existe plus sur votre téléphone</Typography>
    </View>
  );
};

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params?: {
      isEdit: boolean;
      initialRouteName: string;
    };
  };
}

const label = "Choisissez parmi les exemples";
const placeholder = "Renseignez une raison de vivre";
const storageKey = "@CRISIS_PLAN_REASON_TO_LIVE";
const storageImageKey = "@CRISIS_PLAN_REASON_TO_LIVE_IMAGE";
const next = "crisis-plan-slide-contact";
const title = "Quelles sont vos principales raisons de vivre ?";
const headerEditionBottomSheet = "Raisons de vivre";
const suggestions = [
  "Ma famille",
  "Mes parents",
  "Mon/ma conjoint.e",
  "Mes enfants",
  "Mes amis",
  "Ma communauté",
  "Mon animal de compagnie",
  "Mon association",
  "Mon travail",
  "Ma foi",
  "Regarder vos photos",
];

export const CrisisPlanSlideReasonToLive: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ localUri: string; originalUri: string }[]>([]);
  const [text, setText] = useState<string>();

  const saveAndValidate = async () => {
    try {
      // Save the array of { localUri, originalUri } objects
      await AsyncStorage.setItem(storageImageKey, JSON.stringify(selectedImages));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des images :", e);
    }
  };

  useEffect(() => {
    const cb = async () => {
      const _items = await AsyncStorage.getItem(storageKey);

      const _parsedItems = JSON.parse(_items || "");
      if (Array.isArray(_parsedItems)) {
        setSelectedItems(_parsedItems);
      }
      const _imageObjs = await AsyncStorage.getItem(storageImageKey);

      let parsedImages: { localUri: string; originalUri: string }[] = [];
      try {
        parsedImages = JSON.parse(_imageObjs || "[]");
      } catch {
        parsedImages = [];
      }
      if (Array.isArray(parsedImages)) {
        setSelectedImages(parsedImages);
      }
    };
    cb();
  }, []);

  useEffect(() => {
    const cb = async () => {
      await AsyncStorage.setItem(storageKey, JSON.stringify(selectedItems));
    };
    cb();
  }, [selectedItems]);
  // Fonction utilitaire pour copier une image dans le dossier local
  const copyImageToLocalDir = async (uri: string) => {
    try {
      const folderUri = FileSystem.documentDirectory + "crisis-reason-images/";
      // Crée le dossier s'il n'existe pas
      const folderInfo = await FileSystem.getInfoAsync(folderUri);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      }
      // Génère un nom unique
      const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
      const dest = folderUri + filename;
      await FileSystem.copyAsync({ from: uri, to: dest });
      return dest;
    } catch (e) {
      console.error("Erreur lors de la copie de l'image :", e);
      return null;
    }
  };

  // Fonction pour gérer la sélection d'images
  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la galerie est nécessaire pour sélectionner des photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0,
      // selectionLimit: 10,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages: { localUri: string; originalUri: string }[] = [];
      for (const asset of result.assets) {
        const localPath = await copyImageToLocalDir(asset.uri);
        if (localPath) {
          newImages.push({ localUri: localPath, originalUri: asset.uri });
        }
      }
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader initialRouteName={route.params?.initialRouteName} navigation={navigation} title={"Mon plan de crise"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        {!route?.params?.isEdit && <CrisisProgressBar slideIndex={7} />}

        <View className="flex-column py-4 space-y-4 px-2 rounded-2xl">
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Typography>
        </View>
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-6">
          <View className="flex-column flex-start space-y-1">
            <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Renseignez une raison de vivre</Typography>
            <View className="flex-row items-center space-x-2">
              <InputText
                containerStyle={{
                  flexGrow: 1,
                }}
                value={text}
                jean
                placeholder={"Ex: Ma famille"}
                onChangeText={(inputText) => {
                  setText(inputText);
                }}
                multiline={true}
                textAlignVertical="top"
              />
              <TouchableOpacity
                className={mergeClassNames(
                  "h-12 w-12  rounded-2xl items-center justify-center",
                  !text || text.length === 0 ? "bg-gray-600" : "bg-primary-800"
                )}
                disabled={!text || text.length === 0}
                onPress={() => {
                  if (text) {
                    if (selectedItems.includes(text)) {
                      Alert.alert("Cet élément existe déjà");
                    } else {
                      setSelectedItems([...selectedItems, text]);
                      setText("");
                    }
                  }
                }}
              >
                <SimplePlus color={TW_COLORS.CNAM_PRIMARY_25} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <CrisisListBottomSheet
                  items={suggestions}
                  onClose={function (items: string[]): void {
                    setSelectedItems([...new Set([...items])]);
                    closeBottomSheet();
                  }}
                  initialSelectedItems={selectedItems}
                  label={label}
                  header={headerEditionBottomSheet}
                />
              );
            }}
          >
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-4 mb-4")}>
              Choisir parmi les suggestions
            </Typography>
          </TouchableOpacity>
        </View>
        {selectedItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                showBottomSheet(
                  <CrisisBottomSheet
                    label={label}
                    variant="standart"
                    placeholder={placeholder}
                    navigation={navigation}
                    header={"Raison de vivre"}
                    onClose={() => {
                      closeBottomSheet();
                    }}
                    onDelete={() => {
                      setSelectedItems(selectedItems.filter((_, i) => i !== index));
                      closeBottomSheet();
                    }}
                    onValidate={function (updatedItem) {
                      setSelectedItems(selectedItems.map((selectedItem, i) => (i === index ? updatedItem : selectedItem)));
                      closeBottomSheet();
                    }}
                    item={item}
                    initialText={item}
                  />
                );
              }}
              className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4"
            >
              <View className="flex-row space-x-2 flex-1">
                <View className="flex-col">
                  <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{item}</Typography>
                </View>
              </View>
              <View className="pl-2 flex-col items-center justify-center">
                <PencilIcon color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
              </View>
            </TouchableOpacity>
          );
        })}
        <View className="flex-row justify-between pt-6">
          <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Ajouter des photos</Typography>
          {!!selectedImages.length && (
            <TouchableOpacity
              onPress={() => {
                showBottomSheet(
                  <CrisisMediaBottomSheet
                    navigation={undefined}
                    label={"Raisons de vivre"}
                    placeholder={""}
                    onClose={function (_selectedImages) {
                      setSelectedImages(_selectedImages);
                      closeBottomSheet();
                    }}
                    initialSelectedImages={selectedImages}
                    initialText={""}
                    header={"Raisons de vivre"}
                  />
                );
              }}
            >
              <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline")}>Editer</Typography>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row justify-between flex-wrap">
          <TouchableOpacity
            onPress={handlePickImages}
            className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center border-dashed border-cnam-primary-400"
            style={{
              borderWidth: 1.5,
              borderColor: TW_COLORS.CNAM_PRIMARY_50,
              width: 98,
              height: 98,
            }}
          >
            <View className="w-8 h-8 items-center justify-center bg-white rounded-xl border border-cnam-primary-950">
              <SimplePlus color={TW_COLORS.CNAM_PRIMARY_900} />
            </View>
          </TouchableOpacity>
          {selectedImages.map((img, idx) => (
            <ImageWithFallback
              key={img.localUri + idx}
              localUri={img.localUri}
              originalUri={img.originalUri}
              style={{
                borderWidth: 1.5,
                borderColor: TW_COLORS.CNAM_PRIMARY_50,
                width: 98,
                height: 98,
                borderRadius: 16,
                marginBottom: 8,
                overflow: "hidden",
              }}
            />
          ))}
          {Array.from({ length: 2 - selectedImages.length }).map((_, idx) => (
            <View
              key={idx}
              className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center"
              style={{
                borderWidth: 1.5,
                borderColor: TW_COLORS.CNAM_PRIMARY_50,
                width: 98,
                height: 98,
              }}
            >
              <ImageIcon />
            </View>
          ))}
          {Array.from({ length: selectedImages.length > 2 ? 2 - (selectedImages.length % 3) : 0 }).map((_, idx) => (
            <View
              key={idx}
              className="rounded-2xl mb-2 items-center justify-center"
              style={{
                width: 98,
                height: 98,
                overflow: "hidden",
              }}
            ></View>
          ))}
        </View>
      </ScrollView>
      {!route.params?.isEdit && (
        <CrisisNavigationButtons
          absolute={true}
          onPrevious={() => {
            navigation.goBack();
          }}
          onNext={async () => {
            // Enregistre les paths dans le localStorage
            await saveAndValidate();
            navigation.navigate("crisis-plan-slide-final", {
              initialRouteName: route.params.initialRouteName,
            });
          }}
          withArrow={true}
          showPrevious={false}
        />
      )}
      {route.params?.isEdit && (
        <NavigationButtons
          nextText="Valider"
          absolute={true}
          onNext={async () => {
            await saveAndValidate();
            navigation.navigate("crisis-plan-slide-sumup-list");
          }}
        />
      )}
    </View>
  );
};
