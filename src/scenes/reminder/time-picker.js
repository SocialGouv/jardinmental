import React, {useState, useEffect} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimePicker = ({visible, selectDate, reminder}) => {
  const [date, setDate] = useState(
    reminder || new Date(Date.now() + 60 * 1000),
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleCancel = () => {
    selectDate(null);
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    selectDate(date);
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    setDatePickerVisibility(visible);
    if (visible) {
      setDate(reminder || new Date(Date.now() + 60 * 1000));
    }
  }, [visible]);

  return (
    <DateTimePickerModal
      date={date}
      isVisible={isDatePickerVisible}
      mode="time"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      locale="en_GB" // trick for 24 hours on iOS
      cancelTextIOS="Retour"
      confirmTextIOS="Valider"
      headerTextIOS="Définir un rappel"
    />
  );
};

export default TimePicker;
