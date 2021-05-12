import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import DrawerItem from './drawer-item';
import {needUpdate} from '../services/versionChecker';
import {getBadgeNotesVersion} from '../news';
import localStorage from '../utils/localStorage';
import {LAST_NOTES_VERSION} from '../news';

export default ({navigation, visible, onClick}) => {
  const [isVisible, setIsVisible] = useState();
  const [updateVisible, setUpdateVisible] = useState(false);
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
              onClick={async () => {
                await localStorage.setNotesVersion(LAST_NOTES_VERSION);
                onClick();
              }}
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
            <DrawerItem
              title="Exporter mes données"
              path="export"
              navigation={navigation}
              onClick={onClick}
              icon="ExportDataSettingSvg"
            />
            {/* <DrawerItem title="Donnez mon avis" onClick={() => {}} /> */}
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
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const Separator = () => <View style={styles.separator}></View>;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
  },
  separator: {
    borderColor: '#eee',
    borderTopWidth: 1,
    marginHorizontal: 30,
  },
  scrollContainer: {
    paddingBottom: 80,
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
