import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import { scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

export const FriseGraph = ({
  title,
  data,
  focusedScores,
  showTraitement,
  priseDeTraitement,
  priseDeTraitementSiBesoin,
}) => {
  return (
    <View style={styles.friseContainer}>
      {title ? <Text style={styles.friseTitle}>{title}</Text> : null}
      <View style={styles.squareContainer}>
        {data?.map((e, i) => {
          let color = scoresMapIcon[e?.value]?.color || "#D7D3D3";

          let opacity = 1;
          if (focusedScores.length && !focusedScores.includes(e?.value)) {
            // cet élément n'est pas focused
            opacity = e?.value ? 0.1 : 0.5; // on reduit moins l'opacité si c'est une frise vide
          }

          const isFocused =
            e?.value &&
            focusedScores.length > 0 &&
            focusedScores.length < 5 &&
            focusedScores.includes(e?.value);

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
                borderColor: scoresMapIcon[e?.value]?.borderColor,
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
    backgroundColor: "#1FC6D5",
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
