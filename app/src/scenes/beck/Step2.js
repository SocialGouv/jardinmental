import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import styleBeck from '../../styles/beck';
import Text from '../../components/MyText';
import Button from '../../components/Button';
import TextTag from '../../components/TextTag';
import Separator from '../../components/Separator';
import DiscretSlider from '../../components/DiscretSlider';
import {toggleSelectedInArray, toggleState} from '../../utils';
import localStorage from '../../utils/localStorage';
import AddElemToList from '../../components/AddElemToList';
import {
  DEFAULT_BECK_EMOTION_LIST,
  DEFAULT_BECK_SENSATION_LIST,
} from '../../utils/constants';
import logEvents from '../../services/logEvents';

export default ({onChange, onSubmit, data}) => {
  // lists that will be displayed
  const [listEmotion, setListEmotion] = useState();
  const [listPhysicalSensations, setListPhysicalSensations] = useState();

  // input visible booleans
  const [addEmotionVisible, setAddEmotionVisible] = useState(false);
  const [
    addPhysicalSensationVisible,
    setAddPhysicalSensationVisible,
  ] = useState(false);
  const [addOtherEmotionVisible, setAddOtherEmotionVisible] = useState(false);

  //handlers
  const handleClickMainEmotion = (emotion) => {
    if (emotion === mainEmotionSelected) emotion = null;
    setMainEmotionSelected(emotion);
    onChange({mainEmotion: emotion});
  };
  const handleClickMainEmotionIntensity = (mainEmotionIntensity) => {
    setMainEmotionIntensitySelected(mainEmotionIntensity);
    onChange({mainEmotionIntensity});
  };
  const handleClickOtherEmotions = (otherEmotionClicked) => {
    const otherEmotions = toggleSelectedInArray(
      otherEmotionsSelected,
      otherEmotionClicked,
    );
    setOtherEmotionsSelected(otherEmotions);
    onChange({otherEmotions});
  };
  const handleClickPhysicalSensations = (physicalSensationClicked) => {
    const physicalSensations = toggleSelectedInArray(
      physicalSensationsSelected,
      physicalSensationClicked,
    );
    setPhysicalSensationsSelected(physicalSensations);
    onChange({physicalSensations});
  };

  //handlers close
  const handleCloseMainEmotion = (emotion) => {
    if (mainEmotionSelected === emotion) {
      setMainEmotionSelected(null);
      onChange({mainEmotion: null});
    }
    if (otherEmotionsSelected.indexOf(emotion) !== -1) {
      handleCloseOtherEmotion(emotion);
    }
  };
  const handleCloseOtherEmotion = (emotion) => {
    let otherEmotions = [...otherEmotionsSelected];
    if (otherEmotionsSelected.indexOf(emotion) !== -1)
      otherEmotions = otherEmotionsSelected.filter((w) => w !== emotion);
    setOtherEmotionsSelected(otherEmotions);
    onChange({otherEmotions});
  };
  const handleCloseSensation = (sensation) => {
    let physicalSensations = [...physicalSensationsSelected];
    if (physicalSensationsSelected.indexOf(sensation) !== -1)
      physicalSensations = physicalSensationsSelected.filter(
        (w) => w !== sensation,
      );
    setPhysicalSensationsSelected(physicalSensations);
    onChange({physicalSensations});
  };

  // handle new value, add it in the list and select it if needed
  const addNewEmotion = async (emotion, {selectAsMain, selectAsOther}) => {
    // store the new 'emotion' value for next times
    await localStorage.addBeckEmotionList(emotion);
    // add the new emotion in the list
    setListEmotion([...listEmotion, emotion]);
    // select it by default
    if (selectAsMain) handleClickMainEmotion(emotion);
    if (selectAsOther) handleClickOtherEmotions(emotion);
    logEvents.logBeckAddCustomEmotion(emotion);
  };
  const addPhysicalSensation = async (sensation) => {
    // store the new 'sensation' value for next times
    await localStorage.addBeckSensationList(sensation);
    // add the new sensation in the list
    setListPhysicalSensations([...listPhysicalSensations, sensation]);
    // select it by default
    handleClickPhysicalSensations(sensation);
    logEvents.logBeckAddCustomSensation(sensation);
  };

  const removeSensation = async (sensation) => {
    // remove the 'sensation' value for next times
    const list = await localStorage.removeBeckSensationList(sensation);
    // update the list displayed
    setListPhysicalSensations(list);
    // unselect it if needed
    handleCloseSensation(sensation);
  };
  const removeEmotion = async (emotion, {main, other}) => {
    // remove the 'emotion' value for next times
    const list = await localStorage.removeBeckEmotionList(emotion);
    // update the list displayed
    setListEmotion(list);
    // unselect it if needed
    if (main) handleCloseMainEmotion(emotion);
    if (other) handleCloseOtherEmotion(emotion);
  };

  // get and set lists from the local storage
  const setListEmotionFromStorage = async () => {
    let list = await localStorage.getBeckEmotionList();
    if (!list || list.length === 0) {
      list = DEFAULT_BECK_EMOTION_LIST;
      await localStorage.setBeckEmotionList(list);
    }
    setListEmotion(list);
  };
  const setListSensationFromStorage = async () => {
    let list = await localStorage.getBeckSensationList();
    if (!list || list.length === 0) {
      list = DEFAULT_BECK_SENSATION_LIST;
      await localStorage.setBeckSensationList(list);
    }
    setListPhysicalSensations(list);
  };

  // keep in the state the values selected
  const [mainEmotionSelected, setMainEmotionSelected] = useState();
  const [
    mainEmotionIntensitySelected,
    setMainEmotionIntensitySelected,
  ] = useState();
  const [otherEmotionsSelected, setOtherEmotionsSelected] = useState([]);
  const [physicalSensationsSelected, setPhysicalSensationsSelected] = useState(
    [],
  );

  useEffect(() => {
    logEvents.logBeckStepOpen(2);
    setListEmotionFromStorage();
    setListSensationFromStorage();
  }, []);

  useEffect(() => {
    setMainEmotionSelected(data?.mainEmotion);
    setMainEmotionIntensitySelected(data?.mainEmotionIntensity);
    setOtherEmotionsSelected(data?.otherEmotions || []);
    setPhysicalSensationsSelected(data?.physicalSensations || []);
  }, [data]);

  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>
        <Text style={styleBeck.required}>*</Text> Quelle a été votre principale
        émotion ?
      </Text>
      <View style={styleBeck.listContainer}>
        {listEmotion?.map((e, i) => (
          <TextTag
            key={i}
            value={e}
            selected={e === mainEmotionSelected}
            color="#D4F0F2"
            onPress={handleClickMainEmotion}
            enableClosed
            onClose={(emotion) => removeEmotion(emotion, {main: true})}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => toggleState(addEmotionVisible, setAddEmotionVisible)}>
        <Text style={styleBeck.underlinedBlueText}>
          Ajouter une autre émotion
        </Text>
      </TouchableOpacity>
      {addEmotionVisible ? (
        <AddElemToList
          onChange={(e) => addNewEmotion(e, {selectAsMain: true})}
        />
      ) : null}
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>
        <Text style={styleBeck.required}>*</Text> Et son intensité ?
      </Text>
      <DiscretSlider
        step={mainEmotionIntensitySelected}
        onChange={handleClickMainEmotionIntensity}
      />
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>
        Avez-vous ressenti d’autres émotions ?
      </Text>
      <View style={styleBeck.listContainer}>
        {listEmotion?.map((e, i) => (
          <TextTag
            key={i}
            value={e}
            selected={otherEmotionsSelected.indexOf(e) !== -1}
            disabled={e === mainEmotionSelected}
            color="#D4F0F2"
            onPress={handleClickOtherEmotions}
            enableClosed
            onClose={(emotion) => removeEmotion(emotion, {other: true})}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() =>
          toggleState(addOtherEmotionVisible, setAddOtherEmotionVisible)
        }>
        <Text style={styleBeck.underlinedBlueText}>
          Ajouter une autre émotion
        </Text>
      </TouchableOpacity>
      {addOtherEmotionVisible ? (
        <AddElemToList
          onChange={(e) => addNewEmotion(e, {selectAsOther: true})}
        />
      ) : null}
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>Sensations physiques</Text>
      <View style={styleBeck.listContainer}>
        {listPhysicalSensations?.map((e, i) => (
          <TextTag
            key={i}
            value={e}
            selected={physicalSensationsSelected.indexOf(e) !== -1}
            color="#D4F0F2"
            onPress={handleClickPhysicalSensations}
            enableClosed
            onClose={removeSensation}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() =>
          toggleState(
            addPhysicalSensationVisible,
            setAddPhysicalSensationVisible,
          )
        }>
        <Text style={styleBeck.underlinedBlueText}>
          Ajouter une autre sensation
        </Text>
      </TouchableOpacity>
      {addPhysicalSensationVisible ? (
        <AddElemToList onChange={addPhysicalSensation} />
      ) : null}
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
});
