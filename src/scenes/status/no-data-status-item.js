import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {canEdit} from './utils/index.js';
import ArrowRightSvg from '../../../assets/svg/arrow-right.js';

const NoDataDiaryItem = ({date}) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.noDataTitle}>
        {canEdit(date)
          ? 'Renseigner mon état pour ce jour-là'
          : 'Je ne peux plus saisir mon questionnaire pour ce jour'}
      </Text>
      {canEdit(date) && <ArrowRightSvg color="#C7CED5" />}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    display: 'flex',
    marginBottom: 20,
  },
  noDataTitle: {
    fontWeight: 'bold',
    color: colors.BLUE,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});

export default NoDataDiaryItem;
