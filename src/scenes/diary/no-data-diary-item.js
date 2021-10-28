import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {canEdit} from './diary';

const NoDataDiaryItem = ({date}) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.noDataTitle}>
        {canEdit(date)
          ? "Vous n'avez rien saisi ce jour-là"
          : 'Vous ne pouvez plus saisir votre questionnaire pour ce jour'}
      </Text>
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
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
});

export default NoDataDiaryItem;
