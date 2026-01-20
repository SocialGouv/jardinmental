import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";

const Mark = ({ onPress, selected, bad, good }) => (
  <>
    <View style={styles.container}>
      {[...Array(11).keys()].map((mark, index, array) => (
        <TouchableOpacity style={styles.markButton} onPress={() => onPress(mark)} key={mark}>
          <View style={[styles.mark, index === array.length - 1 && styles.last, mark === selected && styles.markSelected]}>
            <Text style={[styles.markText, mark === selected && styles.markTextSelect]}>{mark}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.markHint}>
      <Text style={styles.markHintText}>{bad}</Text>
      <Text style={styles.markHintText}>{good}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: "row",
    width: "100%",
    flexShrink: 0,
  },
  mark: {
    height: 40,
    borderWidth: 1,
    borderColor: "#b8b8b8",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 3,
  },
  last: {
    marginRight: 0,
  },
  markSelected: {
    backgroundColor: colors.BLUE,
  },
  markText: {
    fontWeight: "bold",
    fontFamily: "SourceSans3-Bold",
    color: "#191919",
  },
  markTextSelect: {
    color: "#fff",
  },
  markButton: {
    flexBasis: 20,
    flexGrow: 1,
  },
  markHint: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  markHintText: {
    color: "#999",
  },
});

export default Mark;
