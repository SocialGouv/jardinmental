import React from 'react';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Screen1Image from './Screen1-im';
import Screen2Image from './Screen2-im';
import Screen3Image from './Screen3-im';

import {StyleSheet, View, Dimensions} from 'react-native';
export const buttonHeight = 43;
export const buttonSmallHeight = 30;
export const defaultPadding = Math.min(
  Dimensions.get('window').width * 0.7,
  30,
);
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const menuHeight = 80;
console.log();

export const Screen1 = () => (
  <View style={styles.container}>
    <Screen1Image style={styles.image} />
    <Text style={styles.presentationText}>
      <Text style={styles.bold}>Auto-observation</Text>
      {'\n\n'}Chaque jour, je note mes{' '}
      <Text style={styles.emphasis}>ressentis</Text>, les{' '}
      <Text style={styles.emphasis}>événements</Text> qui m'ont marqués, mes
      prises de <Text style={styles.emphasis}>traitement</Text>.
    </Text>
  </View>
);
export const Screen2 = () => (
  <View style={styles.container}>
    <Screen2Image style={styles.image} />
    <Text style={styles.presentationText}>
      <Text style={styles.bold}>Courbes de mes ressentis</Text>
      {'\n\n'}Plus je l'utilise, plus je peux{' '}
      <Text style={styles.emphasis}>observer</Text> mes tendances et commencer à
      voir des <Text style={styles.emphasis}>liens</Text>.
    </Text>
  </View>
);
export const Screen3 = () => (
  <View style={styles.container}>
    <Screen3Image style={styles.image} />
    <Text style={styles.presentationText}>
      <Text style={styles.bold}>Arriver préparé</Text>
      {'\n\n'}Le jour de ma consultation, j'ai une{' '}
      <Text style={styles.emphasis}>vision complète</Text> de ce que j'ai vécu
      et de ce qui m'a interrogé pour en{' '}
      <Text style={styles.emphasis}>parler</Text> avec mon psy
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emphasis: {
    color: '#1FC6D5',
  },
  bold: {
    fontWeight: 'bold',
  },
  presentationText: {
    marginTop: 15,
    fontSize: Dimensions.get('window').height > 600 ? 20 : 15,
    color: '#0A215C',
  },
  image: {
    height: screenHeight * (Dimensions.get('window').height > 600 ? 0.15 : 0.1),
    width: screenWidth,
    marginVertical: 0,
  },
});
