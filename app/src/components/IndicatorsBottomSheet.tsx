import { View, Text, ScrollView, useWindowDimensions, FlatList, Dimensions, TextInput, Pressable, TouchableOpacity } from "react-native";
import JMButton from "./JMButton";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useEffect, useMemo, useRef, useState } from "react";
import localStorage from "@/utils/localStorage";
import { Drug } from "@/entities/Drug";
import { Indicator } from "@/entities/Indicator";
import { LightSelectionnableItem } from "./SelectionnableItem";
import { InputToggle } from "./InputToggle";
import logEvents from "@/services/logEvents";
import { INDICATORS_COUPLES, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";
import Other from "@assets/svg/icon/Other";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import ChevronIcon from "@assets/svg/icon/chevron";
import { TW_COLORS } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "./Typography";

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
  const itemWidths = useRef<number[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  const getOffsetForIndex = (index: number) => {
    return itemWidths.current.slice(0, index).reduce((acc, w) => acc + w, 0);
  };

  const scrollToIndex = (index: number) => {
    const offset = getOffsetForIndex(index);

    flatListRef.current?.scrollToOffset({
      offset,
      animated: true,
    });

    currentIndex.current = index;
  };

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
    setSelectedIndicators(t);
  };

  const isIndicatorOrSameCategory = (indicator: Indicator, indicatorFromCouple: Indicator | NEW_INDICATORS_CATEGORIES) => {
    if (Object.values(NEW_INDICATORS_CATEGORIES).includes(indicatorFromCouple as NEW_INDICATORS_CATEGORIES)) {
      return indicator.mainCategory === indicatorFromCouple;
    } else {
      const indicatorUuid = indicator.baseIndicatorUuid || indicator.uuid;
      const indicatorCoupleUuid = indicatorFromCouple?.baseIndicatorUuid || indicatorFromCouple?.uuid;
      return indicatorUuid === indicatorCoupleUuid;
    }
  };

  const isSameCouple = (coupleA: [Indicator, Indicator], coupleB: [Indicator, Indicator]) => {
    return (
      (coupleA[0].uuid === coupleB[0].uuid && coupleA[1].uuid === coupleB[1].uuid) ||
      (coupleA[0].uuid === coupleB[1].uuid && coupleA[1].uuid === coupleB[0].uuid)
    );
  };

  const computedIndicatorCouples = useMemo(() => {
    let indicatorCouples: [Indicator, Indicator][] = [];
    if (!indicatorList) {
      return [];
    }
    // if (selectedIndicators.length === 2) {
    //   return [];
    // }
    // all possible association couple amongst user's indicators
    const usersIndicatorsCouple: [Indicator, Indicator][] = [];
    for (const couple of INDICATORS_COUPLES) {
      const indicatorsA = indicatorList.filter((ind) => isIndicatorOrSameCategory(ind, couple[0]));
      const indicatorsB = indicatorList.filter((ind) => isIndicatorOrSameCategory(ind, couple[1]));
      for (const indicatorA of indicatorsA) {
        for (const indicatorB of indicatorsB) {
          const newCouple: [Indicator, Indicator] = [indicatorA, indicatorB];
          const isDuplicate = usersIndicatorsCouple.filter((couple) => isSameCouple(couple, newCouple)).length;
          if (indicatorA.uuid !== indicatorB.uuid && !isDuplicate) {
            usersIndicatorsCouple.push(newCouple);
          }
        }
      }
    }
    // const indicatorCouplesSelection = indicatorCouples.filter((couple) => {
    //   return (
    //     (indicatorList?.map((indicator) => indicator.baseIndicatorUuid)?.includes(couple[0]?.baseIndicatorUuid) ||
    //       indicatorList?.filter((indicator) => indicator.mainCategory === couple[0])) &&
    //     (indicatorList?.map((indicator) => indicator.baseIndicatorUuid)?.includes(couple[1]?.baseIndicatorUuid) ||
    //       indicatorList?.filter((indicator) => indicator.mainCategory === couple[1]))
    //   );
    // });
    if (selectedIndicators.length === 0) {
      indicatorCouples = usersIndicatorsCouple;
    } else if (selectedIndicators.length >= 1) {
      indicatorCouples = usersIndicatorsCouple
        .filter((couple) => {
          return selectedIndicators[0].uuid === couple[0].uuid || selectedIndicators[0].uuid === couple[1].uuid;
        })
        .map((couple) => {
          // always show selectedIndicators as first indicator in couple
          const otherIndicator = couple.find((ind) => ind.uuid !== selectedIndicators[0].uuid);
          return [selectedIndicators[0], otherIndicator];
        });
    }
    return indicatorCouples;
  }, [indicatorList, selectedIndicators]);

  return (
    <View
      className="flex-1 bg-white"
      style={{
        height: height90vh,
      }}
    >
      <View>
        <View className="self-end mr-4">
          <TouchableOpacity
            onPress={() => {
              setSelectedIndicators([]);
            }}
          >
            <Typography className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-800")}>Tout effacer</Typography>
          </TouchableOpacity>
        </View>
        <View className="p-4 flex-column">
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-left text-cnam-primary-900")}>
            Sélectionnez <Typography className={mergeClassNames(typography.textLgSemibold)}>jusqu'à 2 indicateurs</Typography> parmi ceux que vous
            suivez :
          </Typography>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        style={{
          paddingVertical: 0,
          backgroundColor: TW_COLORS.GRAY_50,
        }}
      >
        <View className="p-4 flex-column flex-1">
          <View className="flex-colum flex-1">
            {!indicatorList && <Typography>Chargement...</Typography>}
            {indicatorList &&
              indicatorList.map((e, index) => {
                const selected = !!selectedIndicators.find((x) => (x.uuid || x.name) === (e.uuid || e.name));
                return (
                  <LightSelectionnableItem
                    key={index}
                    className="flex-row"
                    id={e.uuid}
                    label={`${e.name}${!e.active ? " (désactivé)" : ""}`}
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
      <LinearGradient
        pointerEvents="none"
        colors={["transparent", "rgba(0,0,0,0.05)"]}
        style={{
          left: 0,
          right: 0,
          height: 12,
          zIndex: 10,
          top: -12,
        }}
      />
      <View className={`flex-column bg-white/90 pb-10 w-full`}>
        {!!computedIndicatorCouples.length && (
          <>
            <View className="flex-row items-center justify-between w-full px-4 py-4 bg-yellow pt-2">
              <Typography className={mergeClassNames(typography.textMdSemibold, "text-left text-cnam-primary-900")}>
                Associations fréquentes:
              </Typography>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => {
                    if (currentIndex.current > 0) {
                      scrollToIndex(currentIndex.current - 1);
                    }
                  }}
                  className="mr-4"
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <ChevronIcon strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-4"
                  onPress={() => {
                    if (currentIndex.current < computedIndicatorCouples.length - 1) {
                      scrollToIndex(currentIndex.current + 1);
                    }
                  }}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <ChevronIcon direction="right" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              style={{
                borderBottomWidth: 1,
                borderColor: TW_COLORS.GRAY_300,
              }}
              data={computedIndicatorCouples}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ref={flatListRef}
              className="px-4 pb-4"
              keyExtractor={(item) => getIndicatorKey(item[0]) + getIndicatorKey(item[1])}
              renderItem={({ item, index }) => {
                const selectedIndicatorsIds = selectedIndicators.map((selectedIndicator) => getIndicatorKey(selectedIndicator));
                const selected = selectedIndicatorsIds.includes(getIndicatorKey(item[0])) && selectedIndicatorsIds.includes(getIndicatorKey(item[1]));
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (selected) {
                        setSelectedIndicators([item[0]]);
                      } else {
                        setSelectedIndicators(item);
                      }
                    }}
                    onLayout={(e) => {
                      itemWidths.current[index] = e.nativeEvent.layout.width;
                    }}
                    className={mergeClassNames(
                      "bg-gray-50 rounded-lg border border-gray-300 px-2 py-1 mr-2 flex-row items-center justify-center",
                      selected ? "bg-cnam-cyan-lighten-80" : ""
                    )}
                  >
                    {selected ? (
                      <View className="mr-2 w-6 h-6 rounded-md items-center justify-center bg-cnam-primary-800">
                        <Typography className="text-white text-base font-bold">✓</Typography>
                      </View>
                    ) : (
                      <View className="mr-2 w-6 h-6 rounded-md items-center justify-center border border-gray-300">
                        <Typography className="text-white text-xs" />
                      </View>
                    )}
                    <Typography className={mergeClassNames(selected ? typography.textLgSemibold : typography.textLgMedium, "text-cnam-primary-900")}>
                      {item[0].name} + {item[1].name}
                    </Typography>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}
        <View className="fr-col space-y-4 mt-4 px-4 w-full">
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-gray-800")}>Traitement</Typography>
          <View className="flex-row items-center justify-between">
            <Typography className={mergeClassNames(typography.textLgMedium, "text-cnam-primary-900")}>
              Voir lorsque j’ai pris mon traitement
            </Typography>
            <Pressable onPress={() => reminderToggleRef?.current?.toggle?.()} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
              <InputToggle
                ref={reminderToggleRef}
                checked={showTreatment}
                onCheckedChanged={async ({ checked }) => {
                  setShowTreatment(checked);
                }}
              />
            </Pressable>
          </View>
        </View>
        <View className="fr-col space-y-4 mt-4 p-4 w-full">
          <JMButton
            onPress={async () => {
              logEvents.logAnalysesValidateCorrelations();
              onClose({
                selectedIndicators,
                showTreatment,
              });
            }}
            disabled={selectedIndicators.length === 0}
            title={"Analyser"}
          />
        </View>
      </View>
    </View>
  );
};
