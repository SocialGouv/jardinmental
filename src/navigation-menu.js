import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationButton from './navigation-button';
import DiarySvg from '../assets/svg/diary.svg';
import PlusSvg from '../assets/svg/plus.svg';
import CalendarSvg from '../assets/svg/calendar.svg';

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
    icon: <DiarySvg />,
  },
  {
    id: 'add',
    icon: <PlusSvg />,
  },
  {
    id: 'calendar',
    label: 'Calendrier',
    icon: <CalendarSvg />,
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
          icon={icon}
        />
      ))}
    </View>
  );
};

export default NavigationMenu;
