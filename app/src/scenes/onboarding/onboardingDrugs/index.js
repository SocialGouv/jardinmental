import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { DiaryDataContext } from "../../../context/diaryData";
import localStorage from "../../../utils/localStorage";
import NoData from "./no-data";
import DrugItem from "./drug-item";
import { getDrugListWithLocalStorage } from "../../../utils/drugs-list";
import logEvents from "../../../services/logEvents";
import Logo from "../../../../assets/svg/traitement";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { onboardingStyles } from "../styles";
import { StickyButtonContainer } from "../StickyButton";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { OnboardingBackButton } from "../BackButton";

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
    navigation.navigate("onboarding-drugs-list", { onboarding: route?.params?.onboarding });
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
        <ScrollView
          style={onboardingStyles.scroll}
          contentContainerStyle={onboardingStyles.scrollContentContainer}
        >
          <View style={onboardingStyles.container}>
            <View style={onboardingStyles.imageContainer}>
              <Logo style={styles.image} width={100} height={100} />
            </View>
            <View style={onboardingStyles.containerBottom}>
              <View style={onboardingStyles.containerBottomTitle}>
                <Text style={onboardingStyles.h1}>
                  Voici la liste des traitements que vous allez suivre :
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("onboarding-drugs-information", {
                      onboarding: true,
                    })
                  }
                />
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
            </View>
          </View>
        </ScrollView>
        <StickyButtonContainer>
          <TouchableOpacity
            onPress={() => navigation.navigate("onboarding-custom-more")}
            style={styles.setupButton}
          >
            <Text style={styles.setupButtonText}>Suivant</Text>
          </TouchableOpacity>
        </StickyButtonContainer>
      </>
    );
  };

  return (
    <SafeAreaViewWithOptionalHeader style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <OnboardingBackButton onPress={navigation.goBack} />
      </View>
      {render()}
    </SafeAreaViewWithOptionalHeader>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 10,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1f2937",
  },
});

const styles = StyleSheet.create({
  drugItem: {
    height: 60,
  },
  containerImage: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginVertical: 20,
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
    //marginTop: 15,
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 19,
  },
  scrollView: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContainer: { flexGrow: 1 },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  safe: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    paddingHorizontal: 20,
    color: colors.BLUE,
    fontSize: 18,
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
