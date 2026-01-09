import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { View, Text, TouchableOpacity } from "react-native";
import ArrowRight from "@assets/svg/icon/Arrow";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { Typography } from "@/components/Typography";

export default function DaySurveyBottomSheet({ navigation }) {
  const { closeBottomSheet } = useBottomSheet();
  return (
    <View className="items-center flex-col p-4 space-y-4 justify-center pb-10">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("symptoms");
          closeBottomSheet();
        }}
        className="bg-cnam-primary-50 p-4 rounded-xl w-full"
      >
        <Typography className={mergeClassNames(typography.textLgSemibold, "text-gray-900 mb-2")}>Mes indicateurs</Typography>
        <View className="flex-row items-center">
          <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left mr-2")}>
            Ajouter ou supprimer des indicateurs
          </Typography>
          <ArrowRight color={"#0084B2"} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("goals-settings");
          closeBottomSheet();
        }}
        className="bg-cnam-primary-50 p-4 rounded-xl w-full"
      >
        <Typography className={mergeClassNames(typography.textLgSemibold, "text-gray-900 mb-2")}>Mes objectifs</Typography>
        <View className="flex-row items-center">
          <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left mr-2")}>
            Ajouter ou modifier mes objectifs
          </Typography>
          <ArrowRight color={"#0084B2"} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
