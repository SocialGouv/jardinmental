import React from "react";
import { Indicator } from "@/entities/Indicator";
import { DiaryDataNewEntryInput } from "@/entities/DiaryData";
import { SurveyScreenInterface } from "@/entities/SurveyScreen";

export interface SurveyContextType {
  userIndicateurs: Indicator[];
  initEditingSurvey: boolean;
  screens: SurveyScreenInterface[];
  saveAnswerForIndicator: ({ key, value }: { key:string, value: boolean | number}) => void,
  saveCommentForIndicator: ({ key, userComment }: { key:string, userComment: string}) => void,
  answers: DiaryDataNewEntryInput['answers'],
  parentNavigation: any;
  parentRoute: any;
}

const SurveyContext = React.createContext<SurveyContextType | null>(null);
export default SurveyContext