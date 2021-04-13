import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import ArrowLeftSvg from '../../assets/svg/arrow-left.svg';
import InfoSvg from '../../assets/svg/info.svg';
import logEvents from '../services/logEvents';

const LegalScreen = ({navigation, title, content}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => setIsFullScreen(!isFullScreen), [
    setIsFullScreen,
    isFullScreen,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      logEvents.logInfosOpen();
    });

    return unsubscribe;
  }, [navigation]);

  // const onBackPress = () => {
  //   navigation.goBack();
  // };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.cgu}>
        <View style={styles.containerInfos}>
          <InfoSvg />
          <View paddingLeft={10} style={styles.textContainer}>
            <Text style={styles.titleInfos}>
              Les troubles psychiatriques se soignent
            </Text>
            {isFullScreen ? (
              <>
                <Text style={styles.explanation}>
                  Quand on a un doute, quand on se pose la question, c’est
                  toujours une bonne idée de consulter un professionnel de
                  santé, qui saura nous informer et nous orienter.{'\n\n'}
                  La santé mentale est une composante de la santé. Prendre soin
                  de soi passe aussi par le fait de prendre soin de sa santé
                  mentale.
                  {'\n'}
                  Il arrive qu’à certains moments de la vie, on se sente moins
                  bien psychiquement. Notre santé mentale est alors moins bonne
                  et l’on peut présenter un trouble psychiatrique. Les troubles
                  psychiatriques sont très fréquents, ils peuvent toucher
                  n’importe qui à n’importe quel moment de la vie, surtout quand
                  on se retrouve dans des situations difficiles.{'\n\n'} Le fait
                  d’avoir un trouble psychiatrique n’a aucun rapport avec une
                  quelconque faiblesse ou manque de volonté. C’est juste que
                  parfois, pour pleins de raisons différentes, notre santé
                  mentale est moins bonne, comme n’importe quelle autre
                  composante de notre santé.
                  {'\n'} Les troubles psychiatriques se soignent, encore plus
                  s’ils sont pris en charge rapidement. Quand on a un doute,
                  quand on se pose la question, c’est toujours une bonne idée de
                  consulter un professionnel de santé, qui saura nous informer
                  et nous orienter.
                </Text>
                <Text style={styles.lessButton} onPress={toggleFullScreen}>
                  Reduire
                </Text>
              </>
            ) : (
              <>
                <Text numberOfLines={5} style={styles.explanation}>
                  Quand on a un doute, quand on se pose la question, c’est
                  toujours une bonne idée de consulter un professionnel de
                  santé, qui saura nous informer et nous orienter.
                </Text>
                <Text style={styles.moreButton} onPress={toggleFullScreen}>
                  Afficher la suite
                </Text>
              </>
            )}
          </View>
        </View>
        <Text style={styles.content}>
          La santé mentale, qu’est-ce que c’est ?{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('en_savoir_plus_mentale');
              Linking.openURL(
                'https://www.psycom.org/comprendre/la-sante-mentale/on-a-toutes-et-tous-une-sante-mentale/',
              );
            }}>
            en savoir plus
          </Text>
          {'\n\n'}
          Avoir un trouble psychiatrique, c’est fréquent ? 1 personne sur 4
          souffre de troubles mentaux{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('article_OMS');
              Linking.openURL(
                'https://www.who.int/whr/2001/media_centre/press_release/fr/',
              );
            }}>
            Article de l'OMS
          </Text>
          {'\n\n'}
          On a tous besoin d'aide à un moment ou un autre de notre vie.{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('voir_un_psy');
              Linking.openURL('https://pasapas-jeunes.com/j-ai-besoin-d-aide');
            }}>
            C’est grave d’aller voir un psy ?{' '}
          </Text>
          {'\n\n'}
          Quels sont les différents troubles psy ?{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('en_savoir_plus_troubles');
              Linking.openURL(
                'https://www.psycom.org/comprendre/la-sante-mentale/les-troubles-psy/',
              );
            }}>
            en savoir plus
          </Text>
          {'\n\n'}
          Quelle est la différence entre un psychologue et un psychiatre ?{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('article_difference');
              Linking.openURL('https://doctomag.com/psychologue-psychiatre/');
            }}>
            lire l'article
          </Text>
          {'\n\n'}
          Je voudrais des informations sur les traitement médicamenteux :{' '}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('reseau_pic');
              Linking.openURL(
                'http://www.reseau-pic.info/?dest=fiches/nom.php',
              );
            }}>
            reseau-pic.com{' '}
          </Text>
          {'\n\n\n'}
          Pour simplement parler à quelqu’un :{'\n'}
          {'\n'}
          SOS-amitiés 24h/24 et 7j/7{'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:09 72 39 40 50');
            }}>
            09 72 39 40 50
          </Text>
          {'\n\n'}
          SOS Suicide Phénix 13h-23h00 {'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:01 40 44 46 45');
            }}>
            01 40 44 46 45
          </Text>
          {'\n\n'}
          Fil Santé Jeune Tous les jours, 9h-23h {'\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:0 800 235 236');
            }}>
            0 800 235 236
          </Text>
        </Text>
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
    marginBottom: 72,
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

export default LegalScreen;
