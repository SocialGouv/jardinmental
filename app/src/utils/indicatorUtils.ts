import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { Indicator } from "../entities/Indicator";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "./liste_indicateurs.1";
import { analyzeScoresMapIcon } from "./constants";

/**
 * Gets the key used to identify an indicator in diary data
 * Falls back to 'name' if diaryDataKey is not defined
 */
export const getIndicatorKey = (indicator: Indicator): string => {
  return indicator[indicator.diaryDataKey || "name"];
};

export const computeIndicatorLabel = (indicator: Indicator, value: number | boolean): string => {
  if (value === null) return "";
  if (indicator.type === "boolean") {
    return {
      true: "Oui",
      false: "Non",
    }[value];
  }
  // Gauge: value [0,1] → index [1,5] for label lookup (1-based)
  // Smiley: value is already [1,5] (1-based)
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) + 1 : value;
  // For smiley-type indicators sorted in DESC order, invert the label index.
  // if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
  //   index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  // }

  if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
    return INDICATOR_LABELS[indicator.uuid][index - 1];
  } else {
    return DEFAULT_INDICATOR_LABELS[index - 1];
  }
};

export const computeIndicatorColor = (
  indicator: Indicator,
  value: number | boolean
): {
  color: string;
  symbol?: string;
  iconColor?: string;
} => {
  if (value === null) return "";
  if (indicator.type === "boolean") {
    return {
      true: analyzeScoresMapIcon[1],
      false: analyzeScoresMapIcon[5],
    }[value];
  }
  // Gauge: value [0,1] → index [1,5] for label lookup (1-based)
  // Smiley: value is already [1,5] (1-based)
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) + 1 : value;
  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC") {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }
  // console.log(index, analyzeScoresMapIcon[index]);
  if (indicator.name === "Charge émotionnelle : Divorce") console.log(indicator.name, index);
  return analyzeScoresMapIcon[index];
};
