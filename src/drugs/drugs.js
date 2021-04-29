import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, View} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import {buildSurveyData} from '../survey/survey-data';
import {DiaryDataContext} from '../context';
import Button from '../common/button';
import BackButton from '../components/BackButton';
import localStorage from '../utils/localStorage';
import NoData from './no-data';
import DrugItem from './drug-item';

const Drugs = ({navigation, route}) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
  const [questions, setQuestions] = useState([]);
  const [medicalTreatment, setMedicalTreatment] = useState();
  const [posology, setPosology] = useState([]);
  const [inSurvey, setInSurvey] = useState(false);

  useEffect(() => {
    setInSurvey(!!route.params?.currentSurvey);
  }, []);

  useEffect(() => {
    (async () => {
      const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
      if (medicalTreatmentStorage) {
        setMedicalTreatment(medicalTreatmentStorage);
      }
    })();
  }, [navigation, route]);

  const previousQuestion = () => {
    if (route.params?.backRedirect) {
      console.log(route.params?.backRedirect);
      navigation.navigate('question', {
        ...route.params,
        index: route.params.backRedirect,
      });
    } else {
      console.log('tabs');
      navigation.navigate('tabs');
    }
  };

  const handleAdd = () => {
    navigation.navigate('drugs-list');
  };

  const handleDrugChange = (d, value) => {
    let updated = false;
    let p = posology.map((e) => {
      if (e?.id === d?.id) {
        updated = true;
        return {...d, value};
      }
      return e;
    });
    if (!updated) p = [...posology, {...d, value}];
    setPosology(p);
  };

  const render = () => {
    if (!medicalTreatment) {
      return <NoData navigation={navigation} />;
    }
    return (
      <View>
        {medicalTreatment.map((e, i) => (
          <DrugItem
            key={i}
            drug={e}
            onChange={handleDrugChange}
            showPosology={inSurvey}
          />
        ))}
        <Text style={styles.addButton} onPress={handleAdd}>
          + Ajouter un médicament
        </Text>
      </View>
    );
  };

  const submit = () => {
    const params = {checkYesterday: inSurvey};
    if (inSurvey) {
      const survey = route.params?.currentSurvey;
      const currentSurvey = {
        date: survey?.date,
        answers: {
          ...survey?.answers,
          POSOLOGY: posology,
        },
      };
      setDiaryData(currentSurvey);
      params.currentSurvey = currentSurvey;
    }
    navigation.navigate('tabs', params);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={previousQuestion} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          {inSurvey
            ? "Quel traitement avez-vous pris aujourd'hui ?"
            : 'Suivi de votre traitement'}
        </Text>
        <Text style={styles.subtitle}>
          Indiquez chaque soir l'ensemble des médicaments pris{' '}
          <Text style={styles.bold}>durant la journée</Text>.
        </Text>
        {render()}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button onPress={submit} title="Valider" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    marginBottom: 10,
    fontWeight: '700',
  },
  subtitle: {
    color: '#000',
    fontSize: 15,
    marginBottom: 15,
    fontWeight: '300',
  },
  bold: {
    fontWeight: '500',
  },
  addButton: {
    color: colors.BLUE,
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginTop: 15,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
});

export default Drugs;
