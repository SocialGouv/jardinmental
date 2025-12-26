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

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
  suggestions: string[];
  label: string;
  placeholder: string;
  storageKey: string;
  title: string;
  next: string;
  labelBottomSheet: string;
  headerBottomSheet: string;
  headerEditionBottomSheet: string;
}

const label = "Choisissez parmi vos contacts autorisés";
const placeholder = "Renseignez une raison de vivre";
const storageKey = "@CRISIS_PLAN_REASON_TO_LIVE";
const storageImageKey = "@CRISIS_PLAN_REASON_TO_LIVE_IMAGE";
const next = "crisis-plan-slide-contact";
const title = "Quelles sont vos principales raisons de vivre ?";
const headerEditionBottomSheet = "Liste de contact";
const suggestions = ["Ma famille", "Mes parents", "Mon/ma conjoint.e", "Mes enfants", "Mes amis", "Ma communauté"];

export const CrisisPlanSlideReasonToLive: React.FC<ModalCorrelationScreenProps> = ({
  navigation,
  //   suggestions,
  //   label,
  //   placeholder,
  //   storageKey,
  //   title,
  //   next,
  //   labelBottomSheet,
  //   headerBottomSheet,
  //   headerEditionBottomSheet,
}) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ uri: string }[]>([]);
  const [localImagePaths, setLocalImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const cb = async () => {
      const _items = await AsyncStorage.getItem(storageKey);

      const _parsedItems = JSON.parse(_items || "");
      if (Array.isArray(_parsedItems)) {
        setSelectedItems(_parsedItems);
      }
      const _imagePaths = await AsyncStorage.getItem(storageImageKey);

      const _parsedImagePaths = JSON.parse(_imagePaths || "");
      if (Array.isArray(_parsedImagePaths)) {
        setLocalImagePaths(_parsedImagePaths);
        setSelectedImages(_parsedImagePaths.map((p) => ({ uri: p })));
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
      quality: 1,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImages((prev) => [...prev, ...result.assets.map((asset) => ({ uri: asset.uri }))]);
      // Copie chaque image dans le dossier local et stocke le path
      const copiedPaths: string[] = [];
      for (const asset of result.assets) {
        const localPath = await copyImageToLocalDir(asset.uri);
        if (localPath) copiedPaths.push(localPath);
      }
      setLocalImagePaths((prev) => [...prev, ...copiedPaths]);
    }
  };

  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader navigation={navigation} title={"Ma liste de secours"} description={"Par Hop ma liste"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Text>
        </View>
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8">
          <View className="flex-column flex-start space-y-1 mb-4">
            <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Renseignez une raison de vivre</Text>
            <InputText
              containerStyle={{
                flexGrow: 1,
              }}
              placeholder={"Ex: Ma famille"}
              onChangeText={(inputText) => {
                //   setNumber(inputText);
              }}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <CrisisListBottomSheet
                  items={suggestions}
                  onClose={function (items: string[]): void {
                    setSelectedItems([...selectedItems, ...items]);
                    closeBottomSheet();
                  }}
                  initialSelectedItems={[]}
                  label={label}
                  header={headerEditionBottomSheet}
                />
              );
            }}
          >
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-4 mb-4")}>
              Choisir parmi les suggestions
            </Text>
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
                    // initialText={item.name}
                  />
                );
              }}
              className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4"
            >
              <View className="flex-row space-x-2 flex-1">
                <View className="flex-col">
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{item}</Text>
                </View>
              </View>
              <View className="pl-2 flex-col items-center justify-center">
                <PencilIcon color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
              </View>
            </TouchableOpacity>
          );
        })}
        <View className="flex-row justify-between pt-6">
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Ajouter des photos</Text>
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <CrisisMediaBottomSheet
                  navigation={undefined}
                  label={"Raisons de vivre"}
                  placeholder={""}
                  onClose={function (_selectedImage) {
                    setSelectedImages(_selectedImage);
                    setLocalImagePaths(_selectedImage.map((img) => img.uri));
                    closeBottomSheet();
                  }}
                  initialSelectedImages={selectedImages}
                  initialText={""}
                  header={"Raisons de vivre"}
                />
              );
            }}
          >
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline")}>Editer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between flex-wrap">
          <TouchableOpacity
            onPress={handlePickImages}
            className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center"
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
            <View
              key={img.uri + idx}
              className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center"
              style={{
                borderWidth: 1.5,
                borderColor: TW_COLORS.CNAM_PRIMARY_50,
                width: 98,
                height: 98,
                overflow: "hidden",
              }}
            >
              <Image source={{ uri: img.uri }} style={{ width: 94, height: 94, borderRadius: 16 }} resizeMode="cover" />
            </View>
          ))}
          {selectedImages.length === 0 && (
            <>
              <View
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
              <View
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
            </>
          )}
        </View>
      </ScrollView>
      <CrisisNavigationButtons
        absolute={true}
        onPrevious={() => {
          navigation.goBack();
        }}
        onNext={async () => {
          // Enregistre les paths dans le localStorage
          try {
            const storageKey = storageImageKey;
            // Récupère l'objet existant ou crée un nouveau
            const existing = await AsyncStorage.getItem(storageKey);
            let data: any = {};
            if (existing) {
              try {
                data = JSON.parse(existing);
              } catch {
                data = [];
              }
            }
            data = [...localImagePaths];
            await AsyncStorage.setItem(storageKey, JSON.stringify(data));
          } catch (e) {
            console.error("Erreur lors de la sauvegarde des paths d'images :", e);
          }
          navigation.navigate("crisis-plan-slide-final");
        }}
        withArrow={true}
        showPrevious={false}
      />
    </View>
  );
};
