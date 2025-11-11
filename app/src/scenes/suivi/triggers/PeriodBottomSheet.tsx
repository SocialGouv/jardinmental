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

enum RangeDate {
  "lastDays7" = "lastDays7",
  "lastDays14" = "lastDays14",
  "lastDays30" = "lastDays30",
  "fromBeginning" = "fromBeginning",
  "custom" = "custom",
}

export const PeriodBottomSheet = ({
  onClose,
  initialSelectedPeriod,
}: {
  initialSelectedPeriod?: { value: RangeDate; label: string };
  onClose: ({ selectedPeriod }: { selectedPeriod: { value: RangeDate; label: string } | undefined }) => void;
}) => {
  const [periodList] = useState<{ value: RangeDate; label: string }[]>([
    { label: "7 derniers jours", value: RangeDate.lastDays7 },
    { label: "14 derniers jours", value: RangeDate.lastDays14 },
    { label: "30 derniers jours", value: RangeDate.lastDays30 },
    { label: "Depuis le début", value: RangeDate.fromBeginning },
    { label: "Choisir la période", value: RangeDate.custom },
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState<{ value: RangeDate; label: string } | undefined>(initialSelectedPeriod);

  const setToogleCheckbox = (d: { label: string; value: RangeDate }) => {
    setSelectedPeriod(d);
  };

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
          <Text className={mergeClassNames(typography.displayXsSemibold, "text-left text-cnam-primary-900")}>Sélectionnez une période</Text>
          <View className="flex-colum flex-1">
            {!periodList && <Text>Chargement...</Text>}
            {periodList &&
              periodList.map((period) => {
                const selected = !!selectedPeriod && selectedPeriod.value === period.value;
                return (
                  <LightSelectionnableItem
                    key={period.value}
                    className="flex-row"
                    shape="circle"
                    id={period.value}
                    label={period.label}
                    boxPosition="top"
                    selected={selected}
                    onPress={(newValue) => setToogleCheckbox(period)}
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
              selectedPeriod,
            });
          }}
          title={"Valider la sélection"}
        />
      </View>
    </View>
  );
};
