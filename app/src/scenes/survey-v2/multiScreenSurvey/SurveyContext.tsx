import React from "react";
import { Indicator } from "../../../entities/Indicator";
import { SurveyScreen } from "./hooks/useSurveyScreens";

export interface SurveyContextType {
  userIndicateurs: Indicator[];
  initEditingSurvey: boolean;
  screens: SurveyScreen[];
  parentNavigation: any;
  parentRoute: any;
}

const SurveyContext = React.createContext<SurveyContextType | null>(null);
export default SurveyContext