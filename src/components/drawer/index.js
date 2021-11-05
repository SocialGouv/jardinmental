import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Dimensions,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import DrawerItem from './drawer-item';
import {needUpdate} from '../../services/versionChecker';
import localStorage from '../../utils/localStorage';
import {getBadgeNotesVersion} from '../../scenes/news';
import pck from '../../../package.json';
import Text from '../../components/MyText';

export default ({navigation, visible, onClick}) => {
  const [isVisible, setIsVisible] = useState();
  const [updateVisible, setUpdateVisible] = useState(false);
  const [npsProIsVisible, setNpsProIsVisible] = useState(true);
  const [badgeNpsProIsVisible, setBadgeNpsProIsVisible] = useState(false);
  const [badgeNotesVersionVisible, setBadgeNotesVersionVisible] = useState(
    false,
  );

  useEffect(() => {
    setIsVisible(visible);

    (async () => {
      const u = await needUpdate();
      setUpdateVisible(u);
      const n = await getBadgeNotesVersion();
      setBadgeNotesVersionVisible(n);
      const proNPS = await localStorage.getSupported();
      setNpsProIsVisible(proNPS === 'PRO');
      const badgeProNPS = await localStorage.getVisitProNPS();
      setBadgeNpsProIsVisible(!badgeProNPS);
    })();
  }, [visible]);

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
            <DrawerItem
              badge={badgeNotesVersionVisible}
              title="Nouveautés"
              path="news"
              navigation={navigation}
              onClick={onClick}
              icon="NewsSvg"
            />
            <Separator />
            <DrawerItem
              title="Présentation"
              path="onboarding"
              navigation={navigation}
              onClick={onClick}
              icon="PresentationSvg"
            />
            <DrawerItem
              title="Informations"
              path="infos"
              navigation={navigation}
              onClick={onClick}
              icon="InfoSvg"
            />
            <DrawerItem
              title="Parler à quelqu'un"
              path="contact"
              navigation={navigation}
              onClick={onClick}
              icon="PhoneSvg"
            />
            <DrawerItem
              title="Protection des données"
              path="privacy"
              navigation={navigation}
              onClick={onClick}
              icon="ProtectionSvg"
            />
            <DrawerItem
              title="Mentions légales"
              path="legal-mentions"
              navigation={navigation}
              onClick={onClick}
              icon="SymptomsSetting"
            />
            <Separator />
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
            {npsProIsVisible ? (
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
            ) : null}
            <View style={styles.versionContainer}>
              <Text style={styles.versionLabel}>version {pck.version}</Text>
            </View>
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
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
  },
  versionLabel: {
    color: '#ccc',
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
});
