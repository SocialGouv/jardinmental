import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {parseISO, differenceInDays} from 'date-fns';

import Icon from '../../components/Icon';
import {colors} from '../../utils/colors';

export default ({patientState, date, navigation}) => {
  const data = patientState?.becks;
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const handleViewBeck = (beck, beckId) => {
    navigation.navigate('view-beck', {
      beckId,
      beck,
      redirect: true,
    });
  };

  const canEdit = differenceInDays(new Date(), parseISO(date)) <= 30; //isToday(parseISO(date)) || isYesterday(parseISO(date));

  return (
    <View style={styles.container}>
      {Object.keys(data).map((beckId, j) => {
        const beck = data[beckId];
        const isDraft = !beck?.mainEmotion || !beck?.mainEmotionIntensity;

        return (
          <TouchableOpacity
            key={j}
            style={[styles.item, isDraft && styles.containerEditable]}
            onPress={() => handleViewBeck(beck, beckId)}
            disabled={!canEdit}>
            <Icon
              icon="ThoughtsSvg"
              color="#58C8D2"
              width={25}
              height={25}
              styleContainer={styles.icon}
            />

            <View>
              {!isDraft ? (
                <>
                  <Text>
                    {beck?.mainEmotion} -{' '}
                    {`${beck?.mainEmotionIntensity * 10}%`}
                    {beck?.mainEmotionIntensityNuanced ? (
                      <Text style={styles.mainEmotionIntensityNuancedStyle}>
                        {' →'} {beck?.mainEmotionIntensityNuanced * 10}%
                      </Text>
                    ) : null}
                  </Text>
                  {beck?.where ? (
                    <Text style={styles.place}>{beck?.where}</Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.place}>Brouillon</Text>
              )}
            </View>
            {beck?.time && <Text style={styles.time}>à {beck.time}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingBottom: 15,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 10,
    marginTop: 15,
  },
  icon: {marginRight: 20},
  containerEditable: {
    backgroundColor: 'rgba(31, 198, 213, 0.2)',
  },
  place: {
    fontStyle: 'italic',
    color: '#26387C',
  },
  time: {
    marginLeft: 'auto',
    marginRight: 20,
    marginBottom: 'auto',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#26387C',
  },
  mainEmotionIntensityNuancedStyle: {
    color: colors.LIGHT_BLUE,
    fontWeight: 'bold',
  },
});
