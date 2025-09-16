import React, { useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Pressable } from "react-native";
import { colors } from "../../utils/colors";
import { DiaryDataContext } from "../../context/diaryData";
import localStorage from "../../utils/localStorage";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import HelpView from "@/components/HelpView";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { InputGroupItem } from "@/components/InputGroup";
import { InputToggle } from "../../components/InputToggle";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { HELP_POSOLOGY } from "../onboarding-v2/data/helperData";
import { Drug, Posology } from "@/entities/Drug";
import { ListItem } from "@/components/SelectionnableItem";

const DrugsManagement = ({ navigation, route }) => {
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);
  const [medicalTreatment, setMedicalTreatment] = useState<Drug[]>([]);
  const [posology, setPosology] = useState<Posology[]>([]);
  const [listDrugs, setListDrugs] = useState<Drug[]>();
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const reminderToggleRef = useRef<any>();
  const [hasTreatment, setHasTreatment] = useState(!medicalTreatment || !medicalTreatment?.length);

  useEffect(() => {
    setHasTreatment(!!medicalTreatment?.length);
  }, [medicalTreatment]);

  useEffect(() => {
    (async () => {
      const list = await getDrugListWithLocalStorage();
      setListDrugs(list);
    })();
  }, [route]);

  const enrichTreatmentWithData = (list, existingDrugs) => {
    if (list) {
      const t = existingDrugs.filter((e) => !!list.find((local) => local.id === e.id));
      return t;
    }
    return null;
  };

  useEffect(() => {
    if (!listDrugs || listDrugs?.length <= 0) return;
    (async () => {
      const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
      setMedicalTreatment(enrichTreatmentWithData(medicalTreatmentStorage, listDrugs));
    })();
  }, [navigation, route, listDrugs]);

  useEffect(() => {
    getLatestValue();
  }, [medicalTreatment]);

  const getLatestValue = () => {
    const lastSurvey =
      diaryData[
        Object.keys(diaryData)
          .sort((a, b) => {
            a = a.split("/").reverse().join("");
            b = b.split("/").reverse().join("");
            return b.localeCompare(a);
          })
          .find((e) => diaryData[e]?.POSOLOGY)
      ];
    if (!lastSurvey || !medicalTreatment) return;
    setPosology(lastSurvey?.POSOLOGY.filter((e) => !!medicalTreatment.find((t) => t.id === e.id)));
  };

  const handleDelete = async (drug: Drug) => {
    const treatmentAfterDeletion = await localStorage.removeDrugFromTreatment(drug?.id);
    setMedicalTreatment(enrichTreatmentWithData(treatmentAfterDeletion, listDrugs));
  };

  const getNextText = () => {
    let nextText = "Renseigner mon traitement";
    if (medicalTreatment) {
      nextText = "Modifier mon traitement";
    }
    return nextText;
  };

  const onTreatmentUpdate = async () => {
    const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
    const updatedDrugList = await getDrugListWithLocalStorage();
    setListDrugs(updatedDrugList);
    setMedicalTreatment(enrichTreatmentWithData(medicalTreatmentStorage, updatedDrugList));
    closeBottomSheet();
  };

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={() => {
        navigation.goBack();
      }}
      title="Traitement"
      smallHeader={true}
      navigation={navigation}
      headerRightComponent={null}
      headerRightAction={() => {}}
      bottomComponent={
        <NavigationButtons
          absolute={true}
          onNext={() => {
            showBottomSheet(<DrugsBottomSheet onClose={onTreatmentUpdate} />);
          }}
          nextDisabled={!hasTreatment}
          nextText={getNextText()}
        />
      }
    >
      <View className="pt-8 mx-4">
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(<HelpView title={HELP_POSOLOGY["title"]} description={HELP_POSOLOGY["description"]} link={"médicaments.gouv.fr"} />);
          }}
          className="flex-row items-center"
        >
          <CircleQuestionMark color={TW_COLORS.GRAY_400} />
          <Text className={mergeClassNames(typography.textSmSemibold, "ml-2 text-gray-600")}>Information sur les traitements</Text>
        </TouchableOpacity>
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mt-4")}>
          La prise d'un traitement peut avoir un effet sur votre quotidien. Suivre la prise de traitement permet de mieux comprendre son effet sur
          votre état de santé mentale
        </Text>
        <View className="mb-6 mt-10">
          <Pressable onPress={() => reminderToggleRef?.current?.toggle?.()} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
            <View className="flex-row items-center justify-between">
              <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-900")}>
                {hasTreatment ? "Oui, je prends un traitement" : "Non, je n'ai pas de traitement"}
              </Text>
              <InputToggle
                ref={reminderToggleRef}
                checked={hasTreatment}
                onCheckedChanged={async ({ checked }) => {
                  setHasTreatment(checked);
                  if (!checked) {
                    await localStorage.setMedicalTreatment([]);
                  }
                }}
              />
            </View>
          </Pressable>
        </View>
        {(medicalTreatment || []).map((e, i) => {
          const drug = (posology && posology.find((i) => i.id === e.id)) || e;
          return (
            <ListItem
              key={e.id}
              id={e.id}
              label={drug?.name1}
              description={drug?.name2 ? `(${drug?.name2})` : undefined}
              selected={false}
              onPress={() => handleDelete(e)}
            />
          );
        })}
        {route?.params?.onboarding ? (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate("tabs")} style={styles.setupButton}>
              <Text style={styles.setupButtonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 19,
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
});

export default DrugsManagement;
