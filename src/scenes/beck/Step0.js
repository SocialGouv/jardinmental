import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import TextTag from '../../components/TextTag';
import SelectDateComponent from './SelectDateComponent';
import SelectTimeComponent from './SelectTimeComponent';
import styleBeck from '../../styles/beck';
import Separator from '../../components/Separator';
import Button from '../../components/Button';
import {toggleSelectedInArray, toggleState} from '../../utils';
import localStorage from '../../utils/localStorage';
import AddElemToList from '../../components/AddElemToList';
import {
  DEFAULT_BECK_WHERE_LIST,
  DEFAULT_BECK_WHO_LIST,
} from '../../utils/constants';
import {formatDate, formatDay, getTime} from '../../utils/date/helpers';
import {subDays, isToday, isYesterday, parseISO} from 'date-fns';
import logEvents from '../../services/logEvents';

export default ({onChange, onSubmit, data, id}) => {
  // lists that will be displayed
  const [listWhere, setListWhere] = useState();
  const [listWhen, setListWhen] = useState();
  const [listWho, setListWho] = useState();

  // input visible booleans
  const [addWhereVisible, setAddWhereVisible] = useState(false);
  const [addWhoVisible, setAddWhoVisible] = useState(false);

  //handlers click
  const handleClickWhere = (where) => {
    if (where === whereSelected) where = null;
    setWhereSelected(where);
    onChange({where});
  };
  const handleClickWho = (whoClicked) => {
    const who = toggleSelectedInArray(whosSelected, whoClicked);
    setWhosSelected(who);
    onChange({who});
  };

  //handlers close
  const handleCloseWhere = (where) => {
    if (whereSelected !== where) return;
    setWhereSelected(null);
    onChange({where: null});
  };
  const handleCloseWho = (whoClicked) => {
    let who = [...whosSelected];
    if (whosSelected.indexOf(whoClicked) !== -1)
      who = whosSelected.filter((w) => w !== whoClicked);
    setWhosSelected(who);
    onChange({who});
  };

  // handle new value, add it in the list and select it if needed
  const addNewWhere = async (where) => {
    // store the new 'where' value for next times
    await localStorage.addBeckWhereList(where);
    // add the new where in the list
    setListWhere([...listWhere, where]);
    // select it by default
    handleClickWhere(where);
    logEvents.logBeckAddCustomWhere(where);
  };
  const addNewWho = async (newWho) => {
    // store the new 'who' value for next times
    await localStorage.addBeckWhoList(newWho);
    // add the new who in the list
    setListWho([...listWho, newWho]);
    // select it by default
    handleClickWho(newWho);
    logEvents.logBeckAddCustomWho(newWho);
  };

  // handle remove value, remove of the list and unselect it if needed
  const removeWhere = async (where) => {
    // remove the 'where' value for next times
    const list = await localStorage.removeBeckWhereList(where);
    // update the list displayed
    setListWhere(list);
    // unselect it if needed
    handleCloseWhere(where);
  };
  const removeWho = async (who) => {
    // remove the 'who' value for next times
    const list = await localStorage.removeBeckWhoList(who);
    // update the list displayed
    setListWho(list);
    // unselect it if needed
    handleCloseWho(who);
  };

  // get and set lists from the local storage
  const setListWhereFromStorage = async () => {
    let list = await localStorage.getBeckWhereList();
    if (!list || list.length === 0) {
      list = DEFAULT_BECK_WHERE_LIST;
      await localStorage.setBeckWhereList(list);
    }
    setListWhere(list);
  };
  const setListWhoFromStorage = async () => {
    let list = await localStorage.getBeckWhoList();
    if (!list || list.length === 0) {
      list = DEFAULT_BECK_WHO_LIST;
      await localStorage.setBeckWhoList(list);
    }
    setListWho(list);
  };

  // keep in the state the values selected
  const [whereSelected, setWhereSelected] = useState();
  const [whosSelected, setWhosSelected] = useState([]);
  const [dateSelected, setDateSelected] = useState();
  const [timeSelected, setTimeSelected] = useState();

  useEffect(() => {
    logEvents.logBeckStepOpen(0);
    setListWhereFromStorage();
    setListWhoFromStorage();
    const now = new Date(Date.now());
    const options = [...Array(30).keys()].map((i) => {
      const value = formatDay(subDays(now, i));
      let label = formatDate(value);
      if (isToday(parseISO(value))) label = "Aujourd'hui";
      if (isYesterday(parseISO(value))) label = 'Hier';
      return {label, value};
    });
    setListWhen(options);
  }, []);

  useEffect(() => {
    setWhereSelected(data?.where);
    setWhosSelected(data?.who || []);
  }, [data?.where, data?.who]);

  useEffect(() => {
    const now = new Date(Date.now());
    setDateSelected(data?.date || formatDay(now));
  }, [data?.date]);

  useEffect(() => {
    const now = new Date(Date.now());
    if (data?.time) {
      setTimeSelected(data?.time || getTime(now));
    } else {
      setTimeSelected(getTime(now));
      onChange({time: getTime(now)});
    }
  }, [data?.time]);

  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>
        <Text style={styleBeck.required}>*</Text> Quand est-ce arrivé ?
      </Text>
      <View style={styles.dropdownContainer}>
        <SelectDateComponent
          placeholder="Choisir la date"
          iconName="CalendarSvg"
          onChange={(date) => onChange({date})}
          styleContainer={styles.selectDateComponentContainer}
          value={dateSelected}
          items={listWhen}
        />
        <SelectTimeComponent
          placeholder="Choisir l'heure"
          iconName="ClockSvg"
          onChange={(time) => onChange({time})}
          value={timeSelected}
        />
      </View>
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>Où étiez-vous ?</Text>
      <View style={styleBeck.listContainer}>
        {listWhere?.map((e, i) => (
          <TextTag
            key={i}
            value={e}
            selected={e === whereSelected}
            color="#D4F0F2"
            onPress={handleClickWhere}
            enableClosed
            onClose={removeWhere}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => toggleState(addWhereVisible, setAddWhereVisible)}>
        <Text style={styleBeck.underlinedBlueText}>Ajouter un autre lieu</Text>
      </TouchableOpacity>
      {addWhereVisible ? <AddElemToList onChange={addNewWhere} /> : null}
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>Et avec qui ?</Text>
      <View style={styleBeck.listContainer}>
        {listWho?.map((e, i) => (
          <TextTag
            key={i}
            value={e}
            selected={whosSelected?.indexOf(e) !== -1}
            color="#D4F0F2"
            onPress={handleClickWho}
            enableClosed
            onClose={removeWho}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => toggleState(addWhoVisible, setAddWhoVisible)}>
        <Text style={styleBeck.underlinedBlueText}>
          Ajouter une connaissance
        </Text>
      </TouchableOpacity>
      {addWhoVisible ? <AddElemToList onChange={addNewWho} /> : null}
      <Button
        title="Continuer"
        buttonStyle={styleBeck.submitButton}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 80,
    display: 'flex',
    alignItems: 'flex-start',
  },
  stepIndicatorContainer: {marginVertical: 15},
  mainTitle: {
    width: '80%',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '600',
    marginTop: 15,
  },
  mainDescription: {
    width: '80%',
    marginTop: 15,
  },
  selectDateComponentContainer: {marginBottom: 15},
});
