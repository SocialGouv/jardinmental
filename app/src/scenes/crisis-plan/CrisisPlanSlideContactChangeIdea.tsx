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
import AsyncStorage from "@react-native-async-storage/async-storage";
import JMButton from "@/components/JMButton";
import PhoneIcon from "@assets/svg/icon/Phone";
import { CrisisContactBottomSheet } from "./CrisisContactBottomSheet";
import CrisisContactListBottomSheet from "./CrisisContactListBottomSheet";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import CrisisProgressBar from "./CrisisProgressBar";
import { CrisisAuthorizedContactBottomSheet } from "./CrisisAuthorizedContactBottomSheet";

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params: {
      isEdit: boolean;
      initialRouteName: string;
    };
  };
}

const label = "Choisissez parmi vos contacts autorisés";
const placeholder = "Renseignez un proche";
const storageKey = "@CRISIS_PLAN_CONTACT";
const next = "crisis-plan-slide-contact";
const title = "Quels proches pouvez-vous contacter pour vous changer les idées ? Et quelles activités pouvez-vous faire ensemble?";
const headerEditionBottomSheet = "Liste de contact";
export const CrisisPlanSlideContact: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const [selectedItems, setSelectedItems] = useState<
    {
      id: string;
      name: string;
      phoneNumbers: {
        digits: string;
        number: string;
        countryCode: string;
        label: string;
        id: string;
      }[];
      activities: string[];
    }[]
  >([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);

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
      <CrisisHeader
        initialRouteName={route.params?.initialRouteName}
        navigation={navigation}
        title={"Plan de protection"}
        description={"Par Hop ma liste"}
      />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <CrisisProgressBar slideIndex={3} />

        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Text>
        </View>
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8">
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-3")}>{label}</Text>
          <JMButton
            variant="outline"
            title="Rechercher parmi mes contacts"
            onPress={async () => {
              setContactsError(null);
              setLoadingContacts(true);
              try {
                const { status, accessPrivileges } = await Contacts.requestPermissionsAsync();
                if (status !== "granted") {
                  setContactsError("Permission refusée pour accéder aux contacts.");
                  setLoadingContacts(false);
                  showBottomSheet(
                    <CrisisAuthorizedContactBottomSheet
                      label={label}
                      header={headerEditionBottomSheet}
                      onClose={() => {
                        closeBottomSheet();
                      }}
                    />
                  );
                  // Alert.alert("Permission refusée", "L'accès aux contacts a été refusé.");
                  return;
                }
                const { data } = await Contacts.getContactsAsync({
                  fields: [Contacts.Fields.PhoneNumbers],
                });
                if (data.length > 0) {
                  setContacts(data);
                  setLoadingContacts(false);
                  showBottomSheet(
                    <CrisisContactListBottomSheet
                      items={data}
                      itemIdKey={"id"}
                      itemIdLabel={"name"}
                      accessPrivileges={accessPrivileges}
                      initialSelectedItems={selectedItems}
                      label={label}
                      header={headerEditionBottomSheet}
                      onClose={(
                        selected: {
                          id: string;
                          name: string;
                          phoneNumbers: {
                            digits: string;
                            number: string;
                            countryCode: string;
                            label: string;
                            id: string;
                          }[];
                        }[]
                      ) => {
                        setSelectedItems([...new Set(selected)]);
                        closeBottomSheet();
                      }}
                    />
                  );
                } else {
                  setContactsError("Aucun contact sélectionné trouvé.");
                  setLoadingContacts(false);
                  showBottomSheet(
                    <CrisisAuthorizedContactBottomSheet
                      label={label}
                      header={headerEditionBottomSheet}
                      onClose={() => {
                        closeBottomSheet();
                      }}
                    />
                  );
                }
              } catch (e) {
                setContactsError("Erreur lors de la récupération des contacts.");
                setLoadingContacts(false);
                Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des contacts.");
              }
            }}
            icon={<PhoneIcon width={20} height={20} color={TW_COLORS.GRAY_400} />}
            iconPosition="left"
          />
          {loadingContacts && (
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator size="small" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
              <Text style={{ color: TW_COLORS.CNAM_CYAN_700_DARKEN_40 }}>Chargement des contacts...</Text>
            </View>
          )}
          {contactsError && <Text style={{ color: "red", marginTop: 10 }}>{contactsError}</Text>}
        </View>
        {selectedItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                showBottomSheet(
                  <CrisisContactBottomSheet
                    label={label}
                    variant="activity"
                    placeholder={placeholder}
                    navigation={navigation}
                    header={"Edition du proche"}
                    onClose={() => {
                      closeBottomSheet();
                    }}
                    onDelete={() => {
                      setSelectedItems(selectedItems.filter((_, i) => i !== index));
                      closeBottomSheet();
                    }}
                    onValidate={function (updatedItem) {
                      setSelectedItems(selectedItems.map((selectedItem, i) => (i === index ? updatedItem : selectedItem)));
                      closeBottomSheet();
                    }}
                    item={item}
                    // initialText={item.name}
                  />
                );
              }}
              className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4"
            >
              <View className="flex-row space-x-2 flex-1">
                <View className="flex-col py-1">
                  <PhoneIcon />
                </View>
                <View className="flex-col">
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{item.name}</Text>
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{item.phoneNumbers[0].number}</Text>

                  {item.activities?.length ? (
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>{item.activities?.join(", ")}</Text>
                  ) : (
                    <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>
                      Cliquez pour ajouter une activité
                    </Text>
                  )}
                </View>
              </View>
              <View className="pl-2 flex-col items-center justify-center">
                <PencilIcon color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
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
            navigation.navigate("crisis-plan-slide-contact-help", {
              initialRouteName: route.params?.initialRouteName,
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
