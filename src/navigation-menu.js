import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: '15px',
    justifyContent: 'space-around',
    height: '${menuHeight}px',
    borderTopWidth: '1px',
    borderTopColor: '#4030a533',
    backgroundColor: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
    flexBasis: '75px',
  },
  buttonText: {
    marginTop: '4px',
    fontFamily: 'Raleway-SemiBold',
    fontSize: '15px',
    color: '#4030a5',
    opacity: '${({selected}) => (selected ? 1 : 0.6)}',
    flexWrap: 'nowrap',
  },
});

const Button = ({
  setView,
  view,
  selfView,
  Icon,
  caption,
  moveLeft,
  moveRight,
}) => {
  const selected = view === selfView;
  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        setView(selfView);
      }}>
      <View
        style={styles.buttonContainer}
        moveLeft={moveLeft}
        moveRight={moveRight}>
        <Icon
          size={iconSize}
          color={selected ? '#39cec0' : '#5352a3'}
          selected={selected}
        />
        <View
          style={styles.buttonText}
          allowFontScaling={false}
          selected={selected}>
          {caption}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const NavigationMenu = () => <View style={styles.container}>LOL</View>;

export default NavigationMenu;
