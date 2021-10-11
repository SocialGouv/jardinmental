import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {DiaryDataContext} from '../../context';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import localStorage from '../../utils/localStorage';
import NoData from './no-data';
import DrugItem from './drug-item';
import {getDrugListWithLocalStorage} from '../../utils/drugs-list';
import Icon from '../../components/Icon';
import logEvents from '../../services/logEvents';
import DrugInformations from './drug-information';
import {alertNoDataYesterday} from '../survey/survey-data';
import Logo from '../../../assets/svg/drugs';

const Drugs = ({navigation, route}) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
  const [medicalTreatment, setMedicalTreatment] = useState();
  const [posology, setPosology] = useState([]);
  const [inSurvey, setInSurvey] = useState(false);
  const [showInfos, setShowInfos] = useState();
  const [listDrugs, setListDrugs] = useState();

  useEffect(() => {
    logEvents.logDrugsOpen();
    setInSurvey(!!route?.params?.currentSurvey);
    (async () => {
      const list = await getDrugListWithLocalStorage();
      setListDrugs(list);
    })();
  }, [route]);

  const enrichTreatmentWithData = (list) => {
    if (list) {
      const t = listDrugs.filter(
        (e) => !!list.find((local) => local.id === e.id),
      );
      return t;
    }
    return null;
  };

  useEffect(() => {
    if (!listDrugs || listDrugs?.length <= 0) return;
    (async () => {
      const medicalTreatmentStorage =
        route?.params?.treatment || (await localStorage.getMedicalTreatment());
      setMedicalTreatment(enrichTreatmentWithData(medicalTreatmentStorage));
    })();
  }, [navigation, route, listDrugs]);

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

  const handleDrugChange = (d, value, isFreeText) => {
    let updated = false;
    let p = posology.map((e) => {
      if (e?.id === d?.id) {
        updated = true;
        return {...d, value, isFreeText};
      }
      return e;
    });
    if (!updated) p = [...posology, {...d, value, isFreeText}];
    setPosology(p);
  };

  const handleDelete = async (drug) => {
    const treatmentAfterDeletion = await localStorage.removeDrugFromTreatment(
      drug?.id,
    );
    setMedicalTreatment(enrichTreatmentWithData(treatmentAfterDeletion));
  };

  const render = () => {
    if (!medicalTreatment) {
      return <NoData navigation={navigation} route={route} />;
    }
    return (
      <View>
        {medicalTreatment.map((e, i) => (
          <DrugItem
            key={i}
            drug={(posology && posology.find((i) => i.id === e.id)) || e}
            onChange={handleDrugChange}
            showPosology={inSurvey}
            onClose={() => handleDelete(e)}
          />
        ))}
        <Text style={styles.addButton} onPress={handleAdd}>
          + Ajouter / Modifier mes médicaments suivis
        </Text>
        {/* // if its onboarding, show button 'commencer' */}
        {route?.params?.onboarding ? (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate('tabs')}
              style={styles.setupButton}>
              <Text style={styles.setupButtonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const submit = () => {
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
      alertNoDataYesterday({date: survey?.date, diaryData, navigation});
    }

    navigation.navigate('tabs');
  };

  const toggleInfos = () => {
    setShowInfos(!showInfos);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <DrugInformations visible={showInfos} onClose={toggleInfos} />
      <BackButton onPress={previousQuestion} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Logo style={styles.image} width={30} height={30} />
            <Text style={styles.title}>
              {inSurvey
                ? "Quel traitement avez-vous pris aujourd'hui ?"
                : 'Suivi de votre traitement'}
            </Text>
          </View>
          <Icon
            icon="InfoSvg"
            color={colors.DARK_BLUE}
            width={30}
            height={30}
            onPress={toggleInfos}
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
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  scrollView: {
    padding: 20,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 150,
  },
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
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
});

export default Drugs;
