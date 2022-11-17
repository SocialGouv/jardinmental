import React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenHeader } from "./ScreenHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Screen = ({
  preset = "primary", // 'primary'
  children,
  containerStyle,
  ContainerComponent = View,
  scrollStyle,
  scrollContentStyle,
  ScrollComponent = ScrollView,
  scrollRef = null,
  scrollTestId,
  header,
  bottomChildren,
  bottomContainerStyle,
  withoutInsets,
  marginHorizontal = 16,
  centerContentVertically = undefined, // if true, scroll keeps working if content bigger (iOS and Android)
}) => {
  const _containerStyle = {};
  const _scrollStyle = {};
  const _scrollContentStyle = {};

  const insets = useSafeAreaInsets();

  return (
    <ContainerComponent style={[styles.container, _containerStyle, containerStyle]}>
      {header && (
        <ScreenHeader marginHorizontal={marginHorizontal} withoutInsets={withoutInsets} {...header} />
      )}

      <ScreenKeyboardAvoidingView>
        <ScrollComponent
          ref={scrollRef}
          style={[styles.scroll, _scrollStyle, scrollStyle]}
          contentContainerStyle={[styles.scrollContentContainer, _scrollContentStyle, scrollContentStyle]}
          testID={scrollTestId}
          bounces={true}
        >
          <View
            style={[
              { marginHorizontal },
              centerContentVertically && {
                flexGrow: 1,
                justifyContent: "center",
              },
            ]}
          >
            {children}
          </View>
        </ScrollComponent>
      </ScreenKeyboardAvoidingView>

      <View style={[{ marginHorizontal }, bottomContainerStyle]}>{bottomChildren}</View>

      <View style={{ height: insets.bottom + (Platform.OS === "android" && 20) }} collapsable={false} />
    </ContainerComponent>
  );
};

const ScreenKeyboardAvoidingView = ({ children }) =>
  Platform.OS === "ios" ? (
    <KeyboardAvoidingView behavior={"padding"} style={styles.keyboardAvoidingView}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    children
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    overflow: "visible",
  },
  scrollContentContainer: { flexGrow: 1 },
});
