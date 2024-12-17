import React from 'react';
import {View, StyleSheet, SafeAreaView, Dimensions, Text} from 'react-native';
// import Pdf from "react-native-pdf";
// import * as WebBrowser from 'expo-web-browser';
import {WebView} from 'react-native-webview';

const PdfViewer = () => {
  const source = {
    uri: 'https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf',
    cache: true,
  };

  return (
    <View className="flex-1 flex-col w-full h-full">
      <WebView
        style={{width: '100%', height: '100%'}}
        // source={{html: "<html><body style='color:red'>Hello<br/>This is a test</body></html>"}}
        source={{uri: 'https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf'}}
      />
    </View>

    // {/* <WebView
    //   style={{width: '100%', height: '100%'}}
    //   source={{
    //     uri: 'https://jardinmental.fabrique.social.gouv.fr/Notice%20Jardin%20Mental.pdf',
    //   }}
    // /> */}

    //   {/*
    // <SafeAreaView className="flex-1 bg-red-500 items-center justify-center">

    //   <View className="flex-1 justify-start items-center">
    //     <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
    //   </View>
    //   </SafeAreaView>
    //   */}
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfViewer;
