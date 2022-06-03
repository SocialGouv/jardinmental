import React, { useEffect } from "react";
import { StyleSheet, Platform, Modal, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RoundButtonIcon from "./RoundButtonIcon";
import { today } from "../utils/date/helpers";

const DatePicker = ({ visible, selectDate, initDate = Date.now(), mode }) => {
  const [date, setDate] = React.useState(new Date(initDate));
  useEffect(() => {
    setDate(new Date(initDate));
  }, [initDate]);

  if (!visible) {
    return null;
  }
  if (Platform.OS === "ios") {
    return (
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={styles.modalContent}>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              style={styles.datePicker}
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="default"
              maximumDate={today(1, true)}
              locale="fr-FR"
              onChange={(_, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
            />
            <View style={styles.buttonsContainer}>
              <RoundButtonIcon icon="cancel" visible onPress={() => selectDate(initDate)} />
              <RoundButtonIcon
                icon="validate"
                visible
                onPress={() => {
                  selectDate(Date.parse(date));
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      display="spinner"
      maximumDate={today(1, true)}
      onChange={(_, selectedDate) => {
        const currentDate = selectedDate || date;
        selectDate(Date.parse(currentDate));
        setDate(currentDate);
      }}
    />
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    display: "flex",
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    backgroundColor: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 15,
  },
  datePicker: {
    marginHorizontal: 10,
  },
});

export default DatePicker;
