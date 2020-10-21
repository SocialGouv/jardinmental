import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    padding: 20,
  },
});

const Header = () => {
  return (
    <View>
      <Text style={styles.title}>Mon journal</Text>
    </View>
  );
};

export default Header;
