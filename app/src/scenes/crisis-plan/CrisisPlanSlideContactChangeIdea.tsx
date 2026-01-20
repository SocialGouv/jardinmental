import React, { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/utils/string-util";
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
import UsersIcon from "@assets/svg/icon/Users";
import User from "@assets/svg/icon/User";
import { Typography } from "@/components/Typography";

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
const title = "Quels proches pouvez-vous contacter pour vous changer les idées ? Et quelles activités pouvez-vous faire ensemble ?";
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
      <CrisisHeader initialRouteName={route.params?.initialRouteName} navigation={navigation} title={"Mon plan de crise"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        {!route.params.isEdit && <CrisisProgressBar slideIndex={3} />}

        <View className="flex-column py-4 space-y-4 px-2 rounded-2xl">
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Typography>
        </View>
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8">
          <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-3")}>{label}</Typography>
          <JMButton
            variant="outline"
            title="Rechercher parmi mes contacts"
            textClassName="text-cnam-cyan-700-darken-40"
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
                      items={data.filter((user) => user.phoneNumbers?.length)}
                      itemIdKey={"id"}
                      itemIdLabel={"name"}
                      accessPrivileges={accessPrivileges}
                      initialSelectedItems={selectedItems}
                      withSearchInput={true}
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
            icon={<UsersIcon width={20} height={20} color={TW_COLORS.GRAY_400} />}
            iconPosition="left"
          />
          {loadingContacts && (
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator size="small" color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
              <Typography style={{ color: TW_COLORS.CNAM_CYAN_700_DARKEN_40 }}>Chargement des contacts...</Typography>
            </View>
          )}
          {contactsError && <Typography style={{ color: "red", marginTop: 10 }}>{contactsError}</Typography>}
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
                    cannotEditNumber={false}
                    placeholder={placeholder}
                    navigation={navigation}
                    header={"Édition du proche"}
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
                  <User width={20} height={20} color={TW_COLORS.CNAM_PRIMARY_800} />
                </View>
                <View className="flex-col">
                  <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>{item.name}</Typography>
                  <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950")}>
                    {formatPhoneNumber(item.phoneNumbers[0].number)}
                  </Typography>

                  {item.activities?.length ? (
                    <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>
                      {item.activities?.join(", ")}
                    </Typography>
                  ) : (
                    <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>
                      Cliquez pour ajouter une activité
                    </Typography>
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
            navigation.navigate("crisis-plan-slide-sumup-list");
          }}
        />
      )}
    </View>
  );
};
