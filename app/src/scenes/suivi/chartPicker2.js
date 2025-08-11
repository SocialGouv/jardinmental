import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";

const CHART_TYPES = [
  {
    key: "Frises",
    label: "Frises",
  },
  {
    key: "Statistiques",
    label: "Statistiques",
  },
  {
    key: "Courbes",
    label: "Courbes",
  },
  {
    key: "Déclencheurs",
    label: "Déclencheurs",
  },
];

const TabPicker = ({ onChange, ongletActif = "Frises" }) => {
  const listRef = React.useRef();

  const handlePress = (tab) => {
    // logEvents.logStatusSubPage(tab);
    onChange(tab);
  };

  return (
    <FlatList
      ref={listRef}
      data={CHART_TYPES}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => {
            listRef.current?.scrollToItem({
              item,
              animated: true,
              viewPosition: 0.5,
            });
            handlePress(item.label);
          }}
          style={[tabStyles.tabButtonContainer]}
        >
          <View style={[tabStyles.tabButtonContainer, ongletActif === item.label ? tabStyles.tabActif : tabStyles.tabInactif]}>
            <Text style={[tabStyles.button, ongletActif === item.label ? tabStyles.actif : tabStyles.inactif]}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      )}
      horizontal
      style={tabStyles.scrollView}
      contentContainerStyle={tabStyles.scrollContainer}
      fadingEdgeLength={10}
      showsHorizontalScrollIndicator={false}
      snapToAlignment={"end"}
    />
  );
};

const tabStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F6FCFD",
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  scrollContainer: {},
  currentDateContainer: {
    backgroundColor: "#F6FCFD",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 5,
    display: "flex",
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  button: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabButtonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
    paddingHorizontal: 10,
  },
  actif: {
    color: colors.BLUE,
    fontWeight: "bold",
  },
  inactif: {
    color: "#666",
  },
  tabActif: {
    borderColor: colors.BLUE,
    borderBottomWidth: 3,
  },
});

export default TabPicker;
