import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
import NavigationButtons from "@/components/onboarding/NavigationButtons";

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params?: {
      isEdit: boolean;
      initialRouteName: string;
    };
  };
  suggestions: string[];
  label: string;
  placeholder: string;
  storageKey: string;
  title: string;
  next: string;
  labelBottomSheet: string;
  headerBottomSheet: string;
  headerEditionBottomSheet: string;
}

export const CrisisPlanSlideComponent: React.FC<ModalCorrelationScreenProps> = ({
  navigation,
  suggestions,
  label,
  placeholder,
  storageKey,
  title,
  next,
  labelBottomSheet,
  headerBottomSheet,
  headerEditionBottomSheet,
  route,
}) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>{title}</Text>
        </View>
        <CrisisPlanInputBox
          label={label}
          placeholder={placeholder}
          onPressAdd={(item) => {
            setSelectedItems([...selectedItems, item]);
          }}
          onPress={() => {
            showBottomSheet(
              <CrisisListBottomSheet
                label={labelBottomSheet}
                header={headerBottomSheet}
                onClose={(items) => {
                  setSelectedItems(items);
                  closeBottomSheet();
                }}
                initialSelectedItems={selectedItems}
                items={suggestions}
              />
            );
          }}
        />
        {selectedItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                showBottomSheet(
                  <CrisisBottomSheet
                    label={label}
                    placeholder={placeholder}
                    navigation={navigation}
                    header={headerEditionBottomSheet}
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
                    initialText={item}
                  />
                );
              }}
              className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4"
            >
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>{item}</Text>
              <PencilIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
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
