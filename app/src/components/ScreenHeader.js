import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button2 } from "./Button2";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenHeader = ({
  title,
  subTitle,
  canGoBack = true,
  leftButton,
  rightButton,
  containerStyle = {},
  contentContainerStyle = {},
  titleContainerStyle = {},
  titleStyle = {},
  marginHorizontal = 16,
  withoutInsets,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (canGoBack && !leftButton) {
    leftButton = {
      icon: "ArrowUpSvg",
      iconStyle: { transform: [{ rotate: "270deg" }] },
      onPress: () => {
        if (navigation.canGoBack()) navigation.goBack();
      },
    };
  }

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: marginHorizontal },
        !withoutInsets && { paddingTop: insets.top },
        containerStyle,
      ]}
    >
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {leftButton && <HeaderButton {...leftButton} />}
        {!leftButton && rightButton && <HeaderButtonGhost />}

        <View style={[styles.titleContainer, titleContainerStyle]}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subTitle && <Text style={[styles.title, styles.subtitle, subTitleStyle]}>{subTitle}</Text>}
        </View>

        {rightButton && <HeaderButton {...rightButton} />}
        {!rightButton && leftButton && <HeaderButtonGhost />}
      </View>
    </View>
  );
};

const HeaderButton = ({ ...buttonProps }) => {
  return <Button2 preset="" type="outline" circle size="normal" {...buttonProps} />;
};

const HeaderButtonGhost = () => <View style={{ width: 45 }} collapsable={false} />;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#ffffffee",
    marginBottom: 20,
    position: "relative",
    zIndex: 100,
  },
  contentContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    minHeight: 30,
  },
  titleContainer: {
    flexGrow: 1,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "SourceSans3",
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  subtitle: {},
});
