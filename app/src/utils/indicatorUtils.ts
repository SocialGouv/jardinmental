import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { Indicator } from "../entities/Indicator";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "./liste_indicateurs.1";
import { TW_COLORS } from "./constants";

/**
 * Gets the key used to identify an indicator in diary data
 * Falls back to 'name' if diaryDataKey is not defined
 */
export const getIndicatorKey = (indicator: Indicator): string => {
  return indicator[indicator.diaryDataKey || "name"];
};

export const computeIndicatorLabel = (indicator, value): string => {
  if (value === null || value === undefined) return "Pas de donnée";
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) + 1 : value;
  if (indicator.type === INDICATOR_TYPE.boolean) {
  }

  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }
  if (indicator.type === INDICATOR_TYPE.boolean) {
    index = value === false ? 0 : 1;
    return ["Non", "Oui"][index];
  }
  if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
    return INDICATOR_LABELS[indicator.uuid][index - 1];
  } else {
    return DEFAULT_INDICATOR_LABELS[index - 1];
  }
};
