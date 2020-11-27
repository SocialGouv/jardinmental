import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {getArrayOfDates} from '../services/date/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportData from '../../assets/svg/export-data.svg';
import {colors} from '../common/colors';
import {DiaryDataContext} from '../context';
import {displayedCategories} from '../common/constants';

const MailStorageKey = '@Mail';

//TODO : identité du sender de mail
const mailFrom = '';
const mailFromName = 'MonSuiviPsy - Application';
const API_USER = '2fbfeec4905f352f871b2590da840571';
const API_KEY = 'e94f70b1c2dd423a446efbbc788200cb';

const Export = ({navigation}) => {
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [diaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    (async () => {
      const m = await AsyncStorage.getItem(MailStorageKey);
      if (m) setMail(m);
    })();
  }, []);

  onBackPress = navigation.goBack;

  var today = new Date();
  var firstDay = new Date();
  firstDay.setDate(today.getDate() - days);
  const chartDates = getArrayOfDates({
    startDate: firstDay,
    numberOfDays: days,
  });

  const computeChartData = (categoryId) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return null;
      }
      return categoryState.level;
    });
  };

  const isChartVisible = (categoryId) => {
    let visible = false;
    chartDates.forEach((date) => {
      if (!diaryData[date]) return;
      if (!diaryData[date][categoryId]) return;
      visible = true;
    });
    return visible;
  };

  const mapImagesToState = (iconType) => {
    switch (iconType) {
      case 'VeryGoodSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/veryGood.svg';
      case 'GoodSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/good.svg';
      case 'MiddleSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/middle.svg';
      case 'BadSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/bad.svg';
      case 'VeryBadSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/veryBad.svg';
    }
  };

  const formatHtmlTable = () => {
    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="https://www.w3.org/1999/xhtml">
      <head>
        <title>Export Mon Suivi Psy</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Karla', sans-serif;
          }
          h1 {
            color: ${colors.BLUE};
          }
          h3 {
            color: ${colors.DARK_BLUE};
          }
          span {
            color: ${colors.DARK_BLUE_TRANS};
          }
          .category {
            margin: 10px;
          }
          .graph {
            overflow: hidden;
          }
          .bar {
            float: left;
            background: ${colors.LIGHT_BLUE};
            font-size: small;
            color:white;
            text-align: center;
          }
          .footer {
            overflow: hidden;
          }
          .endDate {
            float: right;
          }
        </style>
        <style>
          .journal {
            list-style-type: none;
          }
          .journal__item {
            margin-top: 35px;
          }
          .journal__item-wrapper {
            max-width: 450px;
            border: 1px solid #ebedf2;
            border-radius: 8px;
            background-color: #f8f9fb;
          }
          .journal__item-symptoms {
            padding: 20px;
          }
          .journal__item-symptom-wrapper {
            padding: 5px 0;
            overflow: hidden;
            list-style-type: none;
          }
          .journal__item-icon-wrapper {
            border-radius: 50%;
          }
          .journal__item-image {
            float: left;
            width: 45px;
            height: 45px;
          }
          .journal__note-separator {
            width: 85%;
            margin: 8px auto 20px auto;
            border: 1px solid #ebedf2;
          }
          .journal__item-symptom-name {
            line-height: 45px;
            margin: 0;
            margin-left: 60px;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <h1>Mes données de MonSuiviPsy</h1>
        ${Object.keys(displayedCategories)
          .map((categoryId) => {
            const res = computeChartData(categoryId);
            const heighest = res.reduce((currentHeigest, current) => {
              return current > currentHeigest ? current : currentHeigest;
            }, 0);

            if (!isChartVisible(categoryId)) return '';

            return `<div class="category">
              <h3 class="header">${displayedCategories[categoryId]}</h3>
              <div class="graph">
                ${res
                  .map((value) => {
                    const height = 15 * value + 2;
                    const margin = 15 * (heighest - value);

                    return `<div
                      class="bar"
                      style="
                        height:${height}px;
                        line-height: ${height}px;
                        margin-top: ${margin}px;
                        width: ${100 / res.length - 0.5}%;
                        margin-right: 0.5%;
                      "
                    >
                      ${value || ''}
                    </div>`;
                  })
                  .join('')}
              </div>
              <div class="footer">
                <span>${firstDay.toLocaleDateString('fr-FR')}</span>
                <span class="endDate">${today.toLocaleDateString(
                  'fr-FR',
                )}</span>
              </div>
            </div>`;
          })
          .join('')}
          <h1>Mon journal</h1>
          <ul class="journal">
            ${Object.keys(diaryData)
              .map((strDate) => ({strDate, date: new Date(strDate)}))
              .sort((item1, item2) => item2.date - item1.date)
              .map(({strDate}) => {
                if (!diaryData[strDate]) return '';
                const {
                  ANXIETY_FREQUENCE,
                  BADTHOUGHTS_FREQUENCE,
                  MOOD,
                  NOTES,
                  SENSATIONS_FREQUENCE,
                  SLEEP,
                } = diaryData[strDate];

                return `
                  <li class="journal__item">
                    <p class="journal__item-date">${strDate
                      .split('-')
                      .reverse()
                      .join('/')}</p>
                    <div class="journal__item-wrapper">
                      <ul class="journal__item-symptoms">
                        ${
                          !ANXIETY_FREQUENCE
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <div class="journal__item-icon-wrapper" style="background-color:${
                              ANXIETY_FREQUENCE.color
                            }">
                              <img src="${mapImagesToState(
                                ANXIETY_FREQUENCE.icon,
                              )}" class="journal__item-image" />
                            </div>
                            <p class="journal__item-symptom-name">${
                              displayedCategories['ANXIETY_FREQUENCE']
                            }</p>
                          </li>
                        `
                        }
                        ${
                          !BADTHOUGHTS_FREQUENCE
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <img src="${mapImagesToState(
                              BADTHOUGHTS_FREQUENCE.icon,
                            )}" class="journal__item-image" />
                            <p class="journal__item-symptom-name">${
                              displayedCategories['BADTHOUGHTS_FREQUENCE']
                            }</p>
                          </li>
                        `
                        }
                        ${
                          !MOOD
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <img src="${mapImagesToState(
                              MOOD.icon,
                            )}" class="journal__item-image" />
                            <p class="journal__item-symptom-name">${
                              displayedCategories['MOOD']
                            }</p>
                          </li>
                        `
                        }
                        ${
                          !SENSATIONS_FREQUENCE
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <img src="${mapImagesToState(
                              SENSATIONS_FREQUENCE.icon,
                            )}" class="journal__item-image" />
                            <p class="journal__item-symptom-name">${
                              displayedCategories['SENSATIONS_FREQUENCE']
                            }</p>
                          </li>
                        `
                        }
                        ${
                          !SLEEP
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <img src="${mapImagesToState(
                              SLEEP.icon,
                            )}" class="journal__item-image" />
                            <p class="journal__item-symptom-name">${
                              displayedCategories['SLEEP']
                            }</p>
                          </li>
                        `
                        }
                        ${
                          !NOTES
                            ? ''
                            : `
                          <li class="journal__item-symptom-wrapper">
                            <hr class="journal__note-separator" />
                            <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/note-pencile-memo-pen-notebook-book-write-3-14650.png" class="journal__item-image" />
                            <p class="journal__item-symptom-name">${NOTES}</p>
                          </li>
                        `
                        }
                      </ul>
                    </div>
                  </li>
                `;
              })
              .join('')}
            </ul>
      </body>
    </html>`;
  };

  const exportData = async () => {
    await AsyncStorage.setItem(MailStorageKey, mail);
    const htmlExport = formatHtmlTable();

    setLoading(true);
    const res = await fetch('https://api.tipimail.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'X-Tipimail-ApiUser': API_USER,
        'X-Tipimail-ApiKey': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        to: [
          {
            address: mail,
          },
        ],
        msg: {
          from: {
            address: mailFrom,
            personalName: mailFromName,
          },
          subject: 'Export de données',
          html: htmlExport,
        },
      }),
    }).catch((err) => console.log('sendNPS err', err));

    setLoading(false);
    if (res.ok) {
      Alert.alert(
        'Mail envoyé !',
        `Retrouvez vos données sur votre boîte mail : ${mail}`,
      );
    } else {
      Alert.alert("Une erreur s'est produite !");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={this.onBackPress}
        style={styles.backButtonContainer}>
        <Text style={styles.backButton}>{'Retour'}</Text>
      </TouchableOpacity>
      <ExportData style={styles.icon} />
      {true && (
        <Text style={styles.title}>
          Recevez vos données des 30 derniers jours par mail
        </Text>
      )}

      {false && (
        <>
          <Text style={styles.title}>Recevez vos données des</Text>
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={(txt) => setDays(parseInt(txt))}
            value={'' + days}
            placeholder="Renseignez le nombre de jour"
            style={styles.inputDays}
          />
          <Text style={styles.title}>derniers jours par mail</Text>
        </>
      )}

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={setMail}
        value={mail}
        placeholder="Renseignez votre email"
        style={styles.inputMail}
      />

      {!loading && (
        <TouchableOpacity onPress={exportData} style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Exporter mes données</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: '20%',
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    height: '100%',
  },
  title: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginBottom: '20%',
    marginTop: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  exportButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  inputMail: {
    width: '75%',
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginVertical: '10%',
    padding: 10,
  },
  inputDays: {
    width: '75%',
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    padding: 10,
  },
});

export default Export;
