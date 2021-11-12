import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import Icon from '../../components/Icon';
import {parseISO, differenceInDays} from 'date-fns';
import {colors} from '../../utils/colors';
import {DiaryDataContext} from '../../context';
import {confirm, deleteBeckfromDiaryData} from '../../utils';
import logEvents from '../../services/logEvents';

export default ({data, date, onPress}) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const handleDelete = ({date, beckId}) => {
    confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      onConfirm: () => {
        logEvents.logDeleteBeck();
        deleteBeckfromDiaryData({date, beckId, diaryData, setDiaryData});
      },
      cancelText: 'Annuler',
      confirmText: 'Oui, supprimer',
    });
  };

  const render = (beck, beckId) => {
    return (
      <View style={styles.posologyItem}>
        <View style={styles.posologyName}>
          {beck?.mainEmotion && beck?.mainEmotionIntensity ? (
            <>
              <Text style={styles.text1}>
                {beck?.mainEmotion} - {`${beck?.mainEmotionIntensity * 10}%`}
              </Text>
              {beck?.where ? (
                <Text style={styles.text2}>{beck?.where}</Text>
              ) : null}
            </>
          ) : (
            <Text style={styles.draft}>
              Colonnes de Beck <Text style={styles.italic}>(brouillon)</Text>
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDelete({date: beck?.date, beckId})}>
          <Icon icon="BinSvg" color="#58C8D2" width={25} height={25} />
        </TouchableOpacity>
      </View>
    );
  };

  const canEdit = differenceInDays(new Date(), parseISO(date)) <= 30; //isToday(parseISO(date)) || isYesterday(parseISO(date));

  return (
    <View>
      <View style={styles.divider} />
      {Object.keys(data).map((i, j) => {
        const beck = data[i];
        return (
          <TouchableOpacity
            key={j}
            style={[styles.container, canEdit && styles.containerEditable]}
            onPress={() => onPress(beck, i)}
            disabled={!canEdit}>
            <Icon
              icon="ThoughtsSvg"
              color="#58C8D2"
              width={25}
              height={25}
              styleContainer={styles.icon}
            />
            <View style={styles.posologyContainer}>{render(beck, i)}</View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {marginRight: 20},
  posologyItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
  },
  draft: {color: colors.DARK_BLUE},
  posologyName: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  text1: {
    fontSize: 15,
    color: '#000',
  },
  text2: {
    fontSize: 13,
    color: colors.DARK_BLUE,
    fontStyle: 'italic',
  },
  posologyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  posology: {},
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  containerEditable: {
    borderRadius: 10,
    backgroundColor: 'rgba(31, 198, 213, 0.2)',
    marginTop: 2,
  },
  posologyContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  textContainer: {width: '100%'},
  text: {
    width: '80%',
    fontSize: 15,
    marginBottom: 5,
  },
  boldText: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
});
