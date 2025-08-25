import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import { scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

export const FriseGraph = ({ title, data, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }) => {
  return (
    <View style={styles.friseContainer}>
      {title ? <Text style={styles.friseTitle}>{title}</Text> : null}
      <View style={styles.squareContainer}>
        {data?.map((e, i) => {
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

          let color = _icon?.color || "#D7D3D3";

          let opacity = 1;

          const isFocused =
            _value &&
            focusedScores.length > 0 &&
            focusedScores.length <= 5 &&
            ((!isReverse && focusedScores.includes(_value)) || (isReverse && focusedScores.includes(6 - _value)));

          if (focusedScores.length && !isFocused) {
            // cet élément n'est pas focused
            opacity = _value ? 0.1 : 0.5; // on reduit moins l'opacité si c'est une frise vide
          }

          const shadow = isFocused
            ? {
                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
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

          const firstSquare = i === 0;
          const lastSquare = i === data.length - 1;
          return (
            <View key={`${title}-${i}`} style={styles.squareItemContainer}>
              <View
                style={[
                  styles.square,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: color,
                    opacity,
                    borderBottomStartRadius: !isFocused && firstSquare ? 5 : 0,
                    borderTopStartRadius: firstSquare ? 5 : 0,
                    borderBottomEndRadius: !isFocused && lastSquare ? 5 : 0,
                    borderTopEndRadius: lastSquare ? 5 : 0,
                    ...borderBottom,
                  },
                ]}
              />
              <View
                style={[
                  // eslint-disable-next-line react-native/no-inline-styles
                  { borderColor: isFocused ? color : "transparent", borderTopWidth: 0.5, ...shadow },
                ]}
              />
            </View>
          );
        })}
      </View>
      {showTraitement ? (
        <View style={styles.squareContainerTraitement}>
          {priseDeTraitement?.map((e, i) => {
            let color = "#D7D3D3";
            if (e?.value === true) color = "#5956E8";
            if (e?.value === false) color = "#E575F8";

            const firstSquare = i === 0;
            const lastSquare = i === data.length - 1;
            return (
              <View key={`${title}-${i}`} style={styles.squareItemContainerTraitement}>
                <View
                  style={[
                    styles.square,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: color,
                      borderBottomStartRadius: firstSquare ? 5 : 0,
                      borderTopStartRadius: firstSquare ? 5 : 0,
                      borderBottomEndRadius: lastSquare ? 5 : 0,
                      borderTopEndRadius: lastSquare ? 5 : 0,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ) : null}
      {showTraitement ? (
        <View style={styles.squareContainerTraitement}>
          {priseDeTraitementSiBesoin?.map((e, i) => {
            let color = "#5956E8";
            if (e?.value !== true) color = "transparent";
            return (
              <View key={`${title}-${i}`} style={styles.squareItemContainerTraitementSiBesoin}>
                <View
                  style={[
                    styles.dot,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

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
