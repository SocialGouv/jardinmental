import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import CircledIcon from '../../components/CircledIcon';
import {isToday, isYesterday, parseISO} from 'date-fns';
import {colors} from '../../utils/colors';

const Posology = ({data, date, onPress}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const renderPosology = () => {
    return data.map((p, i) => {
      if (!p?.name1 || !p?.value) return null;
      return (
        <View key={i} style={styles.posologyItem}>
          <View style={styles.posologyName}>
            <Text style={styles.text1}>{p.name1}</Text>
            {p.name2 ? <Text style={styles.text2}>{p.name2}</Text> : null}
          </View>
          <Text style={styles.posologyText}>{p.value}</Text>
        </View>
      );
    });
  };

  const canEdit = isToday(parseISO(date)) || isYesterday(parseISO(date));

  return (
    <View>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.container,
          canEdit && {
            borderRadius: 10,
            backgroundColor: 'rgba(31, 198, 213, 0.2)',
          },
        ]}
        onPress={onPress}
        disabled={!canEdit}>
        <CircledIcon
          borderColor="#58C8D2"
          color="rgba(34,192,207, .1)"
          icon="DrugsSvg"
        />
        <View style={styles.posologyContainer}>{renderPosology()}</View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  posologyItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
  },
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
    marginTop: 12,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Posology;
