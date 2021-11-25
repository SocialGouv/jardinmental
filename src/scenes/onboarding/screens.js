import React from 'react';
import Text from '../../components/MyText';

import SurveyMenu from '../../../assets/svg/SurveyMenu';
import DiaryMenu from '../../../assets/svg/DiaryMenu';
import ExerciseMenu from '../../../assets/svg/ExerciseMenu';
import GraphMenu from '../../../assets/svg/GraphMenu';

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
const size =
  screenHeight * (Dimensions.get('window').height > 600 ? 0.15 : 0.1);

export const Screen1 = () => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <SurveyMenu height={size} width={size} style={styles.image} />
      <DiaryMenu height={size} width={size} style={styles.image} />
    </View>
    <Text style={styles.presentationText}>
      <Text style={styles.bold}>Auto-observation</Text>
      {'\n\n'}Chaque jour, j'évalue{' '}
      <Text style={styles.emphasis}>mes ressentis</Text>, je note{' '}
      <Text style={styles.emphasis}>les traitements</Text> que je prends et{' '}
      <Text style={styles.emphasis}>les événements</Text> qui m'ont marqués.
    </Text>
  </View>
);
export const Screen2 = () => (
  <View style={styles.container}>
    <GraphMenu height={size} width={size} style={styles.image} />
    <Text style={styles.presentationText}>
      <Text style={styles.bold}>Courbes de mes ressentis</Text>
      {'\n\n'}Plus j'utilise l'application, plus je peux{' '}
      <Text style={styles.emphasis}>observer</Text> mes{' '}
      <Text style={styles.emphasis}>ressentis</Text> et{' '}
      <Text style={styles.emphasis}>comprendre</Text> leur évolution.
    </Text>
  </View>
);
export const Screen3 = () => (
  <View style={styles.container}>
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
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginBottom: Dimensions.get('window').height > 600 ? 20 : 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emphasis: {
    color: '#1FC6D5',
  },
  bold: {
    fontWeight: 'bold',
  },
  presentationText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: Dimensions.get('window').height > 600 ? 20 : 15,
    color: '#0A215C',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    color: '#C3C7D5',
    marginVertical: 0,
  },
});
