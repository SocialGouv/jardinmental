import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { InputText } from "@/components/InputText";
import { TW_COLORS } from "@/utils/constants";
import { useState } from "react";
import PhoneIcon from "@assets/svg/icon/Phone";
import CrisisListBottomSheet from "./CrisisListBottomSheet";
import PlusIcon from "@assets/svg/icon/plus";
import TrashIcon from "@assets/svg/icon/Trash";
import { LinearGradient } from "expo-linear-gradient";
import User from "@assets/svg/icon/User";

const suggestions = ["Aller au cinéma", "Aller au restaurant", "Faire du shopping", "Faire une promenade"];
const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const CrisisContactBottomSheet = ({
  navigation,
  label,
  placeholder,
  onClose,
  item,
  initialText,
  onDelete,
  onValidate,
  header,
  variant,
  deleteLabel,
  cannotEditNumber,
}: {
  navigation: any;
  item: {
    id: string;
    name: string;
    activities: string[];
    deleteLabel?: string;
    phoneNumbers: {
      digits: string;
      number: string;
      countryCode: string;
      label: string;
      id: string;
    }[];
  };
  label: string;
  placeholder: string;
  deleteLabel?: string;
  onClose: () => any;
  initialText: string;
  onDelete: () => void;
  variant: "activity" | "standart";
  onValidate: (item: {
    id: string;
    name: string;
    activities: string[];
    phoneNumbers: {
      digits: string;
      number: string;
      countryCode: string;
      label: string;
      id: string;
    }[];
  }) => void;
  header: string;
  camnotEditNumber?: boolean;
}) => {
  const [text, setText] = useState<string>();
  const [activities, setActivities] = useState<string[]>(item.activities || []);
  const [number, setNumber] = useState<string>(item.phoneNumbers[0].digits);
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{
          height: variant === "activity" ? height90vh : undefined,
        }}
      >
        <View className="self-end mr-4">
          <TouchableOpacity
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
        <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8 mx-4 flex-column">
          <View className="flex-row items-center flex-start space-x-2 mb-2">
            <User width={20} height={20} color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>{item.name}</Text>
          </View>
          {cannotEditNumber && (
            <View className="flex-column flex-start space-y-1 mb-4">
              <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Numéro de téléphone</Text>
              <InputText
                containerStyle={{
                  flexGrow: 1,
                }}
                keyboardType="numeric"
                placeholder={"06 39 98 90 60"}
                value={number}
                onChangeText={(inputText) => {
                  setNumber(inputText);
                }}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          )}
          {variant === "activity" && (
            <>
              <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>Renseignez une activité à faire ensemble</Text>
              <View className="flex-column space-y-1">
                <View className="flex-row items-center space-x-2">
                  <InputText
                    containerStyle={{
                      flexGrow: 1,
                    }}
                    placeholder={"Ex: Aller au restaurant"}
                    value={text}
                    onChangeText={(inputText) => {
                      setText(inputText);
                    }}
                    multiline={true}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    disabled={!text || text.length === 0}
                    hitSlop={{
                      top: 20,
                      left: 20,
                      right: 40,
                      bottom: 20,
                    }}
                    onPress={() => {
                      setActivities([...activities, text]);
                      setText();
                    }}
                  >
                    <PlusIcon color={!text || text.length === 0 ? TW_COLORS.GRAY_600 : TW_COLORS.CNAM_PRIMARY_900} />
                  </TouchableOpacity>
                </View>
                {activities.map((activity, index) => (
                  <View className="flex-row items-center space-x-2" key={index}>
                    <InputText
                      containerStyle={{
                        flexGrow: 1,
                      }}
                      placeholder={"Ex: Aller au restaurant"}
                      value={activities[index]}
                      onChangeText={(inputText) => {
                        setActivities(activities.map((act, i) => (i === index ? inputText : act)));
                      }}
                      multiline={true}
                      textAlignVertical="top"
                    />
                    {(index !== 0 || (index == 0 && activities.length > 1) || !!activity) && (
                      <TouchableOpacity
                        onPress={() => {
                          const newActivities = activities.filter((_, i) => i !== index);
                          setActivities(newActivities);
                        }}
                      >
                        <TrashIcon color={TW_COLORS.CNAM_PRIMARY_900} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  showBottomSheet(
                    <CrisisListBottomSheet
                      label={"Choisissez parmi les suggestions"}
                      header={"Activités"}
                      onClose={(suggestedActivities) => {
                        showBottomSheet(
                          <CrisisContactBottomSheet
                            navigation={navigation}
                            variant="activity"
                            item={{
                              ...item,
                              activities: [...new Set([...activities, ...suggestedActivities])],
                            }}
                            label={label}
                            placeholder={placeholder}
                            onClose={onClose}
                            initialText={""}
                            onDelete={onDelete}
                            onValidate={onValidate}
                            header={header}
                          />
                        );
                      }}
                      initialSelectedItems={activities}
                      items={suggestions}
                    />
                  );
                }}
              >
                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-4")}>
                  Choisir parmi les suggestions
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        className={`p-6 px-4 pb-5`}
        locations={[0, 0.3]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View className="py-6">
          {cannotEditNumber && variant !== "activity" && (
            <JMButton
              onPress={() => {
                const updatedValue = {
                  ...item,
                  id: number,
                  phoneNumbers: [
                    {
                      ...item.phoneNumbers[0],
                      digits: number,
                      number,
                    },
                    ...item.phoneNumbers.filter((_, index) => index !== 0),
                  ],
                };
                if (variant === "activity") {
                  updatedValue["activities"] = [...activities.filter((activity) => !!activity)];
                }
                onValidate(updatedValue);
              }}
              title={"Valider"}
              className="mb-4"
            />
          )}
          <JMButton
            onPress={() => {
              onDelete();
            }}
            variant="text"
            textClassName="text-cnam-bisque-600-Lighten-20 underline"
            title={deleteLabel || "Supprimer ce proche"}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
