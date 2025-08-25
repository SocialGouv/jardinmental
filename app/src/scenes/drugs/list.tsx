import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, TextInput, Keyboard, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../utils/colors";
import Button from "../../components/Button";
import localStorage from "../../utils/localStorage";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import CheckBox from "@react-native-community/checkbox";
import NPS from "../../services/NPS/NPS";
import BackButton from "../../components/BackButton";
import AddElemToList from "../../components/AddElemToList";
import { confirm } from "../../utils";
import logEvents from "../../services/logEvents";
import JMButton from "@/components/JMButton";
import { LightSelectionnableItem } from "@/components/SelectionnableItem";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import PlusIcon from "@assets/svg/icon/plus";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { Drug } from "@/entities/Drug";
const ELEMENT_HEIGHT = 55;

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const Drugs = ({ navigation, route, onClose }) => {
  const scrollRef = useRef();
  const [treatment, setTreatment] = useState<{ id: string }[]>([]);
  const [filter, setFilter] = useState();
  const [list, setList] = useState();
  const [filteredList, setFilteredList] = useState([]);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [bufferCustomDrugs, setBufferCustomDrugs] = useState();
  const [viewElementIndex, setViewElementIndex] = useState();

  useEffect(() => {
    (async () => {
      const treatmentStorage = await localStorage.getMedicalTreatment();
      if (treatmentStorage) {
        setTreatment(treatmentStorage);
      }
    })();
  }, []);

  useEffect(() => {
    if (!viewElementIndex) return;
    scrollRef.current?.scrollTo({
      y: viewElementIndex * ELEMENT_HEIGHT,
      animated: true,
    });
  }, [viewElementIndex]);

  const cleanString = (s) => {
    let r = s
      ?.replace(/\s*/g, "")
      .replace(/é/g, "e")
      .replace(/è/g, "e")
      .replace(/(\(|\)|\||\^|\$)/g, "\\$1")
      .toLowerCase();
    return r;
  };

  useEffect(() => {
    (async () => {
      const l = await getDrugListWithLocalStorage();
      setList(l);
    })();
  }, []);

  useEffect(() => {
    const newDrug = route?.params?.newDrug;
    if (newDrug) {
      setList((l) => [newDrug, ...l]);
    }
  }, [route]);

  useEffect(() => {
    setFilteredList(filterAndSortList(list) || []);
  }, [filter, list]);

  const filterAndSortList = (list) =>
    list
      ?.sort((a, b) => cleanString(a.name1) > cleanString(b.name1))
      .filter((e) => {
        const r = new RegExp(cleanString(filter), "gi");
        return r.test(cleanString(e.id));
      });

  const setToogleCheckbox = (d: Drug) => {
    let t = [...treatment];
    const drugInTreatment = treatment.find((elem) => elem.id === d.id);
    if (drugInTreatment) {
      const i = treatment.indexOf(drugInTreatment);
      console.log("index i", i);
      t.splice(i, 1);
    } else {
      t.push({ id: d.id });
    }
    setTreatment(t);
  };

  // const handleSubmit = () => {
  //   //if there is something in the buffer, alert the user ...
  //   if (bufferCustomDrugs)
  //     return confirm({
  //       title: "Êtes-vous sûr de vouloir valider cette sélection ?",
  //       message: `Il semblerait que vous n'avez pas correctement ajouter votre traitement personnalisé "${bufferCustomDrugs}"`,
  //       onConfirm: submit,
  //       onCancel: () => {
  //         scrollRef.current?.scrollTo({
  //           y: 0,
  //           animated: true,
  //         });
  //       },
  //       cancelText: "Retourner à la liste",
  //       confirmText: "Oui, valider quand même",
  //     });
  //   //... else, submit the treatment
  //   else submit();
  // };

  const submit = async () => {
    await localStorage.setMedicalTreatment(treatment);
    navigation.navigate("drugs", { treatment });
  };

  const handleAdd = async (value) => {
    console.log("add drug", value);
    if (!value) return;
    const drug = { id: value, name1: value, values: [] };
    await localStorage.addCustomDrug(drug);
    const drugsAfterAddition = await getDrugListWithLocalStorage();
    const filteredListAfterAddition = filterAndSortList(drugsAfterAddition);
    setFilteredList(filteredListAfterAddition);
    setToogleCheckbox(drug, true);
    setViewElementIndex(filteredListAfterAddition.map((e) => e.id).indexOf(value));
    logEvents.logDrugAdd(value);
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="gap-6"
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900")}>Sélectionnez un ou plusieurs éléments</Text>
        <TextInput
          onChangeText={(text) => {
            setFilter(text);
          }}
          className={mergeClassNames(typography.textMdRegular, "text-left border border-gray-300 p-2 rounded rounded-lg")}
          placeholder="Rechercher ou ajouter un élément"
        />
        <View className="flex-colum flex-1">
          {filteredList.map((e) => {
            return (
              <LightSelectionnableItem
                key={e.id}
                className="flex-row"
                id={e.id}
                label={e.name1}
                boxPosition="top"
                description={e.name2 ? `(${e.name2})` : undefined}
                selected={!!treatment.find((x) => x.id === e.id)}
                onPress={(newValue) => setToogleCheckbox(e)}
              />
            );
          })}
          {!filteredList.length && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800")}>Pas de résultat</Text>}
          {!!filter && !filteredList.length && (
            <TouchableOpacity
              onPress={async () => {
                // await handleAdd(filter);
                // setFilter("");
              }}
            >
              <View className="flex-row items-center mr-auto mt-2">
                <Text className={mergeClassNames(typography.textLgMedium, "mr-2 text-cnam-primary-900")}>Ajouter "{filter}"</Text>
                <PlusIcon />
              </View>
            </TouchableOpacity>
          )}
          {/* {editingIndicators.map((text, index) => (
            <InputSelectionnableItem label={"Nommez le produit ou l’addiction :"} onPress={(text: string) => createNewIndicator(text, index)} />
          ))}
          {!filter && (
            <View className="flex-row items-center mt-2 ml-auto">
              <TouchableOpacity
                onPress={() => {
                  setEditingIndicators((editingIndicators) => [...editingIndicators, ""]);
                }}
              >
                <View className="flex-row items-center">
                  <Text className={mergeClassNames(typography.textMdMedium, "mr-2 text-cnam-primary-900")}>ajouter un élément</Text>
                  <PlusIcon />
                </View>
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`flex-column justify-between items-center p-6 px-6 bg-white/90 pb-10 w-full`}
      >
        <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 mb-2")}>Vous pourrez modifier cette sélection plus tard</Text>
        <JMButton
          onPress={async () => {
            await localStorage.setMedicalTreatment(treatment);
            onClose(treatment);
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelAddDrug: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  plusIcon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "300",
    margin: -10,
    marginRight: 10,
  },
  addDrug: {
    backgroundColor: colors.LIGHT_BLUE,
    color: "#fff",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0A215C",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  filter: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: "#EDEDED",
    backgroundColor: "#fff",
    color: "black",
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  backButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    width: "20%",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 10,
  },
  drug: {
    backgroundColor: "#26387c12",
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 55,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text1: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  text2: {
    color: colors.BLUE,
    fontSize: 13,
    fontWeight: "400",
    fontStyle: "italic",
  },
  checkbox: {
    marginHorizontal: 10,
  },
  noResult: {
    color: "#a3a3a3",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Drugs;
