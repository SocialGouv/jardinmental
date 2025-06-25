import React, {useRef} from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../MyText';
import {colors} from '../../utils/colors';
import localStorage from '../../utils/localStorage';

const ReminderItem = ({onPress}) => {
  const [message, setMessage] = useState('');
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const supported = await localStorage.getSupported();
      if (mounted) {
        if (supported === 'YES') {
          return setMessage(
            'Saisir au moins 4 ou 5 fois par semaine aidera le professionnel qui vous suit à mieux vous soigner',
          );
        } else {
          return setMessage(
            'Saisir au moins 3 à 4 fois par semaine mon questionnaire quotidien me permet de mieux suivre mon évolution.',
          );
        }
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>Mettre un rappel</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHT_BLUE_TRANS_02,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F4FCFD',
    marginBottom: 20,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLUE,
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    color: colors.BLUE,
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default ReminderItem;
