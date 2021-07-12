import {colors} from '../../utils/colors';
import {displayedCategories} from '../../utils/constants';
import {getArrayOfDates} from '../../utils/date/helpers';
import localStorage from '../../utils/localStorage';
import {getDrugListWithLocalStorage} from '../../utils/drugs-list';
import beck from '../../utils/localStorage/beck';

// methods

const colorsValue = ['#FFC0C0', '#FCD0A7', '#FCE285', '#F0F277', '#E2FA80'];
const colorsText = ['#b86564', '#ba8553', '#ab9237', '#a1a06e', '#9ab037'];

let DAYS = 30;

const hasNotes = (notes) =>
  notes &&
  ((typeof notes === 'string' && notes) || //retro compatibility
    (typeof notes === 'object' &&
      (notes?.notesEvents || notes?.notesSymptoms || notes?.notesToxic)));

const hasBeck = (becks) =>
  becks &&
  Object.keys(becks)?.filter(
    (id) => becks[id].mainEmotion && becks[id].mainEmotionIntensity,
  )?.length === 0;

const diffInDays = (d1, d2) => {
  var t2 = d2.getTime();
  var t1 = d1.getTime();

  return Math.abs(parseInt((t2 - t1) / (24 * 3600 * 1000)));
};

// GENERATORS

const generateTime = (firstDay, today) => {
  return `
    <table
      width="100%"
      style="
        width: 100%;
        max-width: 100%:
        border-collapse: collapse;
        table-layout: fixed;
      "
    >
      <tbody>
        <tr>
          <td>${firstDay.toLocaleDateString('fr-FR')}</td>
          <td align="right" style="text-align: right;">
              ${today.toLocaleDateString('fr-FR')}
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateBar = (
  value,
  height,
  backgroundColor = 'grey',
  textColor = 'white',
) => {
  return `<td style="vertical-align: bottom">
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="
        width: 100%;
        max-width: 100%
      "
    >
      <tr>
        <td style="vertical-align: bottom">
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              height="${height}"
              width="100%"
              style="
                width: 100%;
                max-width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
              "
            >
              <tbody>
                <tr>
                  <td
                    valign="middle"
                    width="100%"
                    height="${height}"
                    style="
                      width: 100%;
                      max-width: 100%;
                      vertical-align: middle;
                      background-color: ${backgroundColor};
                      text-align: center;
                      font-size: small;
                      color:${textColor};
                      word-wrap: break-word; 
                    "
                  >
                    ${value || ' '}
                  </td>
                </tr>
              </tbody>
            </table>
        </td>
      </tr>
    </table>
  </td>`;
};

const generateNote = (notes) => {
  if (!hasNotes(notes)) {
    return '';
  }

  const renderNote = (n, i) => {
    if (!n) return '';
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
      ${i ? `<b>${i} :</b> ` : ''}${n}
    </p>`;
  };

  if (typeof notes === 'string') {
    //retro compatibility
    return `
    <tr class="journal__item-symptom-wrapper">
      <td>
        ${renderNote(notes)}
      </td>
    </tr>
  `;
  } else {
    return `<tr class="journal__item-symptom-wrapper">
      <td>
        ${renderNote(notes.notesEvents, 'Évènement')}
        ${renderNote(notes.notesSymptoms, 'Symptôme')}
        ${renderNote(notes.notesToxic, 'Toxique')}
      </td>
    </tr>`;
  }
};

const generateBeck = (beck) => {
  if (!beck || !(beck?.mainEmotion && beck?.mainEmotionIntensity)) {
    return '';
  }

  const renderTitle = (e) => `<p
      style="
          margin: 0;
          margin-top:20px;
          margin-left: 20px;
          padding-right: 50px;
          color:${colors.DARK_BLUE};
          font-size: large;
        ">
      ${e ? `<b>${e}</b> ` : ''}
    </p>`;

  const renderItem = (e, t) => {
    if (!e || e.length === 0) return '';
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ''}${e}
    </p>`;
  };
  const renderItemWithPercentage = (e, p, t) => {
    if (!e) return '';
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ''}${e} ${p ? `(${p * 10}%)` : ''}
    </p>`;
  };

  const renderListItem = (list, t) => {
    if (!list || list.length === 0) return '';
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ''}${list.join(', ')}
    </p>`;
  };

  const renderBeck = (b) => {
    return `
    ${renderTitle('La situation')}
    ${renderItem(`${b?.date} à ${b?.time}`)}
    ${renderListItem(b?.who, 'Avec')}
    ${renderItem(b?.where)}
    ${renderItem(b?.what, 'Description factuelle')}
    ${renderTitle('Vos émotions')}
    ${renderItemWithPercentage(
      b?.mainEmotion,
      b?.mainEmotionIntensity,
      'Émotion principale',
    )}
    ${renderListItem(b?.otherEmotions, 'Autres émotions')}
    ${renderListItem(b?.physicalSensations, 'Sensations')}
    ${renderTitle('Vos pensées')}
    ${renderItemWithPercentage(
      b?.thoughtsBeforeMainEmotion,
      b?.trustInThoughsThen,
      'Pensée immédiate',
    )}
    ${renderItem(b?.memories, 'Images et souvenirs')}
    ${renderTitle('Comportement et Résultats')}
    ${renderItem(b?.actions, "Qu'avez-vous fait ?")}
    ${renderItem(b?.consequencesForYou, 'Conséquences pour vous')}
    ${renderItem(
      b?.consequencesForRelatives,
      'Conséquences pour votre entourage',
    )}
    ${renderTitle('Restructuration')}
    ${renderItem(b?.argumentPros, 'Arguments en faveur')}
    ${renderItem(b?.argumentCons, 'Arguments en défaveur')}
    ${renderItemWithPercentage(
      b?.nuancedThoughts,
      b?.trustInThoughsNow,
      'Pensée nuancée',
    )}
    ${renderItemWithPercentage(
      b?.mainEmotion,
      b?.mainEmotionIntensityNuanced,
      'Émotions après coup',
    )}
    `;
  };

  return `
    <tr class="journal__item-symptom-wrapper">
      <td>
        ${renderBeck(beck)}
      </td>
    </tr>
  `;
};

const formatHtmlTable = async (diaryData) => {
  const MAX_DAY = 30;
  const today = new Date();
  const todayMinusMaxDay = new Date();
  todayMinusMaxDay.setDate(today.getDate() - MAX_DAY);

  const firstDay = new Date();
  const firstDayDiaryData = Object.keys(diaryData)
    .map((strDate) => ({strDate, date: new Date(strDate)}))
    .sort((item1, item2) => item1.date - item2.date)[0];

  if (firstDayDiaryData.date.getTime() > todayMinusMaxDay.getTime())
    firstDay.setTime(firstDayDiaryData.date.getTime());
  else firstDay.setDate(today.getDate() - MAX_DAY);

  const diffDays = diffInDays(firstDay, today);
  DAYS = diffDays;

  const chartDates = getArrayOfDates({
    startDate: firstDay,
    numberOfDays: diffDays,
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

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split('_');
      let categoryStateIntensity = null;
      if (suffix && suffix === 'FREQUENCE') {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][
          `${categoryName}_INTENSITY`
        ] || {level: 3};
        return categoryState.level + categoryStateIntensity.level - 1;
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

  const isDrugVisible = (drug) => {
    let visible = false;
    chartDates.forEach((date) => {
      if (!diaryData[date]) return;
      if (!diaryData[date]?.POSOLOGY?.find((e) => e.id === drug.id)) return;
      visible = true;
    });
    return visible;
  };

  const computeChartDrug = (drug) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const drugToday = diaryData[date]?.POSOLOGY?.find(
        (e) => e.id === drug.id,
      );
      if (!drugToday) {
        return null;
      }
      return drugToday.value;
    });
  };

  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split('_');
    if (suffix && suffix === 'FREQUENCE') {
      return categoryName;
    }
    return category;
  };

  let customsSymptoms = await localStorage.getCustomSymptoms();
  customsSymptoms = customsSymptoms.map((e) => `${e}_FREQUENCE`);

  const drugListWithLocalStorage = await getDrugListWithLocalStorage();

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
        <style type="text/css">
          table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;}
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        </style>
      </head>
      <body width="100%">
        <h1 style="color: ${colors.BLUE}">Mes données de MonSuiviPsy</h1>
        ${Object.keys(displayedCategories)
          .concat(customsSymptoms)
          .map((categoryId) => {
            const res = computeChartData(categoryId);

            if (!isChartVisible(categoryId)) {
              return '';
            }

            return `
              <table width="100%" style="width: 100%; max-width: ${Math.min(
                // ne pas depasser 100
                100,
                Math.max(0, (100 * (DAYS + 1)) / 30), // ne pas depasser 0
              )}%;">
                <tbody>
                  <tr>
                    <td>
                      <h3 style="color: ${colors.LIGHT_BLUE};">
                        ${getTitle(categoryId)}
                      </h3>
                      <table
                        width="100%"
                        style="
                          width: 100%;
                          max-width: 100%;
                          border-collapse: collapse;
                          table-layout: fixed;
                        "
                      >
                        <tbody>
                          <tr>
                            ${res
                              .map((value) => {
                                const height = 15 * value + 2;

                                return generateBar(
                                  value,
                                  height,
                                  colorsValue[value - 1],
                                  colorsText[value - 1],
                                );
                              })
                              .join('')}
                          </tr>
                        </tbody>
                      </table>
                      ${generateTime(firstDay, today)}
                    </td>
                  </tr>
                </tbody>
              </table>
            `;
          })
          .join('')}
        <h1 style="color: ${colors.BLUE}">Mon traitement</h1>
        ${drugListWithLocalStorage
          .map((drug) => {
            if (!isDrugVisible(drug)) {
              return '';
            }
            const res = computeChartDrug(drug);

            return `
              <table width="100%" style="width: 100%; max-width: ${Math.min(
                // ne pas depasser 100
                100,
                Math.max(0, (100 * (DAYS + 1)) / 30), // ne pas depasser 0
              )}%;">
                <tbody>
                  <tr>
                    <td>
                      <h3 style="color: ${colors.DARK_BLUE};">
                        ${drug.id}
                      </h3>
                      <table
                        width="100%"
                        style="
                          width: 100%;
                          max-width: 100%;
                          border-collapse: collapse;
                          table-layout: fixed;
                        "
                      >
                        <tbody>
                          <tr>
                            ${res
                              .map((value) => {
                                const height = 15 * value + 2;

                                return generateBar(value, height, colors.BLUE);
                              })
                              .join('')}
                          </tr>
                        </tbody>
                      </table>
                      ${generateTime(firstDay, today)}
                    </td>
                  </tr>
                </tbody>
              </table>
            `;
          })
          .join('')}
          <h1 style="color: ${colors.BLUE};">Mon journal</h1>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                ${Object.keys(diaryData)
                  .map((strDate) => ({strDate, date: new Date(strDate)}))
                  .sort((item1, item2) => item2.date - item1.date)
                  .map(({strDate}) => {
                    if (!diaryData[strDate]) {
                      return '';
                    }
                    const {NOTES, becks} = diaryData[strDate];

                    if (!hasNotes(NOTES) && !hasBeck(becks)) {
                      return '';
                    }
                    return `
                      <p style="margin-top: 35px;">${strDate
                        .split('-')
                        .reverse()
                        .join('/')}</p>
                      <table style="
                        border-collapse: collapse;
                      ">
                        <tbody style="
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
                          ${generateNote(NOTES)}
                          ${
                            becks
                              ? Object.keys(becks)
                                  ?.map((id) => generateBeck(becks[id]))
                                  .join('<hr/>')
                              : ''
                          }
                        </tbody>
                      </table>
                    `;
                  })
                  .join('')}
                </td>
              </tr>
            </table>
      </body>
    </html>
  `;
};

module.exports = {
  formatHtmlTable,
};
