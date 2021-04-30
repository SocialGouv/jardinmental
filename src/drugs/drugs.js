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
import {DRUG_LIST} from '../utils/drugs-list';
import Icon from '../common/icon';

const Drugs = ({navigation, route}) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
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
        const t = DRUG_LIST.filter(
          (e) => !!medicalTreatmentStorage.find((local) => local.id === e.id),
        );
        setMedicalTreatment(t);
      }
    })();
  }, [navigation, route]);

  useEffect(() => {
    defaultValue();
  }, [medicalTreatment]);

  const previousQuestion = () => {
    if (route?.params?.backRedirect) {
      console.log(route?.params?.backRedirect);
      navigation.navigate(route?.params?.backRedirect, {
        ...route.params,
      });
    } else {
      navigation.navigate('tabs');
    }
  };

  const handleAdd = () => {
    navigation.navigate('drugs-list');
  };

  const defaultValue = () => {
    const lastSurvey =
      diaryData[
        Object.keys(diaryData)
          .sort((a, b) => {
            a = a.split('/').reverse().join('');
            b = b.split('/').reverse().join('');
            return b.localeCompare(a);
          })
          .find((e) => diaryData[e]?.POSOLOGY)
      ];
    if (!lastSurvey || !medicalTreatment) return;
    setPosology(
      lastSurvey?.POSOLOGY.filter(
        (e) => !!medicalTreatment.find((t) => t.id === e.id),
      ),
    );
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
            drug={(posology && posology.find((i) => i.id === e.id)) || e}
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
        <View style={styles.header}>
          <Text style={styles.title}>
            {inSurvey
              ? "Quel traitement avez-vous pris aujourd'hui ?"
              : 'Suivi de votre traitement'}
          </Text>
          <Icon
            icon="InfoSvg"
            color={colors.DARK_BLUE}
            width={30}
            height={30}
          />
        </View>
        <Text style={styles.subtitle}>
          Indiquez chaque soir l'ensemble des médicaments pris{' '}
          <Text style={styles.bold}>durant la journée</Text>.
        </Text>
        {render()}
      </ScrollView>
      {inSurvey ? (
        <View style={styles.buttonWrapper}>
          <Button onPress={submit} title="Valider" />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
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
