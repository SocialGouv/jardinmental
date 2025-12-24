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

const screenHeight = Dimensions.get("window").height;

export const CrisisMediaBottomSheet = ({
  navigation,
  label,
  placeholder,
  onClose,
  initialText,
  onDelete,
  onValidate,
  header,
  initialSelectedImages,
}: {
  navigation: any;
  label: string;
  placeholder: string;
  onClose: (selectedImage: { uri: string }[]) => any;
  initialText: string;
  header: string;
  initialSelectedImages: { uri: string }[];
}) => {
  const [text, setText] = useState<string>(initialText);
  const [selectedImages, setSelectedImages] = useState<{ uri: string }[]>(initialSelectedImages || []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View className="self-end mr-4">
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Annuler</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2 mb-4">
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>{header}</Text>
        </View>
        {/* <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8 mx-4">
          {/* <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>{label}</Text> */}
        {/* <View className="flex-row items-center space-x-2">
            <InputText
              containerStyle={{
                flexGrow: 1,
              }}
              placeholder={placeholder}
              value={text}
              onChangeText={(inputText) => {
                setText(inputText);
              }}
              multiline={true}
              textAlignVertical="top"
            />
          </View> 
        </View> */}
        <View className="flex-row flex-wrap space-x-2 mx-6">
          {selectedImages.map((img, idx) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedImages(selectedImages.filter((_, i) => i !== idx));
              }}
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
              <Image source={{ uri: img.uri }} style={{ width: 94, height: 94, borderRadius: 16, opacity: 0.5 }} resizeMode="cover" />
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
