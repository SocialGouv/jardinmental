import React, {useContext, useCallback, useState, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import Text from '../../components/MyText';
import {DiaryDataContext} from '../../context/diaryData';
import {colors} from '../../utils/colors';
import {formatDateThread} from '../../utils/date/helpers';
import StatusItem from './status-item';
import {canEdit} from './utils/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getGoalsData} from '../../utils/localStorage/goals';
import localStorage from '../../utils/localStorage';

export const DiaryList = forwardRef(({...props}, ref) => {
  const navigation = useNavigation();
  const [diaryData] = useContext(DiaryDataContext);
  const sortedData = Object.keys(diaryData).sort((a, b) => {
    a = a.split('/').reverse().join('');
    b = b.split('/').reverse().join('');
    return b.localeCompare(a);
  });

  const [indicateurs, setIndicateurs] = useState();
  const [goalsData, setGoalsData] = useState();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIndicateurs(await localStorage.getIndicateurs());
        setGoalsData(await getGoalsData());
      })();
    }, []),
  );

  const renderItem = useCallback(
    ({item: date}) => {
      return (
        <View>
          <View style={styles.dateContainer}>
            <View style={styles.dateDot} />
            {canEdit(date) ? (
              <Text style={styles.dateLabel}>{formatDateThread(date)}</Text>
            ) : (
              <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('too-late', {date})}>
                <Text style={styles.dateLabel}>{formatDateThread(date)}</Text>
              </TouchableOpacity>
            )}
          </View>
          <StatusItem date={date} indicateurs={indicateurs} patientState={diaryData[date]} goalsData={goalsData} navigation={navigation} />
        </View>
      );
    },
    [diaryData, goalsData, indicateurs],
  );

  const keyExtractor = useCallback(date => date);

  return <Animated.FlatList ref={ref} data={sortedData} renderItem={renderItem} keyExtractor={keyExtractor} {...props} />;
});

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_BLUE,
  },
  dateLabel: {
    color: '#000',
    fontSize: 13,
    textAlign: 'left',
    paddingLeft: 10,
    fontWeight: '600',
  },
});
