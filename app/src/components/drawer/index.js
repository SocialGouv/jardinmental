import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Platform, SafeAreaView, Dimensions, View, ScrollView, Linking, TouchableWithoutFeedback, Alert} from 'react-native';
import Modal from 'react-native-modal';
import DrawerItem from './drawer-item';
import LegalItem from './legal-item';
import localStorage from '../../utils/localStorage';
import {getBadgeNotesVersion} from '../../scenes/news';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import NeedUpdateContext from '../../context/needUpdate';
import {HOST, HMAC_SECRET} from '../../config';
import {recommendApp} from '../../utils/share';
import app from '../../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({navigation, visible, onClick}) => {
  const [isVisible, setIsVisible] = useState();
  const updateVisible = useContext(NeedUpdateContext);

  const [devModeCount, setDevModeCount] = useState(1);
  const [isDevMode, setIsDevMode] = useState(false);
  const [npsProIsVisible, setNpsProIsVisible] = useState(true);
  const [badgeNpsProIsVisible, setBadgeNpsProIsVisible] = useState(false);
  const [badgeNotesVersionVisible, setBadgeNotesVersionVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
    (async () => {
      const n = await getBadgeNotesVersion();
      setBadgeNotesVersionVisible(n);
      const proNPS = await localStorage.getSupported();
      setNpsProIsVisible(proNPS === 'PRO');
      const badgeProNPS = await localStorage.getVisitProNPS();
      setBadgeNpsProIsVisible(!badgeProNPS);
      const devMode = await AsyncStorage.getItem('devMode');
      setIsDevMode(devMode === 'true');
    })();
  }, [visible]);

  const handleDevModePress = async () => {
    const newCount = devModeCount + 1;
    setDevModeCount(newCount);
    if (newCount % 5 === 0) {
      await AsyncStorage.setItem('devMode', 'true');
      setIsDevMode('true');
      Alert.alert('Dev Mode', 'Dev mode activated!');
    }
  };

  const deviceHeight = Dimensions.get('window').height;
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={onClick}
      onSwipeComplete={onClick}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      deviceHeight={deviceHeight}>
      <View style={styles.card}>
        <SafeAreaView>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Jardin Mental</Text>
            <DrawerItem badge={badgeNotesVersionVisible} title="Nouveautés" path="news" navigation={navigation} onClick={onClick} icon="NewsSvg" />
            <Separator />
            <DrawerItem title="Présentation" path="presentation" navigation={navigation} onClick={onClick} icon="PresentationSvg" />
            <DrawerItem title="Recommander Jardin&nbsp;Mental" onClick={recommendApp} icon="ShareSvg" />
            <DrawerItem title="Parler à quelqu'un et s'informer" path="infos" navigation={navigation} onClick={onClick} icon="PhoneSvg" />
            <DrawerItem title="Nous contacter" path="contact" navigation={navigation} onClick={onClick} icon="PeopleSvg" />
            <DrawerItem title="Qui peut voir mes données ?" path="privacy-light" navigation={navigation} onClick={onClick} icon="LockSvg" />
            {updateVisible ? (
              <DrawerItem
                badge
                title="Mettre à jour"
                icon="NewsSvg"
                onClick={() =>
                  Linking.openURL(
                    Platform.OS === 'ios'
                      ? 'itms-apps://apps.apple.com/FR/app/id1540061393'
                      : 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.monsuivipsy',
                  )
                }
              />
            ) : null}
            <DrawerItem
              badge={badgeNpsProIsVisible}
              title="Donner mon avis"
              icon="LightBulbSvg"
              path="contribute-pro"
              navigation={navigation}
              onClick={async () => {
                await localStorage.setVisitProNPS(true);
                onClick();
              }}
            />
            {isDevMode && <DrawerItem title="Dev Mode" path="dev-mode" navigation={navigation} onClick={onClick} icon="GearSvg" />}
            <Separator />
            <LegalItem title="Conditions générales d'utilisation" path="cgu" navigation={navigation} onClick={onClick} />
            <LegalItem title="Politique de confidentialité" path="privacy" navigation={navigation} onClick={onClick} />
            <LegalItem title="Mentions légales" path="legal-mentions" navigation={navigation} onClick={onClick} />
            <TouchableWithoutFeedback onPress={handleDevModePress}>
              <View style={styles.versionContainer}>
                <Text style={styles.versionLabel}>
                  {Platform.OS === 'ios' ? `${app.expo.version} (${app.expo.ios.buildNumber})` : `${app.expo.version} (${app.expo.android.versionCode})`}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
  },
  separator: {
    borderColor: '#eee',
    borderTopWidth: 1,
    marginHorizontal: 30,
    marginVertical: 15,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  versionContainer: {
    marginTop: 47,
    flex: 1,
    alignItems: 'center',
  },
  versionLabel: {
    color: '#ddd',
  },
  buildNumberLabel: {
    color: '#eee',
  },
  card: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 30,
    paddingTop: 15,
    color: colors.DARK_BLUE,
  },
});
