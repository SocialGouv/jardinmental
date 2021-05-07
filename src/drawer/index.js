import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
// import Text from '../components/MyText';
import DrawerItem from './drawer-item';

export default ({navigation, visible, onClick}) => {
  const [isVisible, setIsVisible] = useState();
  useEffect(() => {
    setIsVisible(visible);
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
