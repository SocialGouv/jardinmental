import { InputText } from "@/components/InputText";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";

export const CrisisPlanInputBox = ({
  placeholder,
  label,
  onPress,
  onPressAdd,
  selectedItems,
}: {
  placeholder: string;
  label: string;
  onPress: string;
  onPressAdd: (item: string) => {};
  selectedItems: string[];
}) => {
  const [text, setText] = useState<string>();
  return (
    <View className="bg-cnam-primary-50 rounded-2xl px-6 py-6">
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
                onPressAdd(text);
                setText("");
              }
            }
          }}
        >
          <SimplePlus color={TW_COLORS.CNAM_PRIMARY_25} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onPress}>
        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-4")}>
          Choisir parmi les suggestions
        </Text>
      </TouchableOpacity>
    </View>
  );
};
