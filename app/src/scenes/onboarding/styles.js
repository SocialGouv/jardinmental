import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { colors } from "@/utils/colors";

export const onboardingStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scroll: {
    backgroundColor: "white",
    flex: 1,
    //display: "flex",
    overflow: "visible",
  },
  scrollContentContainer: {
    flexGrow: 1,
    //paddingBottom: 60,
  },
  containerBottom: {
    //flex: 1,
    marginBottom: 60,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  containerBottomTitle: {
    //flex: 1,
    marginBottom: 40,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  containerTopTitle: {},
  containerBottomText: {
    //flex: 2,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  containerCentered: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  emphasis: {
    color: colors.LIGHT_BLUE,
  },
  h1: {
    fontFamily: "SourceSans3",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 33,
    textAlign: "left",
    color: colors.BLUE,
  },
  h2: {
    fontFamily: "SourceSans3",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 23,
    textAlign: "left",
    color: colors.BLUE,
  },
  h3: {
    fontFamily: "SourceSans3",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 17,
    textAlign: "left",
    color: colors.BLUE,
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
    color: colors.BLUE,
  },
  presentationText: {
    textAlign: "left",
    fontSize: Dimensions.get("window").height > 700 ? 18 : 16,
    color: "#0A215C",
    display: "flex",
    //flex: 1,
  },
  imageContainer: {
    //flex: 1,
    marginVertical: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageSize: {
    height: 120,
    resizeMode: "contain",
  },
  multiImageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    color: "#C3C7D5",
    marginVertical: 0,
  },
  cgu: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  textCgu: {
    flex: 1,
    fontSize: Dimensions.get("window").height > 700 ? 16 : 12,
  },
  underlined: {
    textDecorationLine: "underline",
  },
  checkbox: {
    marginRight: 20,
  },
  alertContainer: {
    backgroundColor: "#FEFFE4",
    borderColor: "#EDF053",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 20,
  },
  alertText: {
    display: "flex",
    flex: 1,
  },
});
