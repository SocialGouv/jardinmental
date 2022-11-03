import { v4 as uuidv4 } from "uuid";
import { INDICATEURS } from "../liste_indicateurs.1";

export const latestVersion = 1;

export const versionsTransformation = {
  /*
  {
    ind1:true
    ind2:true
    ind3:true
  }
  */
  0: (dataV0) => {
    const indicateurFromUtils = INDICATEURS.map((ind) => ind.name === dataV0.name);
    if (indicateurFromUtils) {
      return {
        version: 1,
        uuid: indicateurFromUtils.uuid,
        name: indicateurFromUtils.name,
        order: "ASC",
        type: "smiley",
        category: indicateurFromUtils.category,
        active: dataV0.active,
        position: 0,
        created_at: new Date(),
      };
    }
    return {
      version: 1,
      uuid: uuidv4(),
      name: dataV0.name,
      order: "ASC",
      type: "smiley",
      active: dataV0.active,
      position: 0,
      created_at: new Date(),
    };
  },
  /*
  {
    version: number,
    uuid: uuid,
    name: string,
    category: string,
    order: ASC | DESC,
    type: "smiley" | "boolean" | "slider",
    active: boolean,
    position: number,
  }
  */
  1: (dataV1) => {
    return dataV1;
  },
};

export const updateSymptomsFormatIfNeeded = (data) => {
  return Object.keys(data).reduce((previous, labelSymptom) => {
    let _data = data[labelSymptom];
    const dataVersion = _data?.version || 0;
    if (dataVersion === 0) _data = versionsTransformation[0]({ name: labelSymptom, active: _data });
    else {
      if (dataVersion < latestVersion) {
        for (let i = dataVersion; i < latestVersion; i++) {
          _data = versionsTransformation[i](_data);
        }
      }
    }

    return [...previous, _data];
  }, []);
};
