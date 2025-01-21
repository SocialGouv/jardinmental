import React from 'react';
import {View, Platform, Text, SafeAreaView, Pressable} from 'react-native';
import {WebView} from 'react-native-webview';

const PdfViewer = ({navigation}) => {
  const uri =
    Platform.OS === 'android'
      ? 'https://docs.google.com/gview?embedded=true&url=https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf'
      : 'https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf';

  return (
    <SafeAreaView className="flex-1 flex-col w-full h-full">
      <View className="flex-row items-center p-4">
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <Text className="text-gray-700 text-sm">Retour</Text>
        </Pressable>
      </View>
      <View className="flex-1">
        <WebView style={{width: '100%', height: '100%'}} source={{uri}} originWhitelist={['*']} javaScriptEnabled={true} domStorageEnabled={true} />
      </View>
    </SafeAreaView>
  );
};

export default PdfViewer;

// BEFORE
// import React from "react";
// import { View, StyleSheet, SafeAreaView, Dimensions } from "react-native";
// import Pdf from "react-native-pdf";

// const PdfViewer = () => {
//   const source = {
//     uri: "https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf",
//     cache: true,
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-1 justify-start items-center">
//         <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   pdf: {
//     flex: 1,
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
// });

// export default PdfViewer;
