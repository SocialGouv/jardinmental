import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import Svg, { Path, Circle } from "react-native-svg";
import { scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

export const FriseGraph = React.memo(
  ({ title, data, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }) => {
    const focusedScoresSet = React.useMemo(() => new Set(focusedScores), [focusedScores]);

    // -------- MAIN DATA
    const processedData = React.useMemo(() => {
      if (!data?.length) return [];

      return data.map((e) => {
        const isReverse = e?._indicateur?.order === "DESC";
        const scores = isReverse ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

        let _icon;
        let _value = e?.value;

        if (e?._indicateur?.type === "smiley") {
          _icon = scoresMapIcon[isReverse ? 5 + 1 - e?.value : e?.value];
        } else if (e?._indicateur?.type === "boolean") {
          _value = e?.value === true ? 5 : 1;
          _icon = scoresMapIcon[isReverse ? 5 + 1 - _value : _value];
        } else if (e?._indicateur?.type === "gauge") {
          _value = Math.min(Math.ceil(e?.value * 5), 5);
          _icon = scoresMapIcon[scores[_value - 1]];
        } else {
          _icon = scoresMapIcon[e?.value];
        }

        const color = _icon?.color || "#D7D3D3";
        let opacity = 1;

        const isFocused =
          _value &&
          focusedScoresSet.size > 0 &&
          focusedScoresSet.size <= 5 &&
          ((!isReverse && focusedScoresSet.has(_value)) || (isReverse && focusedScoresSet.has(6 - _value)));

        if (focusedScoresSet.size && !isFocused) {
          opacity = _value ? 0.1 : 0.5;
        }

        return { color, opacity };
      });
    }, [data, focusedScoresSet]);

    // -------- TRAITEMENT
    const processedTreatmentData = React.useMemo(() => {
      if (!priseDeTraitement?.length) return [];
      return priseDeTraitement.map((e) => ({
        color: e?.value === true ? "#5956E8" : e?.value === false ? "#E575F8" : "#D7D3D3",
      }));
    }, [priseDeTraitement]);

    // -------- TRAITEMENT SI BESOIN
    const processedTreatmentSiBesoinData = React.useMemo(() => {
      if (!priseDeTraitementSiBesoin?.length) return [];
      return priseDeTraitementSiBesoin.map((e) => ({
        color: e?.value === true ? "#5956E8" : "transparent",
      }));
    }, [priseDeTraitementSiBesoin]);

    const dataLength = data?.length || 0;
    const width = 300; // largeur totale (tu peux rendre ça dynamique)
    const height = 10;
    const segmentWidth = width / dataLength;

    // -------- PATH BUILDER
    const buildPath = (dataset, barHeight) => {
      let paths = [];
      dataset.forEach((item, index) => {
        if (item.color === "transparent") return;
        const x = index * segmentWidth;
        const w = Math.max(segmentWidth - 1, 0.1); // éviter négatif
        paths.push(`M${x},0 h${w} v${barHeight} h-${w} Z`);
      });
      return paths.join(" ");
    };

    const mainPath = buildPath(processedData, height);
    const treatmentPath = buildPath(processedTreatmentData, 4);

    return (
      <View style={styles.friseContainer}>
        {title ? <Text style={styles.friseTitle}>{title}</Text> : null}

        {/* MAIN BAR */}
        <Svg width={width} height={height}>
          {/* fond gris */}
          <Path d={mainPath} fill="#D7D3D3" />
          {processedData.map((item, index) => {
            const x = index * segmentWidth;
            const w = Math.max(segmentWidth - 1, 0.1);
            return <Path key={`main-${index}`} d={`M${x},0 h${w} v${height} h-${w} Z`} fill={item.color} opacity={item.opacity} />;
          })}
        </Svg>

        {/* TRAITEMENT */}
        {showTraitement && processedTreatmentData.length > 0 && (
          <Svg width={width} height={4} style={{ marginTop: 5 }}>
            <Path d={treatmentPath} fill="#D7D3D3" />
            {processedTreatmentData.map((item, index) => {
              if (item.color === "transparent") return null;
              const x = index * segmentWidth;
              const w = Math.max(segmentWidth - 1, 0.1);
              return <Path key={`treatment-${index}`} d={`M${x},0 h${w} v4 h-${w} Z`} fill={item.color} />;
            })}
          </Svg>
        )}

        {/* TRAITEMENT SI BESOIN */}
        {showTraitement && processedTreatmentSiBesoinData.length > 0 && (
          <Svg width={width} height={6} style={{ marginTop: 5 }}>
            {processedTreatmentSiBesoinData.map((item, index) => {
              if (item.color === "transparent") return null;
              return <Circle key={`treatment-dot-${index}`} cx={index * segmentWidth + segmentWidth / 2} cy={3} r={2} fill={item.color} />;
            })}
          </Svg>
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.data === nextProps.data &&
      prevProps.showTraitement === nextProps.showTraitement &&
      prevProps.priseDeTraitement === nextProps.priseDeTraitement &&
      prevProps.priseDeTraitementSiBesoin === nextProps.priseDeTraitementSiBesoin &&
      prevProps.focusedScores.length === nextProps.focusedScores.length &&
      prevProps.focusedScores.every((score, index) => score === nextProps.focusedScores[index])
    );
  }
);

const styles = StyleSheet.create({
  friseContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
    marginBottom: 5,
  },
});
