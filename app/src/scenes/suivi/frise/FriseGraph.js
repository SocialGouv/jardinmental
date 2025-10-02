import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import { scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

// Memoized square item component to prevent unnecessary re-renders
const SquareItem = React.memo(({ item, index, title, isFirst, isLast }) => {
  const { color, opacity, isFocused, borderBottom, shadow } = item;

  return (
    <View key={`${title}-${index}`} style={styles.squareItemContainer}>
      <View
        style={[
          styles.square,
          {
            backgroundColor: color,
            opacity,
            borderBottomStartRadius: !isFocused && isFirst ? 5 : 0,
            borderTopStartRadius: isFirst ? 5 : 0,
            borderBottomEndRadius: !isFocused && isLast ? 5 : 0,
            borderTopEndRadius: isLast ? 5 : 0,
            ...borderBottom,
          },
        ]}
      />
      <View
        style={[
          {
            borderColor: isFocused ? color : "transparent",
            borderTopWidth: 0.5,
            ...shadow,
          },
        ]}
      />
    </View>
  );
});

// Memoized treatment square component
const TreatmentSquare = React.memo(({ item, index, title, isFirst, isLast }) => {
  return (
    <View key={`${title}-${index}`} style={styles.squareItemContainerTraitement}>
      <View
        style={[
          styles.square,
          {
            backgroundColor: item.color,
            borderBottomStartRadius: isFirst ? 5 : 0,
            borderTopStartRadius: isFirst ? 5 : 0,
            borderBottomEndRadius: isLast ? 5 : 0,
            borderTopEndRadius: isLast ? 5 : 0,
          },
        ]}
      />
    </View>
  );
});

// Memoized treatment dot component
const TreatmentDot = React.memo(({ item, index, title }) => {
  return (
    <View key={`${title}-${index}`} style={styles.squareItemContainerTraitementSiBesoin}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: item.color,
          },
        ]}
      />
    </View>
  );
});

export const FriseGraph = React.memo(
  ({ title, data, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }) => {
    // Create a Set for faster focus lookup - O(1) instead of O(n)
    const focusedScoresSet = React.useMemo(() => new Set(focusedScores), [focusedScores]);

    // Memoize processed main data to avoid recalculation on every render
    const processedData = React.useMemo(() => {
      if (!data?.length) return [];

      return data.map((e) => {
        const isReverse = e?._indicateur?.order === "DESC";
        const scores = isReverse ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

        let _icon;
        let _value = e?.value;

        if (e?._indicateur?.type === "smiley") {
          if (e?._indicateur?.order === "DESC") {
            _icon = scoresMapIcon[5 + 1 - e?.value];
          } else {
            _icon = scoresMapIcon[e?.value];
          }
        } else if (e?._indicateur?.type === "boolean") {
          _value = e?.value === true ? 5 : 1;
          if (e?._indicateur?.order === "DESC") {
            _icon = scoresMapIcon[5 + 1 - _value];
          } else {
            _icon = scoresMapIcon[_value];
          }
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

        const shadow = isFocused
          ? {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 2.5,
              elevation: 1,
            }
          : {};

        const borderBottom = isFocused
          ? {
              borderColor: scoresMapIcon[scores[_value - 1]]?.borderColor,
              borderBottomWidth: 2,
            }
          : {};

        return {
          color,
          opacity,
          isFocused,
          borderBottom,
          shadow,
        };
      });
    }, [data, focusedScoresSet]);

    // Memoize processed treatment data
    const processedTreatmentData = React.useMemo(() => {
      if (!priseDeTraitement?.length) return [];

      return priseDeTraitement.map((e) => {
        let color = "#D7D3D3";
        if (e?.value === true) color = "#5956E8";
        if (e?.value === false) color = "#E575F8";
        return { color };
      });
    }, [priseDeTraitement]);

    // Memoize processed treatment si besoin data
    const processedTreatmentSiBesoinData = React.useMemo(() => {
      if (!priseDeTraitementSiBesoin?.length) return [];

      return priseDeTraitementSiBesoin.map((e) => {
        const color = e?.value === true ? "#5956E8" : "transparent";
        return { color };
      });
    }, [priseDeTraitementSiBesoin]);

    const dataLength = data?.length || 0;

    return (
      <View style={styles.friseContainer}>
        {title ? <Text style={styles.friseTitle}>{title}</Text> : null}
        <View style={styles.squareContainer}>
          {processedData.map((item, index) => (
            <SquareItem key={`${title}-${index}`} item={item} index={index} title={title} isFirst={index === 0} isLast={index === dataLength - 1} />
          ))}
        </View>
        {showTraitement && processedTreatmentData.length > 0 && (
          <View style={styles.squareContainerTraitement}>
            {processedTreatmentData.map((item, index) => (
              <TreatmentSquare
                key={`${title}-treatment-${index}`}
                item={item}
                index={index}
                title={title}
                isFirst={index === 0}
                isLast={index === dataLength - 1}
              />
            ))}
          </View>
        )}
        {showTraitement && processedTreatmentSiBesoinData.length > 0 && (
          <View style={styles.squareContainerTraitement}>
            {processedTreatmentSiBesoinData.map((item, index) => (
              <TreatmentDot key={`${title}-treatment-si-besoin-${index}`} item={item} index={index} title={title} />
            ))}
          </View>
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
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
  triangle: {
    color: "#F8FDFE",
  },
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
  squareContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareContainerTraitement: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareItemContainer: {
    display: "flex",
    flex: 1,
    height: 10,
  },
  squareItemContainerTraitement: {
    marginTop: 5,
    display: "flex",
    flex: 1,
    height: 4,
  },
  squareItemContainerTraitementSiBesoin: {
    marginTop: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 4,
  },
  square: {
    flex: 1,
    height: 10,
  },
  dot: {
    flex: 1,
    height: 4,
    width: 4,
    borderRadius: 2,
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT_BLUE,
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    shadowColor: "#0A215C",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
