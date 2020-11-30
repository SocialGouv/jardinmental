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

import {
  TIPIMAIL_API_KEY,
  TIPIMAIL_API_USER,
  TIPIMAIL_FROM_MAIL,
  TIPIMAIL_FROM_NAME,
} from '@env';
const MailStorageKey = '@Mail';

const Export = ({navigation}) => {
  const [mail, setMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    (async () => {
      const storageMail = await AsyncStorage.getItem(MailStorageKey);
      if (storageMail) {
        setMail(storageMail);
      }
    })();
  }, []);

  onBackPress = navigation.goBack;

  const today = new Date();
  var firstDay = new Date();
  firstDay.setDate(today.getDate() - 30);
  const chartDates = getArrayOfDates({
    startDate: firstDay,
    numberOfDays: 30,
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
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/veryGood.png';
      case 'GoodSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/good.png';
      case 'MiddleSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/middle.png';
      case 'BadSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/bad.png';
      case 'VeryBadSvg':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/veryBad.png';
      case 'Notes':
        return 'https://monsuivipsy.s3-eu-west-1.amazonaws.com/notes.png';
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
          span {
            color: ${colors.DARK_BLUE_TRANS};
          }
          .graph {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          .bar {
            background: ${colors.LIGHT_BLUE};
            font-size: small;
            color:white;
            text-align: center;
          }
          .footer {
            width: 100%;
            border-collapse: collapse;
          }
          .endDate {
            text-align: right;
          }
        </style>
        <style>
          .journal {
          }
          .journal__item-date {
            margin-top: 35px;
          }
          .journal__item {
            border-radius: 8px;
            border-collapse: collapse;
          }
          .journal__item-wrapper {
            border: 1px solid #ebedf2;
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
          .journal__item-image {
            float: left;
            width: 45px;
            height: 45px;
            padding: 5px;
          }
          .journal__note-separator {
            width: 85%;
            margin: 0px auto 12px auto;
            border: 1px solid #ebedf2;
          }
          .journal__item-symptom-name {
            line-height: 45px;
            margin: 0;
            margin-left: 20px;
            padding-right: 50px;
          }
        </style>
      </head>
      <body>
        <h1>Mes données de MonSuiviPsy</h1>
        ${Object.keys(displayedCategories)
          .map((categoryId) => {
            const res = computeChartData(categoryId);
            const heighest = res.reduce((currentHeighest, current) => {
              return current > currentHeighest ? current : currentHeighest;
            }, 0);

            if (!isChartVisible(categoryId)) return '';

            return `<div style="margin: 10px">
              <h3 style="color: ${colors.DARK_BLUE};">${
              displayedCategories[categoryId]
            }</h3>
              <table class="graph">
                <tbody>
                  <tr>
                    ${res
                      .map((value) => {
                        const height = 15 * value + 2;
                        const margin = 15 * (heighest - value);

                        return `<td>
                          <div
                            class="bar"
                            style="
                              height:${height}px;
                              line-height: ${height}px;
                              margin-top: ${margin}px;
                            "
                          >
                            ${value || ' '}
                          </div>
                        </td>`;
                      })
                      .join('')}
                  </tr>
                </tbody>
              </table>
              <table class="footer">
                <tbody>
                  <tr>
                    <td>${firstDay.toLocaleDateString('fr-FR')}</td>
                    <td class="endDate">${today.toLocaleDateString(
                      'fr-FR',
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          })
          .join('')}
          <h1>Mon journal</h1>
          <div class="journal">
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
                  <p class="journal__item-date">${strDate
                    .split('-')
                    .reverse()
                    .join('/')}</p>
                  <table class="journal__item">
                    <tbody class="journal__item-wrapper">
                        ${
                          !ANXIETY_FREQUENCE
                            ? ''
                            : `
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="${mapImagesToState(
                              ANXIETY_FREQUENCE.icon,
                            )}" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${
                              displayedCategories['ANXIETY_FREQUENCE']
                            }</p></td>
                          </li>
                        `
                        }
                        ${
                          !BADTHOUGHTS_FREQUENCE
                            ? ''
                            : `
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="${mapImagesToState(
                              BADTHOUGHTS_FREQUENCE.icon,
                            )}" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${
                              displayedCategories['BADTHOUGHTS_FREQUENCE']
                            }</p></td>
                          </tr>
                        `
                        }
                        ${
                          !MOOD
                            ? ''
                            : `
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="${mapImagesToState(
                              MOOD.icon,
                            )}" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${
                              displayedCategories['MOOD']
                            }</p></td>
                          </tr>
                        `
                        }
                        ${
                          !SENSATIONS_FREQUENCE
                            ? ''
                            : `
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="${mapImagesToState(
                              SENSATIONS_FREQUENCE.icon,
                            )}" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${
                              displayedCategories['SENSATIONS_FREQUENCE']
                            }</p></td>
                          </tr>
                        `
                        }
                        ${
                          !SLEEP
                            ? ''
                            : `
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="${mapImagesToState(
                              SLEEP.icon,
                            )}" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${
                              displayedCategories['SLEEP']
                            }</p></td>
                          </tr>
                        `
                        }
                        ${
                          !NOTES
                            ? ''
                            : `
                          <tr>
                            <td colspan="2">
                              <hr class="journal__note-separator" />
                            </td
                          </tr>
                          <tr class="journal__item-symptom-wrapper">
                            <td><img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/note-pencile-memo-pen-notebook-book-write-3-14650.png" class="journal__item-image" /></td>
                            <td><p class="journal__item-symptom-name">${NOTES}</p></td>
                          </tr>
                        `
                        }
                    </tbody>
                  </table>
                `;
              })
              .join('')}
            </div>
      </body>
    </html>`;
  };

  const exportData = async () => {
    await AsyncStorage.setItem(MailStorageKey, mail);
    const htmlExport = formatHtmlTable();
    setIsLoading(true);
    const res = await fetch('https://api.tipimail.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'X-Tipimail-ApiUser': TIPIMAIL_API_USER,
        'X-Tipimail-ApiKey': TIPIMAIL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: TIPIMAIL_API_KEY,
        to: [
          {
            address: mail,
          },
        ],
        msg: {
          from: {
            address: TIPIMAIL_FROM_MAIL,
            personalName: TIPIMAIL_FROM_NAME,
          },
          subject: 'Export de données',
          html: htmlExport,
        },
      }),
    }).catch((err) => console.log('sendNPS err', err));

    setIsLoading(false);
    if (res.ok) {
      Alert.alert(
        'Mail envoyé !',
        `Retrouvez vos données sur votre boîte mail : ${mail}`,
      );
    } else {
      console.log(res);
      Alert.alert("Une erreur s'est produite !");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={this.onBackPress}
        style={styles.backButtonContainer}>
        <Text style={styles.backButton}>Retour</Text>
      </TouchableOpacity>
      <ExportData style={styles.icon} />
      <Text style={styles.title}>
        Recevez vos données des 30 derniers jours par mail
      </Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={setMail}
        value={mail}
        placeholder="Renseignez votre email"
        style={styles.inputMail}
      />

      {!isLoading && (
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
});

export default Export;
