import {colors} from '../common/colors';
import {displayedCategories} from '../common/constants';
import {getArrayOfDates} from '../services/date/helpers';

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
      style="
        width: 100%;
        max-width: 100%:
        border-collapse: collapse;
      "
    >
      <tbody>
        <tr>
          <td>${firstDay.toLocaleDateString('fr-FR')}</td>
          <td style="text-align: right;">
              ${today.toLocaleDateString('fr-FR')}
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateBar = (value, height, margin) => {
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
                      background-color: ${colors.LIGHT_BLUE};
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

const generateState = (symptom, symptomStrName) => {
  if (!symptom) {
    return '';
  }

  return `
    <tr class="journal__item-symptom-wrapper">
      <td>
        <img alt="emoji" title="emoji" width="45" height="45" src="${mapImagesToState(
          symptom.icon,
        )}" style="
          display: block;
          padding: 5px;
        " />
      </td>
      <td>
        <p style="
          line-height: 45px;
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">${displayedCategories[symptomStrName]}</p>
      </td>
    </tr>
  `;
};

const generateNote = (note) => {
  if (!note) {
    return '';
  }
  return `
    <tr>
      <td colspan="2" style="padding-left: 20px; padding-right: 20px">
        <hr style="
          margin: 0px auto 12px auto;
          border: 1px solid #ebedf2;
        " />
      </td>
    </tr>
    <tr class="journal__item-symptom-wrapper">
      <td>
        <img alt="emoji" title="emoji" width="45" height="45" src="${mapImagesToState(
          'Notes',
        )}" style="
          display: block;
          padding: 5px;
        " />
      </td>
      <td>
        <p style="
          line-height: 45px;
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">${note}</p>
      </td>
    </tr>
  `;
};

const formatHtmlTable = (diaryData) => {
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
          .map((categoryId) => {
            const res = computeChartData(categoryId);
            const heighest = res.reduce((currentHeighest, current) => {
              return current > currentHeighest ? current : currentHeighest;
            }, 0);

            if (!isChartVisible(categoryId)) {
              return '';
            }

            return `
              <table width="100%" style="width: 100%; max-width: 100%;">
                <tbody>
                  <tr>
                    <td>
                      <h3 style="color: ${colors.DARK_BLUE};">
                        ${displayedCategories[categoryId]}
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
                                const margin = 15 * (heighest - value);

                                return generateBar(value, height, margin);
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

                    const {
                      ANXIETY_FREQUENCE,
                      BADTHOUGHTS_FREQUENCE,
                      MOOD,
                      NOTES,
                      SENSATIONS_FREQUENCE,
                      SLEEP,
                    } = diaryData[strDate];

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
                          ${generateState(
                            ANXIETY_FREQUENCE,
                            'ANXIETY_FREQUENCE',
                          )}
                          ${generateState(
                            BADTHOUGHTS_FREQUENCE,
                            'BADTHOUGHTS_FREQUENCE',
                          )}
                          ${generateState(MOOD, 'MOOD')}
                          ${generateState(
                            SENSATIONS_FREQUENCE,
                            'SENSATIONS_FREQUENCE',
                          )}
                          ${generateState(SLEEP, 'SLEEP')}
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
