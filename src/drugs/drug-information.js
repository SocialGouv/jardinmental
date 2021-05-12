import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import InfoSvg from '../../assets/svg/info.svg';
import ArrowUpSvg from '../../assets/svg/arrow-up.svg';
import logEvents from '../services/logEvents';

export default ({visible = false, onClose}) => {
  const [isFullScreen, setIsFullScreen] = useState(visible);

  useEffect(() => {
    setIsFullScreen(visible);
  }, [visible]);

  const toggleFullScreen = useCallback(() => {
    onClose();
    setIsFullScreen(!isFullScreen);
  }, [setIsFullScreen, isFullScreen]);

  return isFullScreen ? (
    <SafeAreaView style={styles.fullScreenContainer}>
      <TouchableOpacity style={styles.arrow} onPress={toggleFullScreen}>
        <InfoSvg style={styles.icon} />
        <Text style={styles.title}>Informations</Text>
        <ArrowUpSvg style={{transform: [{rotate: '180deg'}]}} color="#26387C" />
      </TouchableOpacity>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.text}>
            Les noms des médicaments et les posologies ne sont donnés qu'à titre
            indicatif pour vous aider dans le suivi de votre traitement
            médicamenteux. Il convient néanmoins de toujours se référer à la
            prescription médicale vous concernant et à votre médecin référent
            pour tout ce qui a trait à votre traitement médicamenteux en
            particulier et à votre suivi en général.
          </Text>
          <Text>
            Je voudrais des informations sur les traitements médicamenteux :{' '}
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
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38,56,124, 0.08)',
    padding: 15,
  },
  icon: {
    color: colors.BLUE,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLUE,
    marginRight: 15,
    marginLeft: 5,
  },
  footer: {
    padding: 15,
  },
  arrow: {
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderColor: 'rgba(38,56,124, 0.08)',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  fullScreenContainer: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 25,
    paddingVertical: 50,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  link: {
    color: colors.LIGHT_BLUE,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  text: {
    marginBottom: 20,
    textAlign: 'justify',
  },
});
