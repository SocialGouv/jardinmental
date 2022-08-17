import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { DiaryDataContext } from "../../../context/diaryData";
import BackButton from "../../../components/BackButton";
import localStorage from "../../../utils/localStorage";
import NoData from "./no-data";
import DrugItem from "./drug-item";
import { getDrugListWithLocalStorage } from "../../../utils/drugs-list";
import logEvents from "../../../services/logEvents";
import Logo from "../../../../assets/svg/traitement";
import { ONBOARDING_STEPS } from "../../../utils/constants";

const Drugs = ({ navigation, route }) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
  const [medicalTreatment, setMedicalTreatment] = useState();
  const [posology, setPosology] = useState([]);
  const [listDrugs, setListDrugs] = useState();

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_DRUGS);
    })();
  }, []);

  useEffect(() => {
    logEvents.logDrugsOpen();
    (async () => {
      const list = await getDrugListWithLocalStorage();
      setListDrugs(list);
    })();
  }, [route]);

  const enrichTreatmentWithData = (list) => {
    if (list) {
      const t = listDrugs.filter((e) => !!list.find((local) => local.id === e.id));
      return t;
    }
    return null;
  };

  useEffect(() => {
    if (!listDrugs || listDrugs?.length <= 0) return;
    (async () => {
      const medicalTreatmentStorage = route?.params?.treatment || (await localStorage.getMedicalTreatment());
      setMedicalTreatment(enrichTreatmentWithData(medicalTreatmentStorage));
    })();
  }, [navigation, route, listDrugs]);

  useEffect(() => {
    defaultValue();
  }, [medicalTreatment]);

  const previousQuestion = () => {
    if (route?.params?.backRedirect) {
      navigation.navigate(route?.params?.backRedirect, {
        ...route.params,
      });
    } else {
      navigation.navigate("tabs");
    }
  };

  const handleAdd = () => {
    navigation.navigate("onboarding-drugs-list");
  };

  const defaultValue = () => {
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

  const handleDelete = async (drug) => {
    const treatmentAfterDeletion = await localStorage.removeDrugFromTreatment(drug?.id);
    setMedicalTreatment(enrichTreatmentWithData(treatmentAfterDeletion));
  };

  const render = () => {
    if (!medicalTreatment || !medicalTreatment?.length) {
      return <NoData navigation={navigation} route={route} />;
    }
    return (
      <>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("onboarding-drugs-information", {
                onboarding: true,
              })
            }
          ></TouchableOpacity>
          {medicalTreatment.map((e, i) => (
            <View style={styles.drugItem}>
              <DrugItem
                key={i}
                drug={(posology && posology.find((i) => i.id === e.id)) || e}
                onChange={handleDrugChange}
                showPosology={false}
                onClose={() => handleDelete(e)}
              />
            </View>
          ))}
          <Text style={styles.addButton} onPress={handleAdd}>
            + Ajouter / Modifier mes médicaments suivis
          </Text>
          <Text style={styles.link}>Informations sur les traitements</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate("onboarding-felicitation")}
            style={styles.setupButton}
          >
            <Text style={styles.setupButtonText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerImage}>
          <Logo style={styles.image} width={80} height={80} />
        </View>
        <Text style={styles.title}>
          {medicalTreatment?.length
            ? "Voici la liste des traitements que vous allez suivre :"
            : "Souhaitez-vous renseigner vos prises de traitements quotidiennes ?"}
        </Text>
        {render()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drugItem: {
    height: 60,
  },
  containerImage: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 40,
  },
  buttonWrapper: {
    marginTop: "auto",
  },
  link: {
    color: "#181818",
    textDecorationLine: "underline",
    fontSize: 14,
    marginTop: 20,
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
    paddingHorizontal: 20,
    backgroundColor: "white",
    display: "flex",
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
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
    textAlign: "center",
  },
});

export default Drugs;
