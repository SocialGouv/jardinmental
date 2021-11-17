import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';

export default ({onPress, disabled, visible = false, isToggled}) => {
  if (!visible) return null;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.backButtonContainer,
        {transform: [{rotate: isToggled ? '0deg' : '180deg'}]},
      ]}>
      <ArrowUpSvg color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    // marginVertical: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    borderColor: '#e1e1e1',
    borderWidth: 1,
    height: 40,
    width: 40,
    display: 'flex',
    position: 'absolute',
    right: 0,
    bottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
