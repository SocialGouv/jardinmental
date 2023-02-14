import React from "react";
import { View, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

const PdfViewer = () => {
  const source = {
    uri: "https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf",
    cache: true,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-start items-center">
        <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PdfViewer;
