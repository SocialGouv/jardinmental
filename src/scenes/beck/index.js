import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import BackButton from '../../components/BackButton';
import ForwardButton from '../../components/ForwardButton';
import StepIndicator from '../../components/StepIndicator';
import {DiaryDataContext} from '../../context';
import {alertNoDataYesterday} from '../survey/survey-data';
import {BeckStepTitles} from '../../utils/constants';
import {deleteBeckfromDiaryData} from '../../utils';

import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

export default ({navigation, route}) => {
  const scrollRef = useRef();
  const [step, setStep] = useState(0);
  const [beck, setBeck] = useState({});
  const [originalBeckDate, setOriginalBeckDate] = useState(null);
  const [id, setId] = useState();
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [step]);

  useEffect(() => {
    setBeck(route?.params?.beck);
    setId(route?.params?.beckId);
    setOriginalBeckDate(route?.params?.beck?.date);
  }, [route?.params?.beck]);

  const updateBeck = (e) => setBeck({...beck, ...e});
  const save = () => {
    if (!beck?.date) return;

    // delete from the orignal date if there is one
    if (originalBeckDate && originalBeckDate !== beck?.date)
      deleteBeckfromDiaryData({
        date: originalBeckDate,
        beckId: id,
        diaryData,
        setDiaryData,
      });

    // save progression
    const survey = diaryData[beck?.date] || {};
    const becks = survey?.becks || {};
    let beckId = id;
    if (!beckId) {
      beckId = Date.now();
      setId(beckId);
    }
    becks[beckId] = beck;
    const currentSurvey = {
      date: beck?.date,
      answers: {
        ...survey?.answers,
        becks,
      },
    };
    setDiaryData(currentSurvey);
  };
  const nextStep = () => {
    save();
    const survey = route?.params?.currentSurvey;
    //if in the beck process, go to the next step...
    if (step < 5) return setStep(step + 1);
    //else
    alertNoDataYesterday({date: survey?.date, diaryData, navigation});
    return navigation.navigate('tabs');
  };

  const previousStep = () => {
    save();
    //if not a the first step, go to the previous step...else go back
    if (step > 0) return setStep(step - 1);
    if (route?.params?.redirect) return navigation.navigate('tabs');
    navigation.goBack();
  };

  const renderStep = (s) => {
    switch (s) {
      case 0:
        return (
          <Step0
            onChange={updateBeck}
            onSubmit={nextStep}
            data={beck}
            id={id}
          />
        );
      case 1:
        return <Step1 onChange={updateBeck} onSubmit={nextStep} data={beck} />;
      case 2:
        return <Step2 onChange={updateBeck} onSubmit={nextStep} data={beck} />;
      case 3:
        return <Step3 onChange={updateBeck} onSubmit={nextStep} data={beck} />;
      case 4:
        return <Step4 onChange={updateBeck} onSubmit={nextStep} data={beck} />;
      case 5:
        return <Step5 onChange={updateBeck} onSubmit={nextStep} data={beck} />;
    }
  };

  const renderDescription = (s) => {
    switch (s) {
      case 0:
        return 'Décrivez une situation vécue qui a été source de stress ou d’angoisse';
      case 1:
        return 'Décrivez une situation vécue qui a été source de stress ou d’angoisse';
      case 2:
        return 'Quelles ont été vos émotions et sensations pendant cette situation ?';
      case 3:
        return 'Quelles ont été vos émotions et sensations pendant cette situation ?';
      case 4:
        return 'Quel comportement avez-vous adopté et quelle en a été la résultante?';
      case 5:
        return 'Quel comportement avez-vous adopté ?';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safe}
      keyboardVerticalOffset={10}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.buttonsContainer}>
          <BackButton onPress={previousStep} />
          <ForwardButton onPress={nextStep} />
        </View>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.mainTitle}>{BeckStepTitles[step]}</Text>
          <Text style={styles.mainDescription}>{renderDescription(step)}</Text>
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator numberOfSteps={6} step={step} />
          </View>
          <View style={styles.stepContainer}>{renderStep(step)}</View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

/*

beck : {
  *step 0
  date: string,
  time: string,
  where: string,
  who: array,

  *step 1
  what: string

  *step 2
  mainEmotion: string
  mainEmotionIntensity: number
  otherEmotions: array
  physicalSensations: array 

  *step 3
  thoughtsBeforeMainEmotion: string
  trustInThoughsThen: number
  memories: string

  *step 4
  actions: string
  consequencesForYou: string
  consequencesForRelatives: string

  *step 5
  argumentPros: string
  argumentCons: string
  NuancedThoughts: string
  trustInThoughsNow: number
  mainEmotionIntensityNuanced: number
}

 */

const styles = StyleSheet.create({
  stepContainer: {width: '100%'},
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  stepIndicatorContainer: {marginTop: 15, marginBottom: 35},
  mainTitle: {
    width: '80%',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '600',
    marginTop: 15,
  },
  mainDescription: {
    width: '80%',
    minHeight: 40,
    marginTop: 15,
  },
});
