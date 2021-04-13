import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import ArrowLeftSvg from '../../assets/svg/arrow-left.svg';

const LegalScreen = ({navigation, title, content}) => {
  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackPress} style={styles.button}>
          <ArrowLeftSvg />
        </TouchableOpacity>
        <Text style={styles.content}>
          <Text style={styles.title}>{title}</Text>
        </Text>
        <View style={styles.button} />
      </View>
      <ScrollView style={styles.cgu}>{content}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: colors.BLUE,
    fontSize: 20,
    padding: 20,
    fontWeight: '700',
  },
  cgu: {
    padding: 15,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LegalScreen;
