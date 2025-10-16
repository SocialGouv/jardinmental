import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card } from "@/components/Card";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import logEvents from "@/services/logEvents";
import ReorderableList, { reorderItems, useReorderableDrag } from "react-native-reorderable-list";
import { Gesture } from "react-native-gesture-handler";

const IndicatorsSettingsMore = ({ navigation, route }) => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let _indicators = await localStorage.getIndicateurs();
        setIndicators(_indicators);
      })();
    }, [])
  );

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);
    await localStorage.setIndicateurs(indicators);
    setLoading(false);
    navigation.goBack();
  };

  const renderItem = useCallback(({ item: indicator }) => {
    return <IndicatorItem indicator={indicator} setIndicators={setIndicators} />;
  }, []);

  const keyExtractor = useCallback((indicator: Indicator) => indicator.uuid || indicator.name, []);

  // Configure pan gesture to allow scrolling while keeping drag functionality
  // The pan gesture activates after 520ms, which is slightly longer than the long press delay (100ms)
  // This allows normal scrolling to work while still enabling drag when holding longer
  const panGesture = useMemo(() => Gesture.Pan().activateAfterLongPress(220), []);

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={() => {
        navigation.goBack();
      }}
      title="Mon questionnaire"
      navigation={navigation}
      smallHeader={true}
      headerRightComponent={null}
      headerRightAction={() => {}}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <>
            <JMButton title="Enregistrer" onPress={onValidate} />
          </>
        </NavigationButtons>
      }
    >
      <Card title="Modifier mon questionnaire" text="Vous pouvez supprimer vos indicateurs" />
      <View className="my-6 mt-8 flex-row items-center px-4">
        <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900")}>Vos indicateurs</Text>
        <View className="bg-cnam-cyan-500-0 h-7 w-7 rounded-full items-center justify-center ml-2">
          <Text className={mergeClassNames("text-white", typography.textMdSemibold)}>
            {indicators?.filter((indicator) => indicator.active)?.length || 0}
          </Text>
        </View>
      </View>
      <ReorderableList
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={useMemo(() => indicators.filter((indicator) => indicator.active), [indicators])}
        onReorder={({ from, to }) => {
          const activeIndicators = indicators.filter((indicator) => indicator.active);
          const reordered = reorderItems(activeIndicators, from, to);

          // Merge back with inactive indicators
          const inactiveIndicators = indicators.filter((indicator) => !indicator.active);
          setIndicators([...reordered, ...inactiveIndicators]);
        }}
        contentContainerStyle={{ flex: 1, paddingHorizontal: 16 }}
        panGesture={panGesture}
      />
    </AnimatedHeaderScrollScreen>
  );
};

const IndicatorItem = ({ indicator, setIndicators }: { indicator: Indicator; setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>> }) => {
  const drag = useReorderableDrag();

  const deleteIndicator = () => {
    logEvents.logDeleteIndicator();
    setIndicators((prev) => prev.map((i) => (i.uuid === indicator.uuid ? { ...i, active: false } : i)));
  };

  return (
    <TouchableOpacity onLongPress={drag} delayLongPress={100}>
      <View
        className={mergeClassNames("p-4 bg-gray-100 mb-2 rounded-xl flex-row items-center justify-between", !indicator.active ? "bg-gray-50" : "")}
      >
        <Icon icon="ReorderSvg" color="#26387C" width="16" height="16" styleContainer={{ width: 16, height: 16 }} />
        <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>{indicator?.name}</Text>
        <TouchableOpacity onPress={deleteIndicator}>
          <Icon icon="Bin2Svg" color={colors.BLUE} width="16" height="16" styleContainer={{ width: 16, height: 16 }} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default IndicatorsSettingsMore;
