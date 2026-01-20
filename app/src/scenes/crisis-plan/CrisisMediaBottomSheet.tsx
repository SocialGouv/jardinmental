import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity, Image } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { InputText } from "@/components/InputText";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import { TW_COLORS } from "@/utils/constants";
import { useState } from "react";
import TrashIcon from "@assets/svg/icon/Trash";
import { Typography } from "@/components/Typography";

const screenHeight = Dimensions.get("window").height;

export const CrisisMediaBottomSheet = ({
  navigation,
  label,
  placeholder,
  onClose,
  initialText,
  header,
  initialSelectedImages,
}: {
  navigation: any;
  label: string;
  placeholder: string;
  onClose: (selectedImages: { localUri: string; originalUri: string }[]) => any;
  initialText: string;
  header: string;
  initialSelectedImages: { localUri: string; originalUri: string }[];
}) => {
  const [selectedImages, setSelectedImages] = useState<{ localUri: string; originalUri: string }[]>(initialSelectedImages || []);
  const { closeBottomSheet } = useBottomSheet();

  return (
    <View className="flex-1 bg-white">
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View className="self-end mr-4">
          <TouchableOpacity
            onPress={() => {
              closeBottomSheet();
            }}
          >
            <Typography className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Annuler</Typography>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2 mb-4">
          <Typography className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>{header}</Typography>
        </View>
        <View className="flex-row flex-wrap mx-6 justify-between">
          {selectedImages.map((img, idx) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedImages(selectedImages.filter((_, i) => i !== idx));
              }}
              key={img.localUri + idx}
              className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center"
              style={{
                borderWidth: 1.5,
                borderColor: TW_COLORS.CNAM_PRIMARY_50,
                width: 98,
                height: 98,
                overflow: "hidden",
              }}
            >
              <Image source={{ uri: img.localUri }} style={{ width: 94, height: 94, borderRadius: 16, opacity: 0.5 }} resizeMode="cover" />
              <View
                className="bg-white rounded-2xl border-1 border-cnam-primary-800 w-10 h-10 absolute items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: TW_COLORS.CNAM_PRIMARY_800,
                }}
              >
                <TrashIcon color={TW_COLORS.CNAM_PRIMARY_800} width={20} height={20} />
              </View>
            </TouchableOpacity>
          ))}
          {Array.from({ length: 3 - (selectedImages.length % 3) }).map((item, idx) => {
            return (
              <View
                key={idx}
                style={{
                  width: 98,
                  height: 98,
                  overflow: "hidden",
                }}
              ></View>
            );
          })}
        </View>
        <View className="w-full py-6 px-6">
          <JMButton
            onPress={() => {
              onClose(selectedImages);
            }}
            className="mb-2"
            title={"Valider"}
          />
          <JMButton
            onPress={() => {
              onClose([]);
            }}
            variant="text"
            textClassName="text-cnam-bisque-600-Lighten-20 underline"
            title={"Tout supprimer"}
          />
        </View>
      </ScrollView>
    </View>
  );
};
