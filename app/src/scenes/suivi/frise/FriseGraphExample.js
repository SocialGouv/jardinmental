import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../../components/MyText";
import { FriseGraph } from "./FriseGraph";

export const FriseGraphExample = ({ hasTreatment }) => {
  return (
    <View style={styles.container}>
      <FriseGraph
        focusedScores={[]}
        data={[
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 1 },
          { value: 3 },
          { value: 1 },
          { value: 4 },
          { value: 5 },
          { value: 5 },
          { value: 4 },
          { value: 4 },
          { value: 3 },
          { value: 4 },
          { value: 4 },
        ]}
        showTraitement
        priseDeTraitement={[
          {},
          { value: false },
          {},
          { value: true },
          { value: true },
          { value: true },
          { value: true },
          { value: true },
          { value: true },
          { value: true },
          { value: true },
          {},
          { value: false },
          {},
        ]}
        priseDeTraitementSiBesoin={[
          {},
          { value: false },
          {},
          { value: false },
          { value: false },
          { value: true },
          { value: true },
          { value: false },
          { value: false },
          { value: true },
          { value: true },
          {},
          { value: false },
          {},
        ]}
      />
      <View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <View style={[styles.hintSquare, { backgroundColor: "#5956E8", marginRight: 15 }]} />
          {hasTreatment ? (
            <Text style={styles.hintLegend}>Prise correcte du traitement</Text>
          ) : (
            <Text style={styles.hintLegend}>J’ai pris correctement mon traitement</Text>
          )}
        </View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <View style={[styles.hintSquare, { backgroundColor: "#E575F8", marginRight: 15 }]} />
          {hasTreatment ? (
            <Text style={styles.hintLegend}>Prise incomplète/oubli du traitement</Text>
          ) : (
            <Text style={styles.hintLegend}>Je ne l’ai pas pris correctement</Text>
          )}
        </View>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <View
            style={[
              {
                height: 4,
                width: 4,
                borderRadius: 2,
                backgroundColor: "#5956E8",
                marginRight: 21,
                marginLeft: 5,
              },
            ]}
          />
          {hasTreatment ? (
            <Text style={styles.hintLegend}>Prise d’un "si besoin"</Text>
          ) : (
            <Text style={styles.hintLegend}>J’ai pris un “si besoin”</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  triangle: {
    color: "#F8FDFE",
  },
  container: {},
  hintLegend: {
    flex: 1,
  },
  hintSquare: {
    height: 4,
    width: 15,
  },
});
