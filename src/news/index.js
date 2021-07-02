import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';

import {colors} from '../utils/colors';
import BackButton from '../components/BackButton';
import Card from './card';
import Item from './Item';
import Text from '../components/MyText';
import localStorage from '../utils/localStorage';

export const getBadgeNotesVersion = async () => {
  let lastNotesVersion = await localStorage.getNotesVersion();
  return lastNotesVersion !== LAST_NOTES_VERSION;
};

export const LAST_NOTES_VERSION = '1.13';

export default ({navigation}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />

      <ScrollView
        style={styles.cgu}
        contentContainerStyle={styles.scrollContainer}>
        <Card
          title="Mon Suivi Psy se refait une beauté !"
          version="v1.13"
          date="12/05/2021">
          <Item>
            <Text style={styles.text}>
              Le nouveau bouton en haut à gauche de votre écran ouvre un{' '}
              <Text style={styles.bold}>menu</Text>. Il vous permet de naviguer
              plus facilement entre tous les écrans secondaires de l'application
              Mon Suivi Psy.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Le nouveau bouton en haut à droite de votre écran ouvre les{' '}
              <Text style={styles.bold}>paramètres</Text>. Vous pouvez
              sélectionner vos symptômes, indiquer votre traitement
              médicamenteux si besoin, définir un rappel, etc.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              Vous pouvez maintenant rentrer les{' '}
              <Text style={styles.bold}>traitements</Text> que vous prenez dans
              l’application. Tous les médicaments ne sont pas accessibles, vous
              pouvez nous informer si vous souhaitez ajouter le vôtre. Lors de
              l’export de vos données, les informations concernant vos prises de
              traitements médicamenteux seront aussi transmises, en bas des
              courbes de suivi des symptômes.
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              La barre de navigation retrouve sa{' '}
              <Text style={styles.bold}>simplicité</Text>, avec un accès rapide
              à votre journal et à votre calendrier. Vous pouvez retrouver
              l'onglet <Text style={[styles.italic, styles.bold]}>Infos</Text>{' '}
              dans le menu (en haut à gauche de votre écran).
            </Text>
          </Item>
          <Item>
            <Text style={styles.text}>
              L'<Text style={styles.bold}>export</Text> de vos données est
              possible depuis le menu ainsi que depuis votre calendrier (le
              bouton d'export vient remplacer le bouton des réglages).
            </Text>
          </Item>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {color: '#333'},
  bold: {fontWeight: 'bold'},
  italic: {fontStyle: 'italic'},
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
