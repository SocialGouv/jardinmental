import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import InfoSvg from '../../../assets/svg/info.svg';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';

const SurveyExplanation = ({title = 'Explications', explanation}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(
    () => setIsFullScreen(!isFullScreen),
    [setIsFullScreen, isFullScreen],
  );

  if (explanation === null) {
    return null;
  }
  return isFullScreen ? (
    <SafeAreaView style={styles.fullScreenContainer}>
      <TouchableOpacity style={styles.arrow} onPress={toggleFullScreen}>
        <InfoSvg style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <ArrowUpSvg style={{transform: [{rotate: '180deg'}]}} color={colors.BLUE} />
      </TouchableOpacity>
      <View style={styles.container}>
        <ScrollView>
          <Text>{explanation}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  ) : (
    <View style={styles.reducedScreenContainer}>
      <TouchableOpacity style={styles.arrow} onPress={toggleFullScreen}>
        <InfoSvg style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <ArrowUpSvg color={colors.BLUE} />
      </TouchableOpacity>
      <View style={[styles.container, {paddingBottom: 10}]}>
        <Text numberOfLines={1} style={styles.text}>
          {explanation}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(38,56,124, 0.03)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38,56,124, 0.08)',
    padding: 15,
  },
  icon: {
    color: colors.BLUE,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLUE,
    marginRight: 15,
    marginLeft: 5,
  },
  footer: {
    padding: 15,
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
    marginVertical: 10,
  },
  fullScreenContainer: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 25,
    paddingVertical: 50,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default SurveyExplanation;
