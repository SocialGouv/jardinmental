import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import LifeBuoy from "@assets/svg/icon/Lifebuoy";
import CrisisHeader from "./CrisisHeader";
import JMButton from "@/components/JMButton";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { InputText } from "@/components/InputText";
import PlusIcon from "@assets/svg/icon/plus";
import SimplePlus from "@assets/svg/icon/SimplePlus";
import { StringWithAutocomplete } from "@testing-library/react-native/build/types";
import PencilIcon from "@assets/svg/icon/Pencil";
import CrisisNavigationButtons from "./CrisisNavigationButtons";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const dataInfo = [
  "Vos signes d’alerte.",
  "Des actions à faire seul(e) pour vous apaiser.",
  "Des proches à appeler pour vous changer les idées et des activités à faire ensemble.",
  "Des proches à contacter pour recevoir de l’aide.",
  "Des professionnels ou numéros utiles.",
  "Des actions pour sécuriser votre environnement.",
  "Vos raisons de vivre.",
];

export const CrisisPlanSlideAlert: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const elements = [{ value: "je rumine" }, { value: "je rumine" }];
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <CrisisHeader navigation={navigation} title={"Ma liste de secours"} description={"Par Hop ma liste"} />
      <ScrollView
        className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      >
        <View className="flex-column py-4 space-y-4 px-4 rounded-2xl">
          <Text className={mergeClassNames(typography.textLgSemibold, "text-primary-900")}>
            Quels signes d’alertes sont annonciateurs d’idées suicidaires pour vous ?
          </Text>
        </View>
        <CrisisPlanInputBox label={"Renseignez un signe d’alerte :"} placeholder="Rédiger une note sur cet élément" />
        {elements.map((item) => {
          return (
            <View className="bg-gray-200 border-gray-300 rounded-2xl flex-row items-center justify-between p-4">
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>{item.value}</Text>
              <PencilIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
            </View>
          );
        })}
      </ScrollView>
      <CrisisNavigationButtons absolute={true} onNext={() => {}} withArrow={true} showPrevious={false} />
    </View>
  );
};

export const CrisisPlanInputBox = ({ placeholder, label }: { placeholder: string; label: string }) => {
  return (
    <View className="bg-cnam-primary-50 rounded-2xl px-6 py-8">
      <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>{label}</Text>
      <View className="flex-row items-center space-x-2">
        <InputText
          containerStyle={{
            flexGrow: 1,
          }}
          placeholder={placeholder}
          value={"text"}
          onChangeText={(nextComment) => {}}
          multiline={true}
          textAlignVertical="top"
        />
        <TouchableOpacity className="h-12 w-12 bg-primary-800 rounded-2xl items-center justify-center">
          <SimplePlus color={TW_COLORS.CNAM_PRIMARY_25} />
        </TouchableOpacity>
      </View>
      <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40 underline mt-8")}>Choisir parmi les suggestions</Text>
    </View>
  );
};
