import React, { useCallback, useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getDaysOfWeekLabel, getGoalsTracked } from "../../../utils/localStorage/goals";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";
import Icon from "../../../components/Icon";
import localStorage from "../../../utils/localStorage";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";

export const IndicatorsSettingsMore = ({ navigation, route }) => {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let _indicators = await localStorage.getIndicateurs();
        _indicators = _indicators.filter((indicator) => indicator.active);
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

  const renderItem = useCallback(({ item: indicator, drag, isActive, index }) => {
    return <IndicatorItem {...{ indicator, drag, isActive, index }} />;
  }, []);

  const keyExtractor = useCallback((indicator) => indicator.uuid);

  return (
    <Screen
      header={{
        title: "Mon questionnaire",
      }}
      bottomChildren={<Button2 fill title="Enregistrer" onPress={onValidate} />}
      ScrollComponent={DraggableFlatList}
      scrollAsFlatList={true}
      scrollProps={{
        data: indicators,
        renderItem,
        keyExtractor,
        onDragEnd: (data) => setIndicators(data?.data),
      }}
    >
      <Card
        title="Modifier mon questionnaire"
        text="Vous pouvez changer l’ordre d’apparition de vos indicateurs"
      />
      <View style={titleStyles.container}>
        <Title align="left" fill={false}>
          Vos indicateurs
        </Title>
        <Badge style={{ marginLeft: 8 }} circle>
          {indicators?.length || 0}
        </Badge>
      </View>
    </Screen>
  );
};

const IndicatorItem = ({ indicator, drag, isActive, index }) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity onLongPress={drag} disabled={isActive} delayLongPress={100}>
        <View style={[itemStyles.container, isActive && { backgroundColor: "#D4F0F2" }]}>
          <Icon
            icon="ReorderSvg"
            color="#26387C"
            width="16"
            height="16"
            styleContainer={{ width: 16, height: 16 }}
          />
          <Text style={[itemStyles.label]}>{indicator?.name}</Text>
          {/* <Button2
        square
        preset=""
        type="clear"
        icon="EditSvg"
        textStyle={{ color: "#26387C" }}
        style={{ backgroundColor: "#F8F9FB" }}
        iconSize={16}
        onPress={() => {}}
      /> */}
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
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
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    color: "#26387C",
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
