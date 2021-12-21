import React, {useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {colors} from '../utils/colors';
import Icon from './Icon';
import Text from './MyText';
import Settings from '../scenes/settings/settings-modal';
import Drawer from './drawer';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {needUpdate} from '../services/versionChecker';
import {getBadgeNotesVersion} from '../scenes/news';
import localStorage from '../utils/localStorage';

const Header = ({title, navigation}) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState();
  const [badge, setBadge] = useState(false);
  const route = useRoute();

  const updateBadge = async () => {
    const update = await needUpdate();
    const news = await getBadgeNotesVersion();
    const supported = await localStorage.getSupported();
    const badgeProNPS = await localStorage.getVisitProNPS();
    setBadge(update || news || (supported === 'PRO' && !badgeProNPS));
  };

  useFocusEffect(
    React.useCallback(() => {
      updateBadge();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Settings
        visible={settingsVisible}
        navigation={navigation}
        onClick={() => setSettingsVisible(false)}
      />
      <Drawer
        visible={drawerVisible}
        navigation={navigation}
        onClick={() => {
          updateBadge();
          setDrawerVisible(false);
        }}
      />
      <Icon
        badge={badge}
        icon="BurgerSvg"
        width={24}
        height={24}
        onPress={() => setDrawerVisible(true)}
        styleContainer={{marginRight: 20}}
      />
      <Text style={styles.title}>{title}</Text>
      <Icon
        spin={settingsVisible}
        icon="GearSvg"
        width={30}
        height={30}
        onPress={() => setSettingsVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'white',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
  },
  title: {
    fontSize: Dimensions.get('window').width > 370 ? 19 : 14,
    color: colors.BLUE,
    marginRight: 'auto',
    fontWeight: 'bold',
    flex: 1,
  },
});

export default Header;
