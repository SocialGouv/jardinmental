import { colors } from "../../utils/colors";
import { displayedCategories, categories, translateCategories, scoresMapIcon } from "../../utils/constants";
import { getArrayOfDates, formatDate } from "../../utils/date/helpers";
import localStorage from "../../utils/localStorage";
import { getDrugListWithLocalStorage } from "../../utils/drugs-list";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { INDICATEURS } from "../../utils/liste_indicateurs";

// methods

const hasNotes = (notes) =>
  !!notes &&
  ((typeof notes === "string" && notes) || //retro compatibility
    (typeof notes === "object" && Object.keys(notes)?.length > 0));

const hasBeck = (becks) => !!becks && Object.keys(becks)?.length > 0;
const hasDiaryNotes = (diary) => !!diary && diary?.values?.some((e) => e.value);
const hasContext = (survey) => !!survey && Object.keys(survey)?.some((k) => survey[k]?.userComment?.length);

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
          <td>${format(firstDay, "EEEE d MMMM", { locale: fr })}</td>
          <td align="right" style="text-align: right;">
              ${format(today, "EEEE d MMMM", { locale: fr })}
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateBar = (value, height, backgroundColor = "grey", textColor = "white") => {
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
                    ${value || " "}
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
    return "";
  }

  const renderNote = (n, i) => {
    if (!n) return "";
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
          padding-top: 2px;
          padding-bottom: 2px;
        ">
      ${i ? `<b>${i} :</b> ` : ""}${n}
    </p>`;
  };

  if (typeof notes === "string") {
    //retro compatibility
    return `
    <tr class="journal__item-symptom-wrapper" >
      <td style="padding:10px;">
        ${renderNote(notes)}
      </td>
    </tr>
  `;
  } else {
    return `
    <tr class="journal__item-symptom-wrapper">  
      <td style="padding:10px;">
        ${renderNote(notes.notesEvents, "Évènement")}
        ${renderNote(notes.notesSymptoms, "Symptôme")}
        ${renderNote(notes.notesToxic, "Toxique")}
      </td>
    </tr>`;
  }
};
const generateDiaryNote = (notes) => {
  return notes
    ?.filter((e) => e.value)
    ?.map(
      (e) => `<tr class="journal__item-symptom-wrapper">  <td style="padding:10px;">
        <p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
          padding-top: 2px;
          padding-bottom: 2px;
        ">${e.value}</p>
      </td></tr>`
    )
    ?.join("");
};

const generateBeck = (beck) => {
  if (!beck) {
    return "";
  }

  const renderTitle = (e) => `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
          color:${colors.DARK_BLUE};
          font-size: large;
        ">
      ${e ? `<b>${e}</b> ` : ""}
    </p>`;

  const renderItem = (e, t) => {
    if (!e || e.length === 0) return "";
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ""}${e}
    </p>`;
  };
  const renderItemWithPercentage = (e, p, t) => {
    if (!e) return "";
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ""}${e} ${p ? `(${p * 10}%)` : ""}
    </p>`;
  };

  const renderListItem = (list, t) => {
    if (!list || list.length === 0) return "";
    return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
        ">
       ${t ? `<b>${t} :</b> ` : ""}${list.join(", ")}
    </p>`;
  };

  const renderSeparator = () => '<div style="height:20px;width:1px;"></div>';

  const renderBeck = (b) => {
    return `
    ${renderTitle("La situation")}
    ${renderItem(b?.date, "Le")}
    ${renderItem(b?.time, "À")}
    ${renderListItem(b?.who, "Avec")}
    ${renderItem(b?.where)}
    ${renderItem(b?.what, "Description factuelle")}
    ${renderSeparator()}
    ${renderTitle("Vos émotions")}
    ${renderItemWithPercentage(b?.mainEmotion, b?.mainEmotionIntensity, "Émotion principale")}
    ${renderListItem(b?.otherEmotions, "Autres émotions")}
    ${renderListItem(b?.physicalSensations, "Sensations")}
    ${renderSeparator()}
    ${renderTitle("Vos pensées")}
    ${renderItemWithPercentage(b?.thoughtsBeforeMainEmotion, b?.trustInThoughsThen, "Pensée immédiate")}
    ${renderItem(b?.memories, "Images et souvenirs")}
    ${renderSeparator()}
    ${renderTitle("Comportement et Résultats")}
    ${renderItem(b?.actions, "Qu'avez-vous fait ?")}
    ${renderItem(b?.consequencesForYou, "Conséquences pour vous")}
    ${renderItem(b?.consequencesForRelatives, "Conséquences pour votre entourage")}
    ${renderSeparator()}
    ${renderTitle("Restructuration")}
    ${renderItem(b?.argumentPros, "Arguments en faveur")}
    ${renderItem(b?.argumentCons, "Arguments en défaveur")}
    ${renderItemWithPercentage(b?.nuancedThoughts, b?.trustInThoughsNow, "Pensée nuancée")}
    ${renderItemWithPercentage(b?.mainEmotion, b?.mainEmotionIntensityNuanced, "Émotions après coup")}
    `;
  };

  return `
    <tr class="journal__item-symptom-wrapper">
      <td style="padding:10px;">
        ${renderBeck(beck)}
      </td>
    </tr>
  `;
};

const formatHtmlTable = async (diaryData, diaryNotes) => {
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
      const categoryState = dayData[categoryId] || dayData[`${categoryId}_FREQUENCE`];
      if (!categoryState) {
        return null;
      }

      if (categoryState?.value) return categoryState?.value;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = dayData[`${categoryName}_INTENSITY`] || {
          level: 3,
        };
        return categoryState.level + categoryStateIntensity.level - 1;
      }
      return categoryState.level ? categoryState.level - 1 : null;
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
      const drugToday = diaryData[date]?.POSOLOGY?.find((e) => e.id === drug.id);
      if (!drugToday) {
        return null;
      }
      return drugToday.value;
    });
  };

  const getTitle = (cat) => {
    const category = INDICATEURS[cat] || displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
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
          * { font-size: 12px; }
          h1 { font-size: 20px; }
          h2 { font-size: 16px; }
          h3 { font-size: 14px; }
          table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;}
          a:hover {text-decoration: underline;}
          h2 a,h2 a:visited,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        </style>
      </head>
      <body width="100%">
        <h1 style="text-align:center;color: ${colors.BLUE}">Mes données de MonSuiviPsy</h1>
        <h2 style="color: ${colors.BLUE}">Mon état et mon traitement</h2>
        <h3 style="color: ${colors.BLUE}">Mes ressentis</h3>
        ${Object.keys(categories)
          .concat(customsSymptoms)
          .concat(Object.keys(INDICATEURS))
          .reduce((acc, curr) => {
            if (!acc.find((a) => a === curr)) {
              acc.push(curr);
            }
            return acc;
          }, [])
          .map((categoryId) => {
            const res = computeChartData(categoryId);

            if (!isChartVisible(categoryId)) {
              return "";
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
                                  scoresMapIcon[value]?.color,
                                  scoresMapIcon[value]?.iconColor
                                );
                              })
                              .join("")}
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
          .join("")}
        <h3 style="margin-top:15px;color: ${colors.BLUE}">Mon traitement</h3>
          ${drugListWithLocalStorage
            .map((drug) => {
              if (!isDrugVisible(drug)) {
                return "";
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
                                .join("")}
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
            .join("")}
          <hr style="margin: 4rem 2rem;"/>
          <h2 style="margin-top:15px;color: ${colors.BLUE};">Mon suivi d'évènements</h2>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                ${Object.keys({ ...diaryData, ...diaryNotes })
                  .map((strDate) => ({ strDate, date: new Date(strDate) }))
                  .sort((item1, item2) => item2.date - item1.date)
                  .map(({ strDate }) => {
                    if (!diaryData[strDate] && !diaryNotes[strDate]) {
                      return "";
                    }
                    let NOTES = diaryData[strDate]?.NOTES || null;
                    let becks = diaryData[strDate]?.becks || null;
                    const diaryNoteDate = diaryNotes[strDate];
                    const diaryDataDate = diaryData[strDate];

                    if (
                      !hasNotes(NOTES) &&
                      !hasBeck(becks) &&
                      !hasDiaryNotes(diaryNoteDate) &&
                      !hasContext(diaryDataDate)
                    ) {
                      return "";
                    }
                    return `
                      <h3 style="margin-top: 35px;">${formatDate(strDate).split("-").reverse().join("/")}</>
                      ${hasNotes(NOTES) ? renderSurveyNotes(NOTES) : "<div/>"}
                      ${hasContext(diaryDataDate) ? renderSurvey(diaryData, strDate) : "<div/>"}
                      ${hasDiaryNotes(diaryNoteDate) ? renderDiaryNotes(diaryNoteDate.values) : "<div/>"}
                      ${hasBeck(becks) ? renderBecks(becks) : "<div/>"}
                    `;
                  })
                  .join("")}
                </td>
              </tr>
            </table>
      </body>
    </html>
  `;
};

const renderSurvey = (data, date) => {
  const getUserComments = (obj, key) => {
    const userComments = Object.keys(obj[key] || [])
      ?.filter((s) => obj[key][s]?.userComment?.trim())
      .map((e) => ({ id: e, value: obj[key][e].userComment?.trim() }));
    return userComments;
  };

  const renderUserComment = (key, value) => {
    if (key === "TOXIC" && !data[date][key]?.value) return "";
    if (key === "TOXIC") {
      return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
          padding-top: 2px;
          padding-bottom: 2px;
        ">
      <b>Toxique : </b>${value || "oui"}
    </p>`;
    } else {
      return `<p
      style="
          margin: 0;
          margin-left: 20px;
          padding-right: 50px;
          padding-top: 2px;
          padding-bottom: 2px;
        ">
      <b>${translateCategories[key] || key} : </b>${value}
    </p>`;
    }
  };

  return `<h4 style="color: ${colors.BLUE};">Questionnaire</h4>
                      <table style="
                        border-collapse: collapse;
                        margin-bottom: 20px;
                      ">
                        <tbody style="
                          padding:15px;
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
                          <tr class="journal__item-symptom-wrapper">
                            <td style="padding:10px;">
                              ${getUserComments(data, date)
                                ?.map(
                                  (userComment) =>
                                    userComment && renderUserComment(userComment.id, userComment.value)
                                )
                                .join("")}            
                            </td>
                          </tr>
                        </tbody>
                      </table>`;
};

const renderSurveyNotes = (value) => {
  return `<h4 style="color: ${colors.BLUE};">Mes notes</h4>
                      <table style="
                        border-collapse: collapse;
                        margin-bottom: 20px;
                      ">
                        <tbody style="
                          padding:15px;
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
                          ${generateNote(value)}
                        </tbody>
                      </table>`;
};

const renderBecks = (value) => {
  return `<h4 style="color: ${colors.BLUE};">Mes fiches de pensées automatiques</h4>
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
                            value
                              ? Object.keys(value)
                                  ?.map((id) => generateBeck(value[id]))
                                  .join("<hr/>")
                              : ""
                          }
                        </tbody>
                      </table>`;
};

const renderDiaryNotes = (value) => {
  return `<h4 style="color: ${colors.BLUE};">Mon journal</h4>
                      <table style="
                        border-collapse: collapse;
                        margin-bottom: 20px;
                      ">
                        <tbody style="
                          padding:15px;
                          border: 1px solid #ebedf2;
                          background-color: #f8f9fb;
                        ">
                          ${generateDiaryNote(value)}
                        </tbody>
                      </table>`;
};

module.exports = {
  formatHtmlTable,
};
