import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "@/utils/colors";
import { formatDateThread } from "@/utils/date/helpers";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "@/components/Typography";

const EVENTS = [
  { label: "Contexte de la journée", value: "CONTEXT" },
  { label: "Précisions élément", value: "USER_COMMENT" },
  { label: "Traitements", value: "POSOLOGY" },
  { label: "Substances", value: "TOXIC" },
];

const Card = ({ date, context, userComment, event }) => {
  if (!date) return null;

  const getVariableByEvent = (e) => {
    switch (e) {
      case "CONTEXT":
        return context;
      case "USER_COMMENT":
        return userComment;
    }
  };

  const canDisplay = (e, v) => {
    return v && (e === event || event === "ALL");
  };

  // on vérifie si on a quelque chose a afficher si on a un event en particuler de précisé
  if (event !== "ALL" && !EVENTS.some((e) => canDisplay(e.value, getVariableByEvent(e.value)))) return null;

  return (
    <View className="mt-4">
      <Typography className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 mb-4")}>{formatDateThread(date)}</Typography>
      <View className="bg-cnam-cyan-25-lighten-97 px-4">
        {canDisplay("CONTEXT", context) ? (
          <View className="py-4">
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Contexte de la journée</Typography>
            <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left")}>{context}</Typography>
          </View>
        ) : null}
        {canDisplay("USER_COMMENT", userComment) ? (
          <View className="py-4">
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-800")}>Précisions sur l'élément</Typography>
            <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left")}>{userComment}</Typography>
          </View>
        ) : null}
        {!canDisplay("CONTEXT", context) && !canDisplay("USER_COMMENT", userComment) ? (
          <View className="py-4">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-800 text-left")}>
              Vous n'avez rien précisé pour ce jour-là
            </Typography>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: "#F9F6F6",
  //   borderRadius: 10,
  //   marginBottom: 20,
  //   paddingHorizontal: 15,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.23,
  //   shadowRadius: 2.62,

  //   elevation: 4,
  // },
  title: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontWeight: "bold",
    fontFamily: "SourceSans3-Bold",
    color: colors.BLUE,
    fontSize: 13,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.BLUE,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  message: {
    color: "#111",
    fontSize: 13,
  },
  italic: {
    fontStyle: "italic",
  },
  muted: {
    fontSize: 13,
    fontStyle: "italic",
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default Card;
