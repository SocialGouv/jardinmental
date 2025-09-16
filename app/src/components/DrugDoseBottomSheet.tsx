import SelectionnableItem, { InputSelectionnableItem, LightSelectionnableItem } from "@/components/SelectionnableItem";
import { mergeClassNames } from "@/utils/className";
import { INDICATORS, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { typography } from "@/utils/typography";
import PlusIcon from "@assets/svg/icon/plus";
import { View, Text, TextInput, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { TW_COLORS } from "@/utils/constants";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import JMButton from "@/components/JMButton";
import { Drug } from "@/entities/Drug";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import HealthIcon from "@assets/svg/icon/Health";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export default function DrugDoseBottomSheet({
  onClose,
  drug,
  initialSelectedDose,
}: {
  drug: Drug;
  onClose: (dose: string | undefined) => void;
  initialSelectedDose?: string;
}) {
  const uniqueDoses = drug.values ?? ["1,5 mg", "3 mg", "4,5 mg", "6 mg", "7,5 mg", "9 mg", "10,5 mg"];
  const [newDoses, setNewDoses] = useState<string[]>([]);
  const [filteredDoses, setFilteredDoses] = useState<string[]>(uniqueDoses);
  const [searchedText, setSearchText] = useState<string>("");
  const [editingDoses, setEditingDoses] = useState<string[]>([]);
  const [selectedDose, setSelectedDose] = useState<string | undefined>(initialSelectedDose);

  const toggleDose = (id: string) => {
    setSelectedDose(id);
  };

  const createCustomDose = (name: string): string => {
    return name;
  };

  const createNewDose = (text: string, index?: number) => {
    if (text) {
      const newDose = createCustomDose(text);
      setNewDoses((prev) => [...prev, newDose]);

      if (typeof index === "number") {
        setEditingDoses((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      }
      setSelectedDose(newDose);
    }
  };

  useEffect(() => {
    if (searchedText) {
      setFilteredDoses([...uniqueDoses, ...newDoses].filter((ind) => ind.toLowerCase().includes(searchedText.toLowerCase())));
    } else {
      setFilteredDoses([...uniqueDoses, ...newDoses]);
    }
  }, [searchedText, newDoses]);

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
              setSelectedDose(undefined);
            }}
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2">
          <HealthIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>
            {drug.name1} {drug.name2 ? `(${drug.name2})` : ""}
          </Text>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
          <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900")}>Sélectionnez une dose</Text>
          <TextInput
            onChangeText={(text) => {
              setSearchText(text);
            }}
            className={mergeClassNames(typography.textMdRegular, "text-left border border-gray-300 p-2 rounded rounded-lg")}
            placeholder="Rechercher ou ajouter un élément"
          />
          <View className="flex-colum flex-1">
            {filteredDoses.map((ind) => {
              const selected = selectedDose === ind;

              return (
                <LightSelectionnableItem
                  shape="circle"
                  key={ind}
                  className="flex-row"
                  id={ind}
                  label={ind}
                  selected={selected}
                  onPress={() => toggleDose(ind)}
                />
              );
            })}
            {!!uniqueDoses.length && !filteredDoses.length && (
              <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800")}>Pas de résultat</Text>
            )}
            {!!searchedText && !filteredDoses.length && (
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
            )}
            {editingDoses.map((text, index) => (
              <InputSelectionnableItem
                placeholder="Exemple: 5ml, 3 gouttes..."
                shape="circle"
                label={"Saisissez la dose* :"}
                onPress={(text: string) => createNewDose(text, index)}
              />
            ))}
            {!searchedText && (
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
            )}
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
        <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 mb-2")}>Vous pourrez modifier cette sélection plus tard</Text>
        <JMButton
          onPress={() => {
            onClose(selectedDose);
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
}
