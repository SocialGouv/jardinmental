import { TW_COLORS } from "@/utils/constants";
import Health from "@assets/svg/icon/Health";
import { View, Text } from "react-native";
import JMButton from "./JMButton";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { useEffect, useState } from "react";
import Drugs from "@/scenes/drugs/list";
import { TouchableOpacity } from "react-native-gesture-handler";
import HelpText from "./HelpText";
import HelpView from "./HelpView";
import { useBottomSheet } from "@/context/BottomSheetContext";

export const DrugsBottomSheet = ({ title, description, onClose }) => {
  const [index, setIndex] = useState<number>(0);
  const { showBottomSheet } = useBottomSheet();
  const [treatment, setTreatment] = useState<any[] | undefined>();

  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
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
    <View className="flex-1 bg-white px-0">
      {index === 0 && (
        <View>
          <View>
            <View className={`flex-row items-center p-4 px-0 pb-6`}>
              <View className="rounded-full border-[1.5px] border-cnam-primary-800 bg-white w-10 h-10 items-center justify-center">
                <Health />
              </View>
            </View>
          </View>
          <Text className={mergeClassNames(typography.textLgBold, "text-xl mb-4 text-cnam-primary-950")}>Prenez-vous un traitement ?</Text>
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <HelpView
                  title={"Information sur les traitements"}
                  description={`Les noms des médicaments et les posologies ne sont donnés qu'à titre indicatif pour vous aider dans le suivi de votre traitement médicamenteux.\n 
Il convient néanmoins de toujours se référer à la prescription médicale vous concernant et à votre médecin référent pour tout ce qui a trait à votre traitement médicamenteux en particulier et à votre suivi en général.\n
Voir plus d'informations sur les traitements médicamenteux :\n`}
                  link={"médicaments.gouv.fr"}
                />
              );
            }}
            className="flex-row items-center"
          >
            <CircleQuestionMark color={TW_COLORS.GRAY_400} />
            <Text className={mergeClassNames(typography.textSmSemibold, "ml-2 text-gray-600")}>Information sur les traitements</Text>
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
          <JMButton onPress={handleNoTreatment} title="Non je n'ai pas de traitement" className="mt-4" />
          <JMButton onPress={handleNoTreatment} variant="text" title="Je le ferai plus tard" className="mt-4" />
        </View>
      )}
      {index === 1 && <Drugs navigation={{ goBack: () => {} }} route={undefined} onClose={onClose} />}
    </View>
  );
};

export const DrugItemSelecion = ({}) => {};
