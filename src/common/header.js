import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';
import {colors} from './colors';
import Icon from '../common/icon';
import Text from '../components/MyText';
import Settings from '../settings/settings-modal';
import Drawer from '../drawer';
import {useRoute} from '@react-navigation/native';

const Header = ({title, navigation}) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState();
  const route = useRoute();

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
        onClick={() => setDrawerVisible(false)}
      />
      <Icon
        badge
        icon="BurgerSvg"
        width={24}
        height={24}
        onPress={() => setDrawerVisible(true)}
        styleContainer={{marginRight: 20}}
      />
      <Text style={styles.title}>{title}</Text>
      {route.name === 'Diary' ? (
        <Icon
          spin={settingsVisible}
          icon="GearSvg"
          width={30}
          height={30}
          onPress={() => setSettingsVisible(true)}
        />
      ) : null}
      {route.name === 'Calendar' ? (
        <Icon
          color="#26387C"
          icon="ExportDataSvg"
          width={30}
          height={30}
          onPress={() => navigation.navigate('export')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
  },
});

export default Header;
