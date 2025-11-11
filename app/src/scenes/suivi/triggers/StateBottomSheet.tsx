import { View, Text, ScrollView, useWindowDimensions, Dimensions, TextInput, Pressable, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useEffect, useRef, useState } from "react";
import localStorage from "@/utils/localStorage";
import { Drug } from "@/entities/Drug";
import { Indicator } from "@/entities/Indicator";
import { InputToggle } from "@/components/InputToggle";
import JMButton from "@/components/JMButton";
import { LightSelectionnableItem } from "@/components/SelectionnableItem";
import { INDICATOR_LABELS, DEFAULT_INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const StatesBottomSheet = ({
  indicator,
  onClose,
  initialSelectedStates,
}: {
  indicator?: Indicator;
  initialSelectedStates?: {
    label: string;
    value: number;
  }[];
  onClose: ({
    selectedStates,
  }: {
    selectedStates: {
      label: string;
      value: number;
    }[];
  }) => void;
}) => {
  const [stateList, setStateList] = useState<
    | {
        label: string;
        value: number;
      }[]
    | null
  >(null);
  const [selectedStates, setSelectedStates] = useState<
    {
      label: string;
      value: number;
    }[]
  >(initialSelectedStates || []);

  useEffect(() => {
    const getStateList = async function () {
      let _stateList;
      if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
        _stateList = INDICATOR_LABELS[indicator.uuid];
      } else {
        _stateList = DEFAULT_INDICATOR_LABELS;
      }
      setStateList(
        _stateList.map((state, index) => ({
          label: state,
          value: index + 1,
        }))
      );
    };
    if (indicator) {
      getStateList();
    }
  }, [indicator]);

  const setToogleCheckbox = (d: { value: number; label: string }) => {
    let t = [...selectedStates];
    const drugInTreatment = selectedStates.find((elem) => elem.value === d.value);
    if (drugInTreatment) {
      const i = selectedStates.indexOf(drugInTreatment);
      t.splice(i, 1);
    } else {
      t = [d];
    }
    setSelectedStates(t);
  };

  const handleAdd = async (value) => {};

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="self-end mr-4">
          <TouchableOpacity onPress={() => {}}>
            <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-left text-cnam-primary-900")}>
            Sélectionnez un état {indicator ? `pour ${indicator.name}` : ``}
          </Text>
          <View className="flex-colum flex-1">
            {!stateList && <Text>Chargement...</Text>}
            {stateList &&
              stateList.map((e) => {
                const selected = !!selectedStates.find((state) => state.value === e.value);
                return (
                  <LightSelectionnableItem
                    key={e.value}
                    className="flex-row"
                    shape="circle"
                    id={e.value}
                    label={e.label}
                    boxPosition="top"
                    disabled={!selected && selectedStates.length >= 2}
                    selected={selected}
                    onPress={(newValue) => setToogleCheckbox(e)}
                  />
                );
              })}
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
            onClose({
              selectedStates,
            });
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
};
