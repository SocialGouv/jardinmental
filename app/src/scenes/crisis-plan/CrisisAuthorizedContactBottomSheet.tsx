import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { TW_COLORS } from "@/utils/constants";
import SettingsIcon from "@assets/svg/icon/Settings";
import { Alert, Linking } from "react-native";

export const CrisisAuthorizedContactBottomSheet = ({
  label,
  onClose,
  header,
  description,
}: {
  label: string;
  onClose: () => any;
  header: string;
  description: string;
}) => {
  return (
    <View className="flex-1 bg-[#FCFCFD]">
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: 20, backgroundColor: "#FCFCFD" }}
        showsVerticalScrollIndicator={false}
        className="bg-cnam-primary-50"
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
        <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-800 mb-2 mx-4")}>{label}</Text>
        <View className="justify-center items-center -bottom-7">
          <View className="bg-cnam-primary-100 w-[108] h-[108] rounded-full items-center justify-center">
            <SettingsIcon color={TW_COLORS.CNAM_PRIMARY_500} width={40} height={40} />
          </View>
        </View>
        <View
          className=" rounded-2xl px-6 py-8 mx-4 bg-white "
          style={{
            borderWidth: 0.5,
            borderColor: "#C1DFE6",
          }}
        >
          <Text className={(typography.textSmMedium, "text-primary-800 text-center")}>
            {description ||
              "Pour ajouter des contacts, autorisez l’application à accéder à la liste de vos contacts depuis les paramètres de votre téléphone."}
          </Text>
        </View>
        <View className="w-full py-6 px-6">
          <JMButton
            className="mb-2"
            title={"Ouvrir les paramètres"}
            onPress={async () => {
              try {
                // Check current permission status
                Linking.openSettings();
              } catch (e) {
                Alert.alert("Erreur", "Impossible d'ouvrir les paramètres. Veuillez les ouvrir manuellement.");
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
