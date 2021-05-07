import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';

import Text from '../components/MyText';
import {colors} from '../common/colors';
import BackButton from '../components/BackButton';

export default ({navigation, title, content}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />

      <ScrollView
        style={styles.cgu}
        contentContainerStyle={styles.scrollContainer}>
        {/* mettre numero de version */}
        {/* message de base */}
        {/* toggle pour voir les nouveautés des anciennes versions */}
        <Text>pleins de nouveauté trop cool</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    color: colors.BLUE,
    fontSize: 20,
    padding: 20,
    fontWeight: '700',
  },
  cgu: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    color: colors.DARK_BLUE,
    padding: 10,
    fontSize: 16,
  },
  containerInfos: {
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderRadius: 10,
    borderWidth: 0,
    paddingTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  titleInfos: {
    fontWeight: 'bold',
    color: colors.BLUE,
    paddingBottom: 3,
  },
  textContainer: {
    width: '90%',
  },
  moreButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 10,
  },
  arrowUp: {
    borderRadius: 20,
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderColor: 'rgba(38,56,124, 0.08)',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 200,
  },
  fullScreenContainer: {
    backgroundColor: 'rgba(38,56,124, 0.03)',
    // position: 'absolute',
    zIndex: 1,
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  explanation: {
    textAlign: 'justify',
  },
  lessButton: {
    paddingBottom: 50,
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 10,
  },
  link: {
    color: colors.LIGHT_BLUE,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
