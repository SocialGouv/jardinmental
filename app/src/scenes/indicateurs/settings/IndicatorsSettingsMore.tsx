import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect } from "@react-navigation/native";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";
import Icon from "../../../components/Icon";
import localStorage from "../../../utils/localStorage";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Indicator } from "@/entities/Indicator";

const IndicatorsSettingsMore = ({ navigation, route }) => {
  const [indicators, setIndicators] = useState([]);
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

  const renderItem = useCallback((indicator: Indicator, index: number) => {
    return <IndicatorItem indicator={indicator} isActive={indicator.active} drag={undefined} index={index} setIndicators={setIndicators} />;
  }, []);

  const keyExtractor = useCallback((indicator) => indicator.uuid, []);

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
      <View className="flex-column flex-1 px-4">{indicators.filter((indicator) => indicator.active).map(renderItem)}</View>
    </AnimatedHeaderScrollScreen>
  );
};

const IndicatorItem = ({ indicator, setIndicators }: { indicator: Indicator; setIndicators: (param: Indicator[]) => void }) => {
  return (
    <View
      key={indicator.uuid}
      className={mergeClassNames("p-4 bg-gray-100 mb-2 rounded-xl flex-row items-center justify-between", !indicator.active ? "bg-gray-50" : "")}
    >
      <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>{indicator.name}</Text>
      <TouchableOpacity onPress={() => setIndicators((prev) => prev.map((i) => (i.uuid === indicator.uuid ? { ...i, active: false } : i)))}>
        <Icon icon="Bin2Svg" color={colors.BLUE} width="16" height="16" styleContainer={{ width: 16, height: 16 }} />
      </TouchableOpacity>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontFamily: "SourceSans3",
    fontWeight: "700",
    fontSize: 16,
    color: colors.BLUE,
    textAlign: "left",
    marginLeft: 16,
  },
});

const titleStyles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 24,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default IndicatorsSettingsMore;
