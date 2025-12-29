import { LightSelectionnableItem } from "@/components/SelectionnableItem";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import JMButton from "@/components/JMButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export default function CrisisContactListBottomSheet({
  onClose,
  initialSelectedItems,
  items,
  label,
  header,
  itemIdKey,
  itemIdLabel,
}: {
  onClose: (item: string[]) => void;
  initialSelectedItems: string[];
  items: any[];
  label: string;
  header: string;
  itemIdKey?: string;
  itemIdLabel?: string;
}) {
  const [selectedItems, setSelectedItems] = useState<any[]>(initialSelectedItems);
  const toggleItem = (ind) => {
    const alreadySelected = selectedItems.map((item) => (itemIdKey ? item[itemIdKey] : item)).includes(itemIdKey ? ind[itemIdKey] : ind);
    if (alreadySelected) {
      setSelectedItems(selectedItems.filter((item) => (itemIdKey ? ind[itemIdKey] !== item[itemIdKey] : ind !== item)));
    } else {
      setSelectedItems([...selectedItems, ind]);
    }
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
            }}
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2">
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>{header}</Text>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
          <Text className={mergeClassNames(typography.textXlBold, "text-left text-cnam-primary-900")}>{label}</Text>
          <View className="flex-colum flex-1">
            {items.map((ind) => {
              const selected = selectedItems.map((item) => (itemIdKey ? item[itemIdKey] : item)).includes(itemIdKey ? ind[itemIdKey] : ind);
              return (
                <LightSelectionnableItem
                  shape="square"
                  key={itemIdKey ? ind[itemIdKey] : ind}
                  className="flex-row"
                  id={itemIdKey ? ind[itemIdKey] : ind}
                  label={itemIdLabel ? ind[itemIdLabel] : ind}
                  description={ind["phoneNumbers"] ? ind["phoneNumbers"][0].number : undefined}
                  selected={selected}
                  // disabled={initialSelected}
                  onPress={() => toggleItem(ind)}
                />
              );
            })}
            {/* {!!uniqueItems.length && !filteredDoses.length && (
              <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800")}>Pas de résultat</Text>
            )} */}
            {/* {!!searchedText && !filteredDoses.length && (
              <TouchableOpacity
                onPress={() => {
                  createNewDose(searchedText);
                  setSearchText("");
                }}
              >
                <View className="flex-row items-center mr-auto mt-2">
                  <Text className={mergeClassNames(typography.textLgMedium, "mr-2 text-cnam-primary-900")}>Ajouter "{searchedText}"</Text>
                  <PlusIcon />
                </View>
              </TouchableOpacity>
            )} */}
            {/* {!searchedText && (
              <View className="flex-row items-center mt-2 ml-auto">
                <TouchableOpacity
                  onPress={() => {
                    setEditingDoses((editingDoses) => [...editingDoses, ""]);
                  }}
                >
                  <View className="flex-row items-center">
                    <Text className={mergeClassNames(typography.textMdMedium, "mr-2 text-cnam-primary-900")}>Saisir manuellement</Text>
                    <PlusIcon />
                  </View>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`flex-column justify-between items-center p-6 px-6 bg-white/90 pb-10 w-full`}
      >
        <JMButton
          onPress={() => {
            onClose(selectedItems);
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
}
