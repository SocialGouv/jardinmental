import React, { useEffect, useState } from "react";
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
import { CrisisPlanInputBox } from "./CrisisPlanInputBox";
import JMButton from "@/components/JMButton";
import PhoneIcon from "@assets/svg/icon/Phone";
import { CrisisContactBottomSheet } from "./CrisisContactBottomSheet";
import { InputText } from "@/components/InputText";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import CrisisContactListBottomSheet from "./CrisisContactListBottomSheet";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import CrisisProgressBar from "./CrisisProgressBar";

// Format phone number with a space every two digits (e.g., "066257" => "06 62 57")
function formatPhoneNumber(number: string): string {
  return number.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params: {
      isEdit: boolean;
      initialRouteName: string;
    };
  };
}

const suggestions = [
  {
    name: "3114 (Prévention Suicide 24/7)",
    id: "3114",
    isSuggestion: true,
    phoneNumbers: [
      {
        digits: "3114",
        number: "3114",
      },
    ],
  },
  {
    name: "SAMU 15 (Urgences immédiates)",
    id: "15",
    isSuggestion: true,
    phoneNumbers: [
      {
        digits: "15",
        number: "15",
      },
    ],
  },
];

const label = "Choisissez parmi les suggestions";
const placeholder = "Nom du contact";
const storageKey = "@CRISIS_PLAN_CONTACT_PROFESSIONAL";
const next = "crisis-plan-slide-safety";
const title = "Quels professionnels, structures spécialisées, ou numéros d’urgence pouvez-vous contacter ?";
const headerEditionBottomSheet = "Numéros d’urgence";
export const CrisisPlanSlideContactProfessional: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [number, setNumber] = useState<string>();
  const [contactName, setContactName] = useState<string>();

  useEffect(() => {
    const cb = async () => {
      const _items = await AsyncStorage.getItem(storageKey);

      const _parsedItems = JSON.parse(_items || "");
      if (Array.isArray(_parsedItems)) {
        setSelectedItems(_parsedItems);
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

  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader initialRouteName={route.params?.initialRouteName} navigation={navigation} title={"Mon plan de crise"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <CrisisProgressBar slideIndex={5} />

        <View className="flex-column py-4 space-y-4 px-2 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Text>
        </View>
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-6">
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Nom du contact</Text>
          <View className="flex-row items-center space-x-2 mb-4">
            <InputText
              containerStyle={{
                flexGrow: 1,
              }}
              placeholder={"Ex: un professionnel, une structure..."}
              value={contactName}
              onChangeText={(inputText) => {
                setContactName(inputText);
              }}
              multiline={true}
              textAlignVertical="top"
              fill={undefined}
              preset={undefined}
              onPress={undefined}
              disabled={false}
              style={undefined}
              hidePlaceholder={undefined}
            />
          </View>
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Renseignez le numéro</Text>
          <View className="flex-row items-center space-x-2">
            <InputText
              containerStyle={{
                flexGrow: 1,
              }}
              placeholder={"Renseignez le numéro de téléphone"}
              value={number}
              onChangeText={(inputText) => {
                setNumber(inputText);
              }}
              keyboardType="numeric"
              multiline={true}
              textAlignVertical="top"
              fill={undefined}
              preset={undefined}
              onPress={undefined}
              disabled={false}
              style={undefined}
              hidePlaceholder={undefined}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <CrisisContactListBottomSheet
                  items={suggestions}
                  onClose={function (items): void {
                    setSelectedItems(items);
                    closeBottomSheet();
                  }}
                  withSearchInput={false}
                  itemIdKey="id"
                  itemIdLabel="name"
                  initialSelectedItems={selectedItems}
                  label={label}
                  header={headerEditionBottomSheet}
                  accessPrivileges={undefined}
                />
              );
            }}
          >
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-4 mb-4")}>
              Choisir parmi les suggestions
            </Text>
          </TouchableOpacity>
          <JMButton
            disabled={!contactName && !number}
            onPress={() => {
              setSelectedItems([
                ...selectedItems,
                {
                  name: contactName,
                  phoneNumbers: [
                    {
                      digits: number,
                      number,
                    },
                  ],
                  id: contactName,
                },
              ]);
              setNumber(undefined);
              setContactName(undefined);
            }}
            title="Ajouter"
          />
        </View>
        {loadingContacts && (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="small" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
            <Text style={{ color: TW_COLORS.CNAM_CYAN_700_DARKEN_40 }}>Chargement des contacts...</Text>
          </View>
        )}
        {contactsError && <Text style={{ color: "red", marginTop: 10 }}>{contactsError}</Text>}
        {selectedItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                showBottomSheet(
                  <CrisisContactBottomSheet
                    variant="standart"
                    label={label}
                    placeholder={placeholder}
                    deleteLabel="Supprimer ce contact d'urgence"
                    navigation={navigation}
                    header={headerEditionBottomSheet}
                    cannotEditNumber={item.isSuggestion}
                    onClose={() => {
                      closeBottomSheet();
                    }}
                    onDelete={() => {
                      setSelectedItems(selectedItems.filter((_, i) => i !== index));
                      closeBottomSheet();
                    }}
                    onValidate={function (text) {
                      setSelectedItems(selectedItems.map((selectedItem, i) => (i === index ? text : selectedItem)));
                      closeBottomSheet();
                    }}
                    item={item}
                    initialText={item.label}
                  />
                );
              }}
              className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4"
            >
              <View className="flex-row space-x-2 flex-1">
                <View className="flex-col justify-start items-start">
                  <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-950")}>{item.name}</Text>
                  {item.phoneNumbers && item.phoneNumbers[0]?.number && (
                    <Text className={mergeClassNames(typography.textMdRegular, "text-gray-600")}>
                      {item.phoneNumbers[0].number && /^\d{10}$/.test(item.phoneNumbers[0].number)
                        ? formatPhoneNumber(item.phoneNumbers[0].number)
                        : item.phoneNumbers[0].number}
                    </Text>
                  )}
                </View>
              </View>
              <View className="pl-2 flex-col items-center justify-center">
                <PencilIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!route.params?.isEdit && (
        <CrisisNavigationButtons
          absolute={true}
          onPrevious={() => {
            navigation.goBack();
          }}
          onNext={() => {
            navigation.navigate(next, {
              initialRouteName: route.params.initialRouteName,
            });
          }}
          withArrow={true}
          showPrevious={false}
        />
      )}
      {route.params?.isEdit && (
        <NavigationButtons
          nextText="Valider"
          absolute={true}
          onNext={async () => {
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};
