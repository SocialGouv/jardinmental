import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { InputText } from "@/components/InputText";
import { useState } from "react";

const screenHeight = Dimensions.get("window").height;

export const CrisisBottomSheet = ({
  navigation,
  label,
  placeholder,
  onClose,
  initialText,
  onDelete,
  onValidate,
  header,
}: {
  navigation: any;
  label: string;
  placeholder: string;
  onClose: () => any;
  initialText: string;
  onDelete: () => void;
  onValidate: (text: string) => void;
  header: string;
}) => {
  const [text, setText] = useState<string>(initialText);
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
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8 mx-4">
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>{label}</Text>
          <View className="flex-row items-center space-x-2">
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
        </View>
        <View className="w-full py-6 px-6">
          <JMButton
            onPress={() => {
              onValidate(text);
            }}
            className="mb-2"
            title={"Valider"}
          />
          <JMButton
            onPress={() => {
              onDelete();
            }}
            variant="text"
            textClassName="text-cnam-bisque-600-Lighten-20 underline"
            title={"Supprimer"}
          />
        </View>
      </ScrollView>
    </View>
  );
};
