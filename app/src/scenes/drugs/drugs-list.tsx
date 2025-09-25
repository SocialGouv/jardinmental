import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, TextInput, Text, TouchableOpacity, Dimensions } from "react-native";
import localStorage from "../../utils/localStorage";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import logEvents from "../../services/logEvents";
import JMButton from "@/components/JMButton";
import { LightSelectionnableItem } from "@/components/SelectionnableItem";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import PlusIcon from "@assets/svg/icon/plus";
import { Drug } from "@/entities/Drug";
import HealthIcon from "@assets/svg/icon/Health";
import { TW_COLORS } from "@/utils/constants";
const ELEMENT_HEIGHT = 55;

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const Drugs = ({ route, onClose }) => {
  const scrollRef = useRef();
  const [treatment, setTreatment] = useState<{ id: string }[]>([]);
  const [filter, setFilter] = useState();
  const [list, setList] = useState();
  const [filteredList, setFilteredList] = useState([]);
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
      t.splice(i, 1);
    } else {
      t.push({ id: d.id });
    }
    setTreatment(t);
  };

  const handleAdd = async (value) => {
    if (!value) return;
    const drug = { id: value, name1: value, values: [] };
    await localStorage.addCustomDrug(drug);
    const drugsAfterAddition = await getDrugListWithLocalStorage();
    setList(drugsAfterAddition);
    const filteredListAfterAddition = filterAndSortList(drugsAfterAddition);
    setFilteredList(filteredListAfterAddition);
    setToogleCheckbox(drug);
    setViewElementIndex(filteredListAfterAddition.map((e) => e.id).indexOf(value));
    logEvents.logDrugAdd(value);
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="self-end mr-4">
          <TouchableOpacity
            onPress={() => {
              setTreatment([]);
            }}
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2">
          <HealthIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Text className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>Traitement</Text>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
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
                  await handleAdd(filter);
                  setFilter("");
                }}
              >
                <View className="flex-row items-center mr-auto mt-2">
                  <Text className={mergeClassNames(typography.textLgMedium, "mr-2 text-cnam-primary-900")}>Ajouter "{filter}"</Text>
                  <PlusIcon />
                </View>
              </TouchableOpacity>
            )}
          </View>
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
            logEvents.logAddDrug();
            await localStorage.setMedicalTreatment(treatment);
            onClose(treatment);
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
};

export default Drugs;
