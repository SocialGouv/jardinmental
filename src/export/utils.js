import {colors} from '../common/colors';
import {displayedCategories} from '../common/constants';
import {getArrayOfDates} from '../services/date/helpers';
import localStorage from '../utils/localStorage';
import {DRUG_LIST} from '../utils/drugs-list';

// methods

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

const generateBar = (value, height, color = colors.LIGHT_BLUE) => {
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
                      background-color: ${color};
                      text-align: center;
                      font-size: small;
                      color:white;
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
  if (
    !notes ||
    (typeof notes === 'string' && !notes) || //retro compatibility
    (typeof notes === 'object' &&
      !notes?.notesEvents &&
      !notes?.notesSymptoms &&
      !notes?.notesToxic)
  ) {
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

  let customs = await localStorage.getCustomSymptoms();
  customs = customs.map((e) => `${e}_FREQUENCE`);

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
          .concat(customs)
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
                                  colors.LIGHT_BLUE,
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
        ${DRUG_LIST.map((drug) => {
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
        }).join('')}
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
                    const {NOTES} = diaryData[strDate];
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
