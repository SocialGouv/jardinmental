import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { TW_COLORS } from "@/utils/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useBottomSheet } from "@/context/BottomSheetContext";
import PencilIcon from "@assets/svg/icon/Pencil";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const suggestions = [
  { label: "Mes signes d’alerte", path: "crisis-plan-slide-alert" },
  { label: "Activités", path: "crisis-plan-slide-activities" },
  { label: "Se changer les idées", path: "crisis-plan-slide-contact" },
  { label: "Demander de l’aide", path: "crisis-plan-slide-contact-help" },
  { label: "En cas d’urgence", path: "crisis-plan-slide-contact-professional" },
  { label: "Environnement sécurisé", path: "crisis-plan-slide-safety" },
  { label: "Raisons de vivre", path: "crisis-plan-slide-reason-to-live" },
];

export default function CrisisSumUpBottomSheet({
  onClose,
  initialSelectedItems,
  items,
  navigation,
}: {
  onClose: (item: string[]) => void;
  initialSelectedItems: string[];
  items: any[];
  navigation: any;
}) {
  const uniqueItems = items;
  const [filteredDoses, setFilteredDoses] = useState<string[]>(uniqueItems);
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelectedItems);
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const toggleItem = (id) => {
    if (selectedItems?.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const createCustomDose = (name: string): string => {
    return name;
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        style={{ paddingVertical: 20, height: height90vh, paddingHorizontal: 0 }}
      >
        <View className="self-end mr-4">
          <TouchableOpacity
            onPress={() => {
              setSelectedItems([]);
              closeBottomSheet();
            }}
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Fermer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2">
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>Modifier Plan de protection</Text>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
          <Text className={mergeClassNames(typography.textXlBold, "text-left text-cnam-primary-900")}>Que souhaitez-vous modifier ?</Text>
          <View className="flex-colum flex-1 space-y-2">
            {suggestions.map((suggestion, ind) => {
              return (
                <TouchableOpacity
                  key={ind}
                  onPress={() => {
                    navigation.navigate(suggestion.path, {
                      isEdit: true,
                    });
                    closeBottomSheet();
                  }}
                  className="bg-gray-200 border-gray-300 flex-row justify-between items-center py-2 px-4 rounded-2xl"
                >
                  <View className="flex-row items-center justify-center">
                    <View className="w-[26] h-[28]">
                      <Text
                        className={mergeClassNames(
                          "bg-cnam-cyan-200-lighten-60 px-2 py-0 text-cnam-primary-950 rounded items-center justify-center",
                          typography.textLgSemibold
                        )}
                      >
                        {ind + 1}
                      </Text>
                    </View>
                    <Text className={mergeClassNames("px-2 py-2 text-cnam-primary-950", typography.textLgSemibold)}>{suggestion.label}</Text>
                  </View>
                  <View>
                    <PencilIcon width={24} height={24} color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
