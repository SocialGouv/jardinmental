import { View, Text, ScrollView, Dimensions, TouchableOpacity, Platform } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { InputText } from "@/components/InputText";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { TW_COLORS } from "@/utils/constants";
import { colors } from "@/utils/colors";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const CrisisBottomSheet = ({
  navigation,
  label,
  placeholder,
  onClose,
  initialText,
  onDelete,
  onValidate,
  isExtended,
  header,
}: {
  navigation: any;
  label: string;
  placeholder: string;
  onClose: () => any;
  initialText: string;
  onDelete: () => void;
  onValidate: (text: string) => void;
  isExtended: boolean;
  header: string;
}) => {
  const [text, setText] = useState<string>(initialText);
  const screenHeight = Dimensions.get("window").height;
  console.log("LKCS TOTO", isExtended);
  return (
    <View
      // className={mergeClassNames("flex-1 flex-col bg-white", isExtended ? "h-full" : "")}
      // style={isExtended ? { flex: 1, flexDirection: "column", height: "100%" } : { flex: 1, flexDirection: "column" }}
      className={mergeClassNames("flex-1 flex-col bg-white")}
      style={{ flex: 1, flexDirection: "column" }}
    >
      <ScrollView
        bounces={false}
        className={mergeClassNames("flex-1")}
        style={{ flexGrow: 1 }}
        // className={mergeClassNames("flex-1", isExtended ? "h-full" : "")}
        // style={isExtended ? { flex: 1, height: "100%" } : { flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="self-end mr-4">
          <TouchableOpacity
            className="mb-2"
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
            <View
              style={{
                alignItems: "stretch",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                borderColor: colors.BLUE,
                flexGrow: 1,
                padding: 16,
                borderWidth: 1,
              }}
            >
              <BottomSheetTextInput
                style={{
                  fontSize: 16,
                  backgroundColor: "transparent",
                  fontFamily: "SourceSans3",
                  alignItems: "stretch",
                  color: "#000",
                  width: "100%",
                  padding: 0,
                }}
                placeholder={placeholder}
                placeholderTextColor={TW_COLORS.GRAY_700}
                value={text}
                onChangeText={(inputText) => {
                  setText(inputText);
                }}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
            {/* <InputText
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
            /> */}
          </View>
        </View>
      </ScrollView>
      <View className="w-full py-6 px-6">
        <JMButton
          onPress={() => {
            onValidate(text);
          }}
          disabled={!text || !text.length}
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
    </View>
  );
};
