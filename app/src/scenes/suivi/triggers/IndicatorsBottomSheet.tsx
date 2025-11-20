import { View, Text, ScrollView, Dimensions } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useEffect, useRef, useState } from "react";
import localStorage from "@/utils/localStorage";
import { Indicator } from "@/entities/Indicator";
import JMButton from "@/components/JMButton";
import { LightSelectionnableItem } from "@/components/SelectionnableItem";

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
      t = [d];
    }
    setSelectedIndicators(t);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="p-4 flex-column flex-1 gap-6">
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-left text-cnam-primary-900")}>Sélectionnez un indicateur</Text>
          <View className="flex-colum flex-1">
            {!indicatorList && <Text>Chargement...</Text>}
            {indicatorList &&
              indicatorList.map((e, index) => {
                const selected = !!selectedIndicators.find((x) => (x.uuid || x.name) === (e.uuid || e.name));
                return (
                  <LightSelectionnableItem
                    key={index}
                    className="flex-row"
                    shape="circle"
                    id={e.uuid}
                    label={e.name}
                    boxPosition="top"
                    disabled={!selected && selectedIndicators.length >= 2}
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
