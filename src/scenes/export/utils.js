import {colors} from '../../utils/colors';
import {displayedCategories} from '../../utils/constants';
import {getArrayOfDates, formatDate} from '../../utils/date/helpers';
import localStorage from '../../utils/localStorage';
import {getDrugListWithLocalStorage} from '../../utils/drugs-list';
import {parseISO, format} from 'date-fns';
import {fr} from 'date-fns/locale';

// methods

const colorsValue = ['#FFC0C0', '#FCD0A7', '#FCE285', '#F0F277', '#E2FA80'];
const colorsText = ['#b86564', '#ba8553', '#ab9237', '#a1a06e', '#9ab037'];

const hasNotes = (notes) =>
  !!notes &&
  ((typeof notes === 'string' && notes) || //retro compatibility
    (typeof notes === 'object' &&
      (notes?.notesEvents || notes?.notesSymptoms || notes?.notesToxic)));

const hasBeck = (becks) => becks && Object.keys(becks)?.length > 0;

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
          <td>${format(firstDay, 'EEEE d MMMM', {locale: fr})}</td>
          <td align="right" style="text-align: right;">
              ${format(today, 'EEEE d MMMM', {locale: fr})}
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
          padding-top: 2px;
          padding-bottom: 2px;
        ">
      ${i ? `<b>${i} :</b> ` : ''}${n}
    </p>`;
  };

  if (typeof notes === 'string') {
    //retro compatibility
    return `
    <p style="text-decoration: underline;margin:0;padding:8px">Mes notes</p>
    <tr class="journal__item-symptom-wrapper" >
      <td style="padding:10px;">
        ${renderNote(notes)}
      </td>
    </tr>
  `;
  } else {
    return `<p style="text-decoration: underline;margin:0;padding:8px">Mes notes</p>
    <tr class="journal__item-symptom-wrapper">  
      <td style="padding:10px;">
        ${renderNote(notes.notesEvents, 'Évènement')}
        ${renderNote(notes.notesSymptoms, 'Symptôme')}
        ${renderNote(notes.notesToxic, 'Toxique')}
      </td>
    </tr>`;
  }
};

const generateBeck = (beck) => {
  if (!beck) {
    return '';
  }

  const renderTitle = (e) => `<p
      style="
          margin: 0;
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

  const renderSeparator = () => '<div style="height:20px;width:1px;"/>';

  const renderBeck = (b) => {
    return `
    ${renderTitle('La situation')}
    ${renderItem(b?.date, 'Le')}
    ${renderItem(b?.time, 'À')}
    ${renderListItem(b?.who, 'Avec')}
    ${renderItem(b?.where)}
    ${renderItem(b?.what, 'Description factuelle')}
    ${renderSeparator()}
    ${renderTitle('Vos émotions')}
    ${renderItemWithPercentage(
      b?.mainEmotion,
      b?.mainEmotionIntensity,
      'Émotion principale',
    )}
    ${renderListItem(b?.otherEmotions, 'Autres émotions')}
    ${renderListItem(b?.physicalSensations, 'Sensations')}
    ${renderSeparator()}
    ${renderTitle('Vos pensées')}
    ${renderItemWithPercentage(
      b?.thoughtsBeforeMainEmotion,
      b?.trustInThoughsThen,
      'Pensée immédiate',
    )}
    ${renderItem(b?.memories, 'Images et souvenirs')}
    ${renderSeparator()}
    ${renderTitle('Comportement et Résultats')}
    ${renderItem(b?.actions, "Qu'avez-vous fait ?")}
    ${renderItem(b?.consequencesForYou, 'Conséquences pour vous')}
    ${renderItem(
      b?.consequencesForRelatives,
      'Conséquences pour votre entourage',
    )}
    ${renderSeparator()}
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
    <p style="text-decoration: underline;margin:0;padding:8px">Mes colonnes de Beck</p>
    <tr class="journal__item-symptom-wrapper">
      <td style="padding:10px;">
        ${renderBeck(beck)}
      </td>
    </tr>
  `;
};

const formatHtmlTable = async (diaryData) => {
  const today = new Date();
  const firstDay = new Date();
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
      const categoryState = dayData[categoryId];
      if (!categoryState) {
        return null;
      }

      if (typeof categoryState === 'number') return categoryState;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split('_');
      let categoryStateIntensity = null;
      if (suffix && suffix === 'FREQUENCE') {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = dayData[`${categoryName}_INTENSITY`] || {
          level: 3,
        };
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
              <table width="100%" style="width: 100%; max-width: 100%;">
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
              <table width="100%" style="width: 100%; max-width: 100%;">
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
                    // if there no NOTES.x => display nothing
                    console.log(hasNotes(NOTES));
                    console.log(hasBeck(becks));
                    if (!hasNotes(NOTES) && !hasBeck(becks)) {
                      return '';
                    }
                    return `
                      <p style="margin-top: 35px;">${formatDate(strDate)
                        .split('-')
                        .reverse()
                        .join('/')}</p>
                      <table style="
                        border-collapse: collapse;
                        margin-bottom: 20px;
                      ">
                        <tbody style="
                          padding:15px;
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
                          ${generateNote(NOTES)}
                        </tbody>
                      </table>
                      <table style="
                        border-collapse: collapse;
                        margin-bottom: 20px;
                      ">
                        <tbody style="
                          padding:15px;
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
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
