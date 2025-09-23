import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../components/MyText";

const Context = ({ data }) => {
  if (!data || !data.userComment) return null;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.container}>
        <Text style={styles.title}>Note générale</Text>
        <View style={styles.textContainer}>
          <Text>{data.userComment || "Oui"}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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

export default Context;
