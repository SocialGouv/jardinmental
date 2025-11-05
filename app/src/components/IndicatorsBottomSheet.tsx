import { View, Text, ScrollView, useWindowDimensions, Dimensions, TextInput, Pressable, TouchableOpacity } from "react-native";
import JMButton from "./JMButton";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useEffect, useRef, useState } from "react";
import localStorage from "@/utils/localStorage";
import { Drug } from "@/entities/Drug";
import { Indicator } from "@/entities/Indicator";
import { LightSelectionnableItem } from "./SelectionnableItem";
import { InputToggle } from "./InputToggle";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const IndicatorsBottomSheet = ({
  initialSelectedIndicators,
  initialShowTreatment,
  onClose,
}: {
  initialSelectedIndicators?: Indicator[];
  initialShowTreatment?: boolean;
  onClose: ({ showTreatment, selectedIndicators }: { showTreatment: boolean; selectedIndicators: Indicator[] }) => void;
}) => {
  const [indicatorList, setindicatorList] = useState<Indicator[] | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>(initialSelectedIndicators || []);
  const [showTreatment, setShowTreatment] = useState<boolean>(initialShowTreatment || false);
  const reminderToggleRef = useRef<any>();

  useEffect(() => {
    const getIndicators = async function () {
      const indicators = await localStorage.getIndicateurs();
      setindicatorList(indicators);
    };
    getIndicators();
  }, []);

  const setToogleCheckbox = (d: Indicator) => {
    let t = [...selectedIndicators];
    const drugInTreatment = selectedIndicators.find((elem) => (elem.uuid || elem.name) === (d.uuid || d.name));
    if (drugInTreatment) {
      const i = selectedIndicators.indexOf(drugInTreatment);
      t.splice(i, 1);
    } else {
      t.push(d);
    }
    console.log(t);
    setSelectedIndicators(t);
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
            Sélectionnez <Text className={mergeClassNames(typography.displayXsBold)}>jusqu'à 2 indicateurs</Text> parmi ceux que vous suivez
          </Text>
          <View className="flex-colum flex-1">
            {!indicatorList && <Text>Chargement...</Text>}
            {indicatorList &&
              indicatorList.map((e) => {
                const selected = !!selectedIndicators.find((x) => (x.uuid || x.name) === (e.uuid || e.name));
                return (
                  <LightSelectionnableItem
                    key={e.uuid || e.name}
                    className="flex-row"
                    id={e.uuid}
                    label={e.name}
                    boxPosition="top"
                    disabled={!selected && selectedIndicators.length >= 2}
                    selected={selected}
                    onPress={(newValue) => setToogleCheckbox(e)}
                  />
                );
              })}
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-950 ml-2 my-4 underline")}>
              Ou choisissez parmis les associations fréquentes
            </Text>
            <View className="fr-col space-y-4 mt-4">
              <Text className={mergeClassNames(typography.textLgSemibold, "text-gray-800")}>Traitement</Text>
              <View className="flex-row items-center justify-between">
                <Pressable onPress={() => reminderToggleRef?.current?.toggle?.()} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
                  <InputToggle
                    ref={reminderToggleRef}
                    checked={showTreatment}
                    onCheckedChanged={async ({ checked }) => {
                      console.log("LCS TOTO 2");
                      setShowTreatment(checked);
                    }}
                  />
                </Pressable>
                <Text className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-900")}>Voir lorsque j’ai pris mon traitement</Text>
              </View>
            </View>
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
              selectedIndicators,
              showTreatment,
            });
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
};
