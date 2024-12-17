import React, {useState, useEffect} from 'react';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default ({visible, selectDate, value, headerTextIOS = 'Définir un rappel'}) => {
  const [date, setDate] = useState(value || new Date(Date.now() + 60 * 1000));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleCancel = () => {
    selectDate(null);
    setDatePickerVisibility(false);
  };

  const handleConfirm = d => {
    selectDate(d);
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    setDatePickerVisibility(visible);
    if (visible) {
      setDate(value || new Date(Date.now() + 60 * 1000));
    }
  }, [value, visible]);

  return (
    <></>
    // <DateTimePickerModal
    //   date={date}
    //   isVisible={isDatePickerVisible}
    //   mode="time"
    //   onConfirm={handleConfirm}
    //   onCancel={handleCancel}
    //   locale="en_GB" // trick for 24 hours on iOS
    //   cancelTextIOS="Retour"
    //   confirmTextIOS="Valider"
    //   headerTextIOS={headerTextIOS}
    // />
  );
};
