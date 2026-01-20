import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { parseISO, differenceInDays } from "date-fns";

import Icon from "../../components/Icon";
import { colors } from "../../utils/colors";

export default ({ patientState, date, navigation }) => {
  const data = patientState?.becks;
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const handleViewBeck = (beck, beckId) => {
    navigation.navigate("view-beck", {
      beckId,
      beck,
      redirect: true,
    });
  };

  return (
    <View style={styles.container}>
      {Object.keys(data).map((beckId, j) => {
        const beck = data[beckId];
        const isDraft = !beck?.mainEmotion || !beck?.mainEmotionIntensity;

        return (
          <TouchableOpacity key={j} style={[styles.item, isDraft && styles.containerEditable]} onPress={() => handleViewBeck(beck, beckId)}>
            <Icon icon="ThoughtsSvg" color="#58C8D2" width={25} height={25} styleContainer={styles.icon} />

            <View style={styles.containerContent}>
              {!isDraft ? (
                <>
                  <View style={styles.line}>
                    <Text>
                      {beck?.mainEmotion} - {`${beck?.mainEmotionIntensity * 10}%`}&nbsp;
                      {beck?.mainEmotionIntensityNuanced ? (
                        <Text style={styles.mainEmotionIntensityNuancedStyle}>&gt;&nbsp;{beck?.mainEmotionIntensityNuanced * 10}%</Text>
                      ) : null}
                    </Text>
                  </View>
                  {beck?.where ? <Text style={styles.place}>{beck?.where}</Text> : null}
                </>
              ) : (
                <Text style={styles.place}>Brouillon</Text>
              )}
            </View>
            {beck?.time && <Text style={styles.time}>à {beck.time}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  containerContent: {
    flex: 1,
  },
  container: {
    paddingLeft: 15,
    paddingBottom: 15,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: "#00CEF7",
    display: "flex",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(38, 56, 124, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(38, 56, 124, 0.08)",
    paddingVertical: 10,
    marginTop: 15,
  },
  icon: {
    marginRight: 20,
  },
  arrowIconContainer: {
    width: 14,
    height: 10,
  },
  containerEditable: {
    backgroundColor: colors.LIGHT_BLUE_TRANS_02,
  },
  place: {
    fontStyle: "italic",
    color: colors.BLUE,
  },
  time: {
    marginLeft: "auto",
    marginRight: 20,
    marginBottom: "auto",
    fontSize: 12,
    fontStyle: "italic",
    color: colors.BLUE,
  },
  mainEmotionIntensityNuancedStyle: {
    color: colors.LIGHT_BLUE,
    fontWeight: "bold",
    fontFamily: "SourceSans3-Bold",
  },
  line: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
