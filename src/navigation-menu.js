import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationButton from './navigation-button';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#4030a533',
    backgroundColor: 'white',
  },
});

const navigationItems = [
  {
    id: 'main',
    label: 'Journal',
    icon: 'assets/svg/smile.svg',
  },
  {
    id: 'add',
    label: '+',
    icon: 'assets/svg/smile.svg',
  },
  {
    id: 'calendar',
    label: 'Calendrier',
    icon: 'assets/svg/smile.svg',
  },
];

const NavigationMenu = () => {
  const [view, setView] = useState('main');
  return (
    <View style={styles.container}>
      {navigationItems.map(({label, id, icon}) => (
        <NavigationButton
          key={id}
          setView={setView}
          view={view}
          selfView={id}
          label={label}
          Icon={icon}
        />
      ))}
    </View>
  );
};

export default NavigationMenu;
