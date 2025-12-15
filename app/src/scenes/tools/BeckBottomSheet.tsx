import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Drug } from "@/entities/Drug";
import JMButton from "@/components/JMButton";
import { ToolItemEntity } from "./toolsData";
import DownloadIcon from "@assets/svg/icon/Download";
import EyeIcon from "@assets/svg/icon/Eye";
import { useBottomSheet } from "@/context/BottomSheetContext";

const screenHeight = Dimensions.get("window").height;

export const BeckBottomSheet = ({ navigation }: { navigation: any }) => {
  const { closeBottomSheet } = useBottomSheet();
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{
            paddingVertical: 20,
          }}
        >
          <View className="flex-row justify-between items-center px-4">
            <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-900")}>À propos des outils</Text>
          </View>
          <View className="p-4 flex-column">
            <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900")}>
              Retrouvez l’exercice “Beck” dans vos favoris
            </Text>
          </View>
          <View className="p-4 flex-column flex-1">
            <Text className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-900")}>
              L’exercice “Colonnes de Beck” est déplacé dans les Outils, dans la catégorie Émotions. Il a été ajouté automatiquement à vos Favoris
              pour que vous puissiez le retrouver simplement.{" "}
            </Text>
          </View>
          <View className="w-full py-6 px-6">
            <JMButton
              onPress={() => {
                closeBottomSheet();
                navigation.navigate("tabs", {
                  initialTab: "tools",
                  themeFilter: "Favoris",
                });
              }}
              className="mb-2"
              title={"Voir mes favoris"}
            />
            <JMButton
              onPress={() => {
                closeBottomSheet();
              }}
              variant="outline"
              title={"J'ai compris"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
