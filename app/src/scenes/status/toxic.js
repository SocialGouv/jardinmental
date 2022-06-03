import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../components/MyText";

const Toxic = ({ data }) => {
  if (!data || !data.value) return null;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Substances</Text>
          <Text>{data.userComment || "Oui"}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(38, 56, 124, 0.08)",
    marginVertical: 10,
    width: "60%",
    alignSelf: "center",
  },
  textContainer: { width: "100%" },
  title: { fontWeight: "bold", marginBottom: 10 },
});

export default Toxic;
