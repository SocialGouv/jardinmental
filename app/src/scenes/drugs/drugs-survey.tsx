import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { colors } from "../../utils/colors";
import { DiaryDataContext } from "../../context/diaryData";
import localStorage from "../../utils/localStorage";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import logEvents from "../../services/logEvents";
import { alertNoDataYesterday } from "../survey/survey-data";
import QuestionYesNo from "../survey/QuestionYesNo";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import HealthIcon from "@assets/svg/icon/Health";
import DrugDoseBottomSheet from "@/components/DrugDoseBottomSheet";
import Pencil from "@assets/svg/Pencil";
import { Drug, Posology } from "@/entities/Drug";

const DrugsSurvey = ({ navigation, route }) => {
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);
  const [medicalTreatment, setMedicalTreatment] = useState<Drug[]>([]);
  const [posology, setPosology] = useState<Posology[]>([]);
  const [listDrugs, setListDrugs] = useState<Drug[]>();
  const [answers, setAnswers] = useState({});
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [hasTreatment, setHasTreatment] = useState(!medicalTreatment || !medicalTreatment?.length);

  const priseDeTraitement = {
    id: "PRISE_DE_TRAITEMENT",
    label: "Avez-vous pris correctement votre traitement quotidien ?",
  };
  const priseDeTraitementSiBesoin = {
    id: "PRISE_DE_TRAITEMENT_SI_BESOIN",
    label: "Avez-vous pris un « si besoin » ?",
  };

  useEffect(() => {
    setHasTreatment(!!medicalTreatment?.length);
  }, [medicalTreatment]);

  useEffect(() => {
    (async () => {
      const list = await getDrugListWithLocalStorage();
      setListDrugs(list);
    })();
  }, [route]);

  useEffect(() => {
    if ((route?.params?.currentSurvey?.answers || {})[priseDeTraitement.id]) {
      toggleAnswer({
        key: priseDeTraitement.id,
        value: route?.params?.currentSurvey?.answers[priseDeTraitement?.id]?.value,
      });
    }
    if ((route?.params?.currentSurvey?.answers || {})[priseDeTraitementSiBesoin.id]) {
      toggleAnswer({
        key: priseDeTraitementSiBesoin.id,
        value: route?.params?.currentSurvey?.answers[priseDeTraitementSiBesoin?.id]?.value,
      });
    }
  }, [route?.params?.currentSurvey?.answers, priseDeTraitement.id, priseDeTraitementSiBesoin.id]);

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
    if (!route?.params?.editingSurvey) getLatestValue();
    else getValue();
  }, [medicalTreatment]);

  const previousQuestion = () => {
    if (route?.params?.backRedirect) {
      navigation.navigate(route?.params?.backRedirect, {
        ...route.params,
      });
    } else {
      navigation.goBack();
    }
  };

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

  const getValue = () => {
    if (!route?.params?.currentSurvey || !medicalTreatment) return;
    setPosology(route?.params?.currentSurvey?.answers?.POSOLOGY?.filter((e) => !!medicalTreatment.find((t) => t.id === e.id)) || []);
  };

  const handleDrugChange = (d, value, isFreeText) => {
    let updated = false;
    let p = posology.map((e) => {
      if (e?.id === d?.id) {
        updated = true;
        return { ...d, value, isFreeText };
      }
      return e;
    });
    if (!updated) p = [...posology, { ...d, value, isFreeText }];
    setPosology(p);
  };

  const toggleAnswer = async ({ key, value }) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], value },
      };
    });
  };

  const addDose = (drug, selectedDose) => {
    showBottomSheet(
      <DrugDoseBottomSheet
        drug={drug}
        initialSelectedDose={selectedDose}
        onClose={(dose) => {
          handleDrugChange(drug, dose, false);
          closeBottomSheet();
        }}
      />
    );
  };

  const submit = () => {
    const survey = route.params?.currentSurvey;
    const currentSurvey = {
      date: survey?.date,
      answers: {
        ...survey?.answers,
        ...answers,
        POSOLOGY: posology,
      },
    };
    addNewEntryToDiaryData(currentSurvey);
    logEvents.logInputDrugSurvey(posology?.filter((e) => e?.value)?.length);
    alertNoDataYesterday({ date: survey?.date, diaryData, navigation });
    navigation.navigate("tabs");
  };

  const onTreatmentUpdate = async () => {
    const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
    const updatedDrugList = await getDrugListWithLocalStorage();
    setListDrugs(updatedDrugList);
    console.log(medicalTreatmentStorage);
    setMedicalTreatment(enrichTreatmentWithData(medicalTreatmentStorage, updatedDrugList));
    closeBottomSheet();
  };

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={() => {
        navigation.goBack();
      }}
      category="TREATMENT"
      title="Avez-vous pris votre traitement aujourd'hui"
      navigation={navigation}
      headerRightComponent={<Pencil color={TW_COLORS.WHITE} width={16} height={16} />}
      headerRightAction={() => {
        showBottomSheet(<DrugsBottomSheet onClose={onTreatmentUpdate} />);
      }}
      bottomComponent={<NavigationButtons absolute={true} onNext={submit} nextDisabled={!hasTreatment} nextText="Valider" />}
    >
      <View className="pt-8 mx-4">
        <QuestionYesNo
          question={priseDeTraitement}
          explanation=""
          onPress={(e) => {
            toggleAnswer(e);
            logEvents.logInputDrugSurveyPriseDeTraitement();
          }}
          selected={answers[priseDeTraitement.id]?.value}
          showUserCommentInput={false}
          onChangeUserComment={() => {}}
          userComment=""
          isLast
        />
        <QuestionYesNo
          question={priseDeTraitementSiBesoin}
          explanation=""
          onPress={(e) => {
            toggleAnswer(e);
            logEvents.logInputDrugSurveyPriseDeTraitementSiBesoin();
          }}
          selected={answers[priseDeTraitementSiBesoin.id]?.value}
          showUserCommentInput={false}
          onChangeUserComment={() => {}}
          userComment=""
          isLast
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titlePosology}>
            Détail de vos traitements de la journée <Text style={styles.titlePosologyOptionnel}>(Optionnel)</Text>
          </Text>
        </View>
        {medicalTreatment.map((e, i) => {
          const res = posology.find((i) => i.id === e.id);
          return (
            <View key={e.id} className="mb-4">
              <Text className={mergeClassNames("mb-2 text-gray-800", typography.textLgMedium)}>
                {e.name1} {e.name2 ? `(${e.name2})` : ""}
              </Text>
              <TouchableOpacity onPress={() => addDose(e, res?.value)} className="border border-gray-700 bg-white rounded-xl flex-row p-4">
                <HealthIcon color={TW_COLORS.GRAY_700} width={17} height={17} />
                <Text className={mergeClassNames(typography.textMdRegular, "ml-2 text-gray-700")}>{res?.value ? res.value : "Indiquez la dose"}</Text>
              </TouchableOpacity>
            </View>
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
  titleContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
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
  titlePosology: {
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginBottom: 25,
  },
  titlePosologyOptionnel: {
    color: "#BABABA",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    marginBottom: 25,
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
});

export default DrugsSurvey;
