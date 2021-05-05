import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors} from './colors';
import Icon from '../common/icon';
import Text from '../components/MyText';
import Settings from '../settings/settings-modal';
import Drawer from '../drawer';

const Header = ({title, navigation}) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(true);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.container}>
        <Settings
          visible={settingsVisible}
          navigation={navigation}
          onClick={() => setSettingsVisible(false)}
        />
        <Drawer
          visible={drawerVisible}
          navigation={navigation}
          onClick={() => setDrawerVisible(false)}
        />
        <Icon
          icon="BurgerSvg"
          width={30}
          height={30}
          onPress={() => setDrawerVisible(true)}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => setSettingsVisible(true)}>
        <Text style={styles.settings}>Réglages</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    display: 'flex',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    color: colors.BLUE,
    marginRight: 'auto',
    fontWeight: '700',
  },
  settings: {
    fontSize: 16,
    color: colors.BLUE,
    fontWeight: '700',
    paddingTop: 5,
  },
});

export default Header;
