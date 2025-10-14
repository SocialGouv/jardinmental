import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";

const CHART_TYPES = [
  {
    key: "Statistiques",
    label: "Bilan",
  },
  {
    key: "Courbes",
    label: "Variations",
  },
  {
    key: "Frises",
    label: "Corrélations",
  },
  {
    key: "Déclencheurs",
    label: "Déclencheurs",
  },
];

const TabPicker = ({ onChange, ongletActif = "Statistiques", scrollY, scrollThreshold = 80 }) => {
  const listRef = React.useRef();

  const handlePress = (tab) => {
    // logEvents.logStatusSubPage(tab);
    onChange(tab);
  };

  // Animated style for hiding the tab bar on scroll
  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { height: 76, opacity: 1 };
    }

    const height = interpolate(
      scrollY.value,
      [0, scrollThreshold],
      [76, 0], // from full height to 0
      Extrapolate.CLAMP
    );

    const opacity = interpolate(scrollY.value, [0, scrollThreshold / 2, scrollThreshold], [1, 0.5, 0], Extrapolate.CLAMP);

    return { height, opacity };
  });

  return (
    <Animated.View style={[tabStyles.container, animatedStyle]}>
      <FlatList
        ref={listRef}
        data={CHART_TYPES}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />} // 👈 space between items
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              // className="h-full"
              key={item.key}
              className={mergeClassNames("h-[44] py-2 px-6", ongletActif === item.key ? "bg-cnam-primary-800 rounded-xl" : "transparent")}
              onPress={() => {
                listRef.current?.scrollToItem({
                  item,
                  animated: true,
                  viewPosition: 0.5,
                });
                handlePress(item.key);
              }}
            >
              <Text className={mergeClassNames(typography.textMdSemibold, ongletActif === item.key ? "text-white" : "text-gray-700")}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        horizontal
        style={tabStyles.scrollView}
        contentContainerStyle={tabStyles.scrollContainer}
        fadingEdgeLength={10}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={"end"}
      />
    </Animated.View>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollView: {
    backgroundColor: "#F6FCFD",
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  scrollContainer: {
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
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
