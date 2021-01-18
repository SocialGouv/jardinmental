import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from '../common/colors';

/*
  onChange:
  - triggered everytime the datepicker changes date on iOS -> need state
  - triggered everytime the OK button is tapped on android -> no need state
*/

// https://github.com/react-native-community/react-native-datetimepicker/issues/114

const today = (offset = 0) => {
  const now = new Date(Date.now() + offset * 1000 * 60 * 60 * 24);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
};

const TimePicker = ({visible, selectDate}) => {
  const [date, setDate] = React.useState(new Date(Date.now() + 60 * 1000));
  React.useEffect(() => {
    if (visible) {
      setDate(new Date(Date.now() + 60 * 1000));
    }
  }, [visible]);
  if (Platform.OS === 'ios') {
    return (
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={styles.container}>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              maximumDate={today(1)}
              locale="fr-FR"
              onChange={(_, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
            />
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => selectDate(date)}>
                <Text style={styles.validate}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectDate(null)}>
                <Text style={styles.cancel}>Retour</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) {
    return null;
  }
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode="time"
      display="spinner"
      maximumDate={today(1)}
      onChange={(_, selectedDate) => {
        selectDate(selectedDate);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '90%',
    maxWidth: 300,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  validate: {
    color: colors.LIGHT_BLUE,
    fontWeight: '700',
    fontSize: 16,
  },
  cancel: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default TimePicker;
