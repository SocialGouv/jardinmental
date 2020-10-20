import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
//import SVGImage from 'assets/svg/smile.svg';

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
    flexBasis: 75,
  },
  buttonText: {
    marginTop: 4,
    fontFamily: 'Raleway-SemiBold',
    fontSize: 15,
    color: '#4030a5',
    flexWrap: 'nowrap',
  },
});

const NavigationButton = ({setView, view, selfView, icon, label}) => {
  const selected = view === selfView;
  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        setView(selfView);
      }}>
      <View style={styles.buttonContainer}>
        <View
          style={styles.buttonText}
          allowFontScaling={false}
          selected={selected}>
          <Text>{label}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NavigationButton;
