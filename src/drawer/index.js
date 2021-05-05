import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Text from '../components/MyText';
import DrawerItem from './drawer-item';

export default ({navigation, visible, onClick}) => {
  const [isVisible, setIsVisible] = useState();
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const deviceHeight = Dimensions.get('window').height;
  return (
    <Modal
      style={{margin: 0, flex: 1}}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onSwipeComplete={() => setIsVisible(false)}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      deviceHeight={deviceHeight}>
      <View style={styles.safe}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPressOut={onClick}>
          <SafeAreaView style={styles.card}>
            <DrawerItem
              title="Nouveauté"
              path="reminder"
              navigation={navigation}
              onClick={onClick}
              icon="ReminderSettingSvg"
            />
            <Separator />
            <DrawerItem
              title="Présentation"
              path="onboarding"
              navigation={navigation}
              onClick={onClick}
              icon="ReminderSettingSvg"
            />
            <DrawerItem
              title="Protection des données"
              path="reminder"
              navigation={navigation}
              onClick={onClick}
              icon="ReminderSettingSvg"
            />
            <DrawerItem
              title="Mention légales"
              path="reminder"
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
            <DrawerItem
              title="Donnez votre avis"
              path="reminder"
              navigation={navigation}
              onClick={onClick}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const Separator = () => <View style={styles.separator}></View>;

const styles = StyleSheet.create({
  safe: {flex: 1},
  separator: {
    borderColor: '#eee',
    borderTopWidth: 1,
    marginHorizontal: 30,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#0A215C50',
  },
  card: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 30,
  },
});
