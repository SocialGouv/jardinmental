import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

const PdfViewer = () => {
  const source = {
    uri: "https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf",
    cache: true,
  };

  return (
    <View style={styles.container}>
      <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PdfViewer;