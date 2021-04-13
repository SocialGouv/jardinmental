import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import InfoSvg from '../../assets/svg/info.svg';
import ArrowUpSvg from '../../assets/svg/arrow-up.svg';

const SurveyExplanation = ({title = 'Explications', explanation}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => setIsFullScreen(!isFullScreen), [
    setIsFullScreen,
    isFullScreen,
  ]);

  if (explanation === null) {
    return null;
  }
  return isFullScreen ? (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ScrollView style={styles.fullScreenContainer}>
        <Text style={[styles.title, {marginBottom: 10}]}>{title}</Text>
        <Text>{explanation}</Text>
        <TouchableOpacity
          style={[styles.arrow, {transform: [{rotate: '180deg'}]}]}
          onPress={toggleFullScreen}>
          <ArrowUpSvg color="#26387C" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <View>
      <TouchableOpacity style={styles.arrow} onPress={toggleFullScreen}>
        <InfoSvg style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <ArrowUpSvg color="#26387C" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: colors.BLUE,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLUE,
    marginRight: 15,
    marginLeft: 5,
  },
  arrow: {
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderColor: 'rgba(38,56,124, 0.08)',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  fullScreenContainer: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 25,
    paddingTop: 50,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default SurveyExplanation;
