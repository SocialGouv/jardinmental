import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "../../components/Icon";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";

export default ({ title, version, date, children, badge = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon badge={badge} icon="NewsSvg" color={colors.LIGHT_BLUE} width={30} height={30} styleContainer={{ marginHorizontal: 5 }} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {version} - {date}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "rgba(38, 56, 124, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(38, 56, 124, 0.08)",
    paddingTop: 20,
    display: "flex",
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  titleContainer: { flex: 1, marginBottom: 10 },
  title: { fontSize: 18, color: colors.DARK_BLUE },
  subtitle: { fontStyle: "italic", color: "#222" },
});
