import React from "react";
import { View, ScrollView, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import Header from "./Header";

// Example of how to use the Header component with scroll animations
const HeaderUsageExample = ({ navigation }) => {
  // Create a shared value to track scroll position
  const scrollY = useSharedValue(0);

  // Create scroll handler to update the shared value
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#6366f1" }}>
      {/* Header with scroll animations */}
      <Header
        title="Example Screen"
        navigation={navigation}
        scrollY={scrollY}
        scrollThreshold={75} // Optional: customize when animations start (default: 50)
      />

      {/* Scrollable content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      >
        {/* Sample content to demonstrate scrolling */}
        {Array.from({ length: 20 }, (_, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              margin: 16,
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", fontFamily: "SourceSans3-Bold" }}>Content Item {index + 1}</Text>
            <Text style={{ marginTop: 8, color: "#666" }}>
              Scroll down to see the "Mes observations" title slide up and fade out, the "Soutien 24/7" button fade out, and the header size reduce
              smoothly.
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default HeaderUsageExample;
