import { TW_COLORS } from "@/utils/constants";
import Health from "@assets/svg/icon/Health";
import { View, Text, ScrollView, useWindowDimensions, Dimensions } from "react-native";
import JMButton from "./JMButton";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { useEffect, useState } from "react";
import Drugs from "@/scenes/drugs/drugs-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import HelpView from "./HelpView";
import { useBottomSheet } from "@/context/BottomSheetContext";
import localStorage from "@/utils/localStorage";
import { HELP_POSOLOGY } from "@/scenes/onboarding-v2/data/helperData";
import { Drug } from "@/entities/Drug";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const DrugsBottomSheet = ({ onClose }: { onClose: (treatment?: Drug[]) => void }) => {
  const [index, setIndex] = useState<number>(0);
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [treatment, setTreatment] = useState<any[] | undefined>();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // wrapper: View en portrait, ScrollView en paysage
  const ContentWrapper = isLandscape ? ScrollView : View;

  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    onClose([]);
  };

  const handleLater = async () => {
    onClose();
  };

  useEffect(() => {
    const loadTreatment = async () => {
      const _treatment = await localStorage.getMedicalTreatment();
      if (_treatment) {
        setTreatment(_treatment);
        setIndex(1);
      }
    };

    loadTreatment();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {index === 0 && (
        <ContentWrapper
          contentContainerStyle={isLandscape ? { paddingBottom: 100 } : null}
          showsVerticalScrollIndicator={false}
          className="px-4"
          style={isLandscape ? { paddingVertical: 20, height: height90vh } : null}
        >
          <View className="flex-row items-center p-4 px-0 pb-6">
            <View className="rounded-full border-[1.5px] border-cnam-primary-800 bg-white w-10 h-10 items-center justify-center">
              <Health />
            </View>
          </View>

          <Text className={mergeClassNames(typography.textLgBold, "text-xl mb-4 text-cnam-primary-950")}>Prenez-vous un traitement ?</Text>

          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <HelpView title={HELP_POSOLOGY["title"]} description={HELP_POSOLOGY["description"]} link={"https://medicaments.gouv.fr"} />
              );
            }}
            className="flex-row items-center"
          >
            <CircleQuestionMark color={TW_COLORS.GRAY_400} />
            <Text className={mergeClassNames(typography.textSmSemibold, "ml-2 text-gray-700")}>Information sur les traitements</Text>
          </TouchableOpacity>

          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>
            La prise d’un traitement peut avoir un effet sur votre quotidien. Suivre la prise de traitement permet de mieux comprendre son effet sur
            votre état de santé mentale
          </Text>

          <JMButton
            onPress={() => setIndex(1)}
            title="Oui, j’ai un traitement"
            icon={<ArrowIcon color="white" />}
            iconPosition="right"
            className="mt-20"
          />
          <JMButton onPress={handleNoTreatment} title="Non, je n'ai pas de traitement" className="mt-4" />
          <JMButton onPress={handleLater} variant="text" title="Je le ferai plus tard" className="mt-4" />
        </ContentWrapper>
      )}

      {index === 1 && <Drugs navigation={{ goBack: () => {} }} route={undefined} onClose={onClose} />}
    </View>
  );
};
