import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import Icon from '../../components/Icon';
import {colors} from '../../utils/colors';
import {canEdit} from './diary';

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

  return (
    <View>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.container,
          canEdit(date) && {
            borderRadius: 10,
            backgroundColor: 'rgba(31, 198, 213, 0.2)',
          },
        ]}
        onPress={onPress}
        disabled={!canEdit(date)}>
        <Icon
          icon="DrugsSvg"
          color="#58C8D2"
          width={25}
          height={25}
          styleContainer={styles.icon}
        />
        <View style={styles.posologyContainer}>{renderPosology()}</View>
      </TouchableOpacity>
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
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Posology;
