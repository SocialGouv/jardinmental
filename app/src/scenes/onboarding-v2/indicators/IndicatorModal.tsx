import SelectionnableItem, { InputSelectionnableItem, LightSelectionnableItem } from "@/components/SelectionnableItem";
import { mergeClassNames } from "@/utils/className";
import { INDICATORS, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { typography } from "@/utils/typography";
import PlusIcon from "@assets/svg/icon/plus";
import { View, Text, TextInput, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { INDICATOR_CATEGORIES_DATA } from "../data/helperData";
import React, { useEffect, useState } from "react";
import { TW_COLORS } from "@/utils/constants";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { INDICATOR_TYPE, PredefineIndicatorV2SchemaType, Indicator, generateIndicatorFromPredefinedIndicator } from "@/entities/Indicator";
import { v4 as uuidv4 } from "uuid";
import JMButton from "@/components/JMButton";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export default function IndicatorModal({
  category = NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
  genericIndicator,
  addedIndicators,
  initialSelectedIndicators,
  userIndicators = [],
  multiSelect = true,
  onClose,
}: {
  category: NEW_INDICATORS_CATEGORIES;
  genericIndicator?: Indicator;
  addedIndicators: PredefineIndicatorV2SchemaType[];
  initialSelectedIndicators: string[];
  userIndicators: Indicator[];
  multiSelect?: boolean;
  onClose: (categoryName: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => void;
}) {
  const existingCustomIndicatorsForGenericUuid = userIndicators.filter((ind) => !ind.isGeneric && ind.genericUuid === genericIndicator?.genericUuid);
  const allIndicators = [...INDICATORS.filter((ind) => ind.categories.includes(category)), ...addedIndicators].filter((ind) => !ind.isGeneric);
  const uniqueIndicators = Array.from(new Map(allIndicators.map((ind) => [ind.uuid, ind])).values());
  const [newIndicators, setNewIndicators] = useState<PredefineIndicatorV2SchemaType[]>([]);
  const [filteredIndicators, setFilteredIndicators] = useState<PredefineIndicatorV2SchemaType[]>([...uniqueIndicators, ...newIndicators]);
  const [searchedText, setSearchText] = useState<string>("");
  const [editingIndicators, setEditingIndicators] = useState<string[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(initialSelectedIndicators);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const checkDuplicateName = (name: string): boolean => {
    const lowerName = name?.toLowerCase().trim();
    if (!lowerName) return false;

    // Check against INDICATORS
    const existsInIndicators = INDICATORS.some((indicateur) => indicateur.name?.toLowerCase() === lowerName);

    // Check against userIndicators
    const existsInDisabled = userIndicators.some((indicateur) => indicateur.name?.toLowerCase() === lowerName);

    // Check against newIndicators added
    const existsInNewIndicators = newIndicators.some((indicateur) => indicateur.name?.toLowerCase() === lowerName);

    return existsInIndicators || existsInDisabled || existsInNewIndicators;
  };

  const toggleIndicator = (id: string) => {
    if (multiSelect) {
      // Multi-select mode: toggle behavior
      setSelectedIndicators((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
    } else {
      // Single-select mode: if already selected, deselect it; otherwise select only this one
      setSelectedIndicators((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const createCustomIndicator = (name: string, category: NEW_INDICATORS_CATEGORIES): PredefineIndicatorV2SchemaType => {
    // this PredefineIndicatorV2SchemaType will be refined afterwards and treated as a generic indicator
    return {
      uuid: uuidv4(),
      name: name,
      category: INDICATORS_CATEGORIES.Comportements,
      type: genericIndicator?.type || INDICATOR_TYPE.boolean,
      order: genericIndicator?.order || "ASC",
      isGeneric: false,
      isCustom: true,
      genericUuid: genericIndicator?.genericUuid || "", // this must be defined
      categories: [category],
      mainCategory: category,
      priority: 0,
    };
  };

  const createNewIndicator = (text: string, index?: number): boolean => {
    if (text) {
      // Clear any previous error
      setDuplicateError(null);

      // Check for duplicates
      if (checkDuplicateName(text)) {
        setDuplicateError("Un indicateur avec ce nom existe déjà");
        return false; // Prevent creation
      }

      const newIndicator = createCustomIndicator(text, category);
      setNewIndicators((prev) => [...prev, newIndicator]);
      if (typeof index === "number") {
        setEditingIndicators((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      }
      if (multiSelect) {
        setSelectedIndicators((prev) => [...prev, newIndicator.uuid]);
      } else {
        setSelectedIndicators([newIndicator.uuid]);
      }
    }
    return true;
  };

  useEffect(() => {
    if (searchedText) {
      setFilteredIndicators([...uniqueIndicators, ...newIndicators].filter((ind) => ind.name.toLowerCase().includes(searchedText.toLowerCase())));
    } else {
      setFilteredIndicators([...uniqueIndicators, ...newIndicators]);
    }
  }, [searchedText, newIndicators]);

  return (
    <View className="flex-1">
      <ScrollView
        className="gap-6"
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="flex-row">
          {React.createElement(INDICATOR_CATEGORIES_DATA[category].icon, {
            color: TW_COLORS.BRAND_600,
          })}
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-brand-600 text-left")}>{INDICATOR_CATEGORIES_DATA[category].label}</Text>
        </View>
        <Text className={mergeClassNames(typography.displayXsBold, "text-left text-brand-950")}>
          {multiSelect ? "Sélectionnez un ou plusieurs éléments" : "Sélectionnez un élément"}
        </Text>
        <TextInput
          onChangeText={(text) => {
            setSearchText(text);
            if (duplicateError) setDuplicateError(null); // Clear error when typing
          }}
          className={mergeClassNames(typography.textMdRegular, "text-left border border-gray-300 p-2 rounded rounded-lg")}
          placeholder="Rechercher ou ajouter un élément"
        />
        {duplicateError && <Text className={mergeClassNames(typography.textSmMedium, "text-red-600 mt-2")}>{duplicateError}</Text>}
        <View className="flex-colum flex-1">
          {[...filteredIndicators, ...existingCustomIndicatorsForGenericUuid].map((ind) => {
            const selected = selectedIndicators.includes(ind.uuid);

            return (
              <LightSelectionnableItem
                key={ind.uuid}
                className="flex-row"
                id={ind.uuid}
                label={ind.name}
                disabled={userIndicators.some((disabledInd) => disabledInd.uuid === ind.uuid || disabledInd.baseIndicatorUuid === ind.uuid)}
                shape={multiSelect ? "square" : "circle"}
                selected={selected}
                onPress={() => toggleIndicator(ind.uuid)}
              />
            );
          })}
          {!filteredIndicators.length && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700")}>Pas de résultat</Text>}
          {!!searchedText && !filteredIndicators.length && (
            <TouchableOpacity
              onPress={() => {
                const isCreated = createNewIndicator(searchedText);
                if (isCreated) {
                  setSearchText("");
                }
              }}
            >
              <View className="flex-row items-center mr-auto mt-2">
                <Text className={mergeClassNames(typography.textLgMedium, "mr-2 text-brand-900")}>Ajouter "{searchedText}"</Text>
                <PlusIcon />
              </View>
            </TouchableOpacity>
          )}
          {editingIndicators.map((text, index) => (
            <InputSelectionnableItem
              key={index}
              id={index}
              label="Nommez le produit ou l'addiction:"
              selected={false}
              onPress={(text: string) => createNewIndicator(text, index)}
              validationError={duplicateError || undefined}
              onTextChange={(text: string) => {
                if (duplicateError) setDuplicateError(null); // Clear error when typing
              }}
            />
          ))}
          {!searchedText && (
            <View className="flex-row items-center mt-2 ml-auto">
              <TouchableOpacity
                onPress={() => {
                  setEditingIndicators((editingIndicators) => [...editingIndicators, ""]);
                }}
              >
                <View className="flex-row items-center">
                  <Text className={mergeClassNames(typography.textMdMedium, "mr-2 text-brand-900")}>ajouter un élément</Text>
                  <PlusIcon />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`flex-column justify-between items-center p-6 px-6 bg-white/90 pb-10 w-full`}
      >
        <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Vous pourrez modifier cette sélection plus tard</Text>
        <JMButton
          onPress={() => {
            onClose(
              category,
              [...uniqueIndicators, ...newIndicators].filter((indicator) => selectedIndicators.includes(indicator.uuid))
            );
          }}
          title={multiSelect ? "Valider la sélection" : "Valider le choix"}
        />
      </View>
    </View>
  );
}
