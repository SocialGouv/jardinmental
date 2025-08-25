import React, { useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../utils/colors";
import { DiaryDataContext } from "../../context/diaryData";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import localStorage from "../../utils/localStorage";
import NoData from "./no-data";
import DrugItem from "./drug-item";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import logEvents from "../../services/logEvents";
import { alertNoDataYesterday } from "../survey/survey-data";
import Logo from "../../../assets/svg/drugs";
import QuestionYesNo from "../survey/QuestionYesNo";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import HelpView from "@/components/HelpView";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { InputGroupItem } from "@/components/InputGroup";
import { InputToggle } from "@/components/InputToggle";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import HealthIcon from "@assets/svg/icon/Health";
import DrugDoseBottomSheet from "@/components/DrugDoseBottomSheet";
import { HELP_POSOLOGY } from "../onboarding-v2/data/helperData";
import Pencil from "@assets/svg/Pencil";
import { Drug, Posology } from "@/entities/Drug";
import { ListItem } from "@/components/SelectionnableItem";

const Drugs = ({ navigation, route }) => {
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);
  const [medicalTreatment, setMedicalTreatment] = useState<Drug[]>([]);
  const [posology, setPosology] = useState<Posology[]>([]);
  const [inSurvey, setInSurvey] = useState(false);
  const [listDrugs, setListDrugs] = useState<Drug[]>();
  const [answers, setAnswers] = useState({});
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const reminderToggleRef = useRef();
  const [hasTreatment, setHasTreatment] = useState(!medicalTreatment || !medicalTreatment?.length);

  const priseDeTraitement = {
    id: "PRISE_DE_TRAITEMENT",
    label: "Avez-vous pris correctement votre traitement quotidien ?",
  };
  const priseDeTraitementSiBesoin = {
    id: "PRISE_DE_TRAITEMENT_SI_BESOIN",
    label: "Avez-vous pris un “si besoin” ?",
  };

  useEffect(() => {
    setHasTreatment(!!medicalTreatment?.length);
  }, [medicalTreatment]);

  useEffect(() => {
    setInSurvey(!!route?.params?.currentSurvey);
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

  const handleDelete = async (drug: Drug) => {
    const treatmentAfterDeletion = await localStorage.removeDrugFromTreatment(drug?.id);
    setMedicalTreatment(enrichTreatmentWithData(treatmentAfterDeletion, listDrugs));
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

  const render = () => {
    // if (!medicalTreatment || !medicalTreatment?.length) {
    //   return <NoData navigation={navigation} route={route} />;
    // }
    return (
      <View className="pt-8 mx-4">
        {inSurvey ? (
          <>
            <QuestionYesNo
              question={priseDeTraitement}
              onPress={(e) => {
                toggleAnswer(e);
                logEvents.logInputDrugSurveyPriseDeTraitement();
              }}
              selected={answers[priseDeTraitement.id]?.value}
              showUserCommentInput={false}
              isLast
            />
            <QuestionYesNo
              question={priseDeTraitementSiBesoin}
              onPress={(e) => {
                toggleAnswer(e);
                logEvents.logInputDrugSurveyPriseDeTraitementSiBesoin();
              }}
              selected={answers[priseDeTraitementSiBesoin.id]?.value}
              showUserCommentInput={false}
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
                <View className="mb-4">
                  <Text className={mergeClassNames("mb-2 text-gray-800", typography.textLgMedium)}>
                    {e.name1} {e.name2 ? `(${e.name2})` : ""}
                  </Text>
                  <TouchableOpacity onPress={() => addDose(e, res?.value)} className="border border-gray-700 bg-white rounded-xl flex-row p-4">
                    <HealthIcon color={TW_COLORS.GRAY_700} width={17} height={17} />
                    <Text className={mergeClassNames(typography.textMdRegular, "ml-2 text-gray-700")}>
                      {res?.value ? res.value : "Indiquez la dose"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        ) : null}
        {!inSurvey && (
          <>
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
              La prise d’un traitement peut avoir un effet sur votre quotidien. Suivre la prise de traitement permet de mieux comprendre son effet sur
              votre état de santé mentale
            </Text>
            <View className="my-2">
              <InputGroupItem
                label={hasTreatment ? "Oui, je prends un traitement" : "Non, je n’ai pas de traitement"}
                onPress={() => reminderToggleRef?.current?.toggle?.()}
              >
                <InputToggle
                  ref={reminderToggleRef}
                  checked={hasTreatment}
                  onCheckedChanged={({ checked }) => {
                    setHasTreatment(checked);
                  }}
                />
              </InputGroupItem>
            </View>
            {medicalTreatment.map((e, i) => {
              const drug = (posology && posology.find((i) => i.id === e.id)) || e;
              return (
                <ListItem
                  id={e.id}
                  label={drug?.name1}
                  description={drug?.name2 ? `(${drug?.name2})` : undefined}
                  selected={false}
                  onPress={() => handleDelete(e)}
                />
              );
            })}
          </>
        )}

        {/* <Text style={styles.addButton} onPress={handleAdd}>
          + Ajouter / Modifier mes médicaments suivis
        </Text> */}
        {/* // if its onboarding, show button 'commencer' */}
        {route?.params?.onboarding ? (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate("tabs")} style={styles.setupButton}>
              <Text style={styles.setupButtonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const submit = () => {
    if (inSurvey) {
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
    }

    navigation.navigate("tabs");
  };

  const getNextText = () => {
    let nextText = "Renseigner mon traitement";
    if (inSurvey) {
      nextText = "Valider";
    } else if (medicalTreatment) {
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
      category="TREATMENT"
      title={inSurvey ? "Avez-vous pris votre traitement aujourd'hui" : "Traitement"}
      navigation={navigation}
      headerRightComponent={inSurvey ? <Pencil color={TW_COLORS.WHITE} width={16} height={16} /> : null}
      headerRightAction={() => {
        showBottomSheet(<DrugsBottomSheet navigation={navigation} onClose={onTreatmentUpdate} />);
      }}
      bottomComponent={
        <NavigationButtons
          onNext={() => {
            if (inSurvey) {
              submit();
            } else {
              showBottomSheet(<DrugsBottomSheet navigation={navigation} onClose={onTreatmentUpdate} />);
            }
          }}
          nextDisabled={!hasTreatment}
          nextText={getNextText()}
        />
      }
    >
      {render()}
      {/* {inSurvey ? (
        <View style={styles.buttonWrapper}>
          <Button onPress={submit} title="Valider" />
        </View>
      ) : null} */}
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 30,
    width: "50%",
    alignSelf: "center",
  },

  link: {
    color: "#181818",
    textDecorationLine: "underline",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "300",
    textAlign: "center",
  },
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
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
  scrollView: {
    padding: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
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
  subtitle: {
    color: "#000",
    fontSize: 15,
    marginBottom: 15,
    fontWeight: "300",
  },
  bold: {
    fontWeight: "500",
  },
  addButton: {
    color: colors.BLUE,
    textDecorationLine: "underline",
    fontWeight: "600",
    marginTop: 15,
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
});

export default Drugs;
