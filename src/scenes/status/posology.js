import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import { colors } from "../../utils/colors";
import { canEdit } from "./utils/index.js";

const Posology = ({ patientState, posology, date, onPress }) => {
  const hasPosology = posology && posology.length > 0 && posology.some((e) => e.value);
  const hasPriseDeTraitement =
    Object.keys(patientState?.PRISE_DE_TRAITEMENT || {})?.length ||
    Object.keys(patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN || {})?.length;

  if (!hasPosology && !hasPriseDeTraitement) return null;

  const renderPosology = () => {
    return (posology || []).map((p, i) => {
      if (!p?.name1 || !p?.value) return null;
      return (
        <View style={styles.posologyItem} key={i}>
          <Icon icon="DrugsSvg" color="#58C8D2" width={20} height={20} styleContainer={styles.icon} />
          <View style={styles.posologyName}>
            <Text style={styles.text1}>{p.name1}</Text>
            {p.name2 ? <Text style={styles.text2}>{p.name2}</Text> : null}
          </View>
          <Text style={styles.posologyText}>{p.value}</Text>
        </View>
      );
    });
  };

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.container}>
        <Text style={styles.title}>Traitements</Text>
        {patientState?.PRISE_DE_TRAITEMENT?.value !== undefined ? (
          <View style={styles.containerQuestionReponse}>
            <Text>Avez-vous pris correctement votre traitement quotidien&nbsp;?</Text>
            {patientState?.PRISE_DE_TRAITEMENT?.value ? (
              <Text style={styles.reponseOui}>Oui</Text>
            ) : (
              <Text style={styles.reponseNon}>Non</Text>
            )}
          </View>
        ) : null}
        {patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN?.value !== undefined ? (
          <View style={styles.containerQuestionReponse}>
            <Text>Avez-vous pris un "si besoin"&nbsp;?</Text>
            {patientState?.PRISE_DE_TRAITEMENT_SI_BESOIN?.value ? (
              <Text style={styles.reponseOui}>Oui</Text>
            ) : (
              <Text style={styles.reponseNon}>Non</Text>
            )}
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.subcontainer,
            canEdit(date) && {
              borderRadius: 10,
            },
          ]}
          onPress={onPress}
          disabled={!canEdit(date)}
        >
          <View style={styles.posologyContainer}>{renderPosology()}</View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerQuestionReponse: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  icon: { marginRight: 5 },
  posologyItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
    paddingVertical: 5,
  },
  posologyName: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  text1: {
    fontSize: 15,
    color: "#000",
  },
  text2: {
    fontSize: 13,
    color: colors.DARK_BLUE,
    fontStyle: "italic",
  },
  title: { fontWeight: "bold", marginBottom: 10 },
  posologyText: {
    fontSize: 15,
    fontWeight: "600",
  },
  reponseOui: { fontWeight: "bold", color: "#26387C" },
  reponseNon: { fontWeight: "bold", color: "#E575F8" },
  subcontainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  posologyContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  textContainer: { width: "100%" },
  text: {
    width: "80%",
    fontSize: 15,
    marginBottom: 5,
  },
  boldText: {
    fontSize: 15,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(38, 56, 124, 0.08)",
    marginVertical: 10,
    width: "60%",
    alignSelf: "center",
  },
});

export default Posology;
