import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View, Image} from 'react-native';
import Text from '../../components/MyText';
import BackButton from '../../components/BackButton';
import {colors} from '../../utils/colors';

const LegalScreen = ({navigation, title, content}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <BackButton onPress={navigation.goBack} />
        <Image
          style={styles.image}
          source={require('../../../assets/imgs/logo2.png')}
        />
      </View>
      <Text style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        {content}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  image: {
    height: 50,
    width: 50,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: colors.BLUE,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  container: {
    padding: 15,
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LegalScreen;
