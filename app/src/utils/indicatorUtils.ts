import { Indicator } from "../entities/Indicator";

/**
 * Gets the key used to identify an indicator in diary data
 * Falls back to 'name' if diaryDataKey is not defined
 */
export const getIndicatorKey = (indicator: Indicator): string => {
  return indicator[indicator.diaryDataKey || "name"];
};
