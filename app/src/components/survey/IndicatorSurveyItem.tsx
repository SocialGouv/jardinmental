import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputText } from "../InputText";
import { mergeClassNames } from "@/utils/className";

import { Smiley } from "@/components/survey/Smiley";
import { Boolean } from "./Boolean";
import Gauge from "../gauge";
import { colors } from "@/utils/colors";
import { typography } from "@/utils/typography";
import { IndicatorItem } from "@/scenes/onboarding-v2/types";
import { generateIndicatorFromPredefinedIndicator, Indicator, PredefineIndicatorV2SchemaType } from "@/entities/Indicator";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS, INDICATORS, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import BasicCard from "../BasicCard";
import IndicatorModal from "@/scenes/onboarding-v2/indicators/IndicatorModal";
import { useBottomSheet } from "@/context/BottomSheetContext";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
import localStorage from "@/utils/localStorage/index";
import CheckMarkIcon from "@assets/svg/icon/check";

export const IndicatorSurveyItem = ({
  indicator,
  index,
  value,
  onValueChanged,
  comment,
  onCommentChanged,
  showComment,
  onIndicatorChange,
  allIndicators = [],
}: {
  indicator: Indicator;
  index: number;
  value: number;
  comment?: string;
  onValueChanged: () => {};
  onCommentChanged: () => {};
  showComment: boolean;
  onIndicatorChange?: () => void;
  allIndicators?: Indicator[];
}) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [displayedName, setDisplayedName] = useState(indicator.name);
  const [addedIndicators, setAddedIndicators] = useState<PredefineIndicatorV2SchemaType[]>([]);

  const addIndicatorForCategory = async (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => {
    for (const indicatorItem of indicators) {
      await localStorage.replaceOrAddIndicateur({
        ...generateIndicatorFromPredefinedIndicator(indicatorItem),
        baseIndicatorUuid: indicatorItem.uuid,
        uuid: indicator.uuid, // we keep the same uuid for tracking purpose in the stats
      });
    }
    setAddedIndicators(indicators);
    // in this case indicators maximum one element, that is the one to display
    if (indicators.length > 0) {
      setDisplayedName(indicators[0].name);
    } else {
      setDisplayedName(indicator.name);
    }
    if (typeof onIndicatorChange === "function") {
      onIndicatorChange();
    }
  };

  const computeIndicatorLabel = (): string => {
    if (value === null) return "";
    let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) + 1 : value;
    // For smiley-type indicators sorted in DESC order, invert the label index.
    if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
      index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
    }

    if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
      return INDICATOR_LABELS[indicator.uuid][index - 1];
    } else {
      return DEFAULT_INDICATOR_LABELS[index - 1];
    }
  };

  const [_comment, _setComment] = useState(comment);
  useEffect(() => {
    _setComment(comment);
  }, [comment]);

  const renderInput = () => {
    switch (indicator?.type) {
      case "smiley":
        return <Smiley indicator={indicator} value={value} onValueChanged={onValueChanged} />;
      case "boolean":
        return <Boolean indicator={indicator} value={value} onChange={(v) => onValueChanged({ indicator, value: v })} />;
      case "gauge":
        return <Gauge defaultValue={value} onChange={(v) => onValueChanged({ indicator, value: v })} reverse={indicator?.order === "DESC"} />;
      default:
        <View>
          <Text>pas encore geré</Text>
        </View>;
    }
    return (
      <View>
        <Text>pas encore geré</Text>
      </View>
    );
  };
  return (
    <BasicCard completed={value !== undefined}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>{displayedName || indicator.name}</Text>
        {indicator.type === INDICATOR_TYPE.smiley && (
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 h-5")}>{computeIndicatorLabel() || ""}</Text>
        )}
        {value !== undefined && <CheckMarkIcon color={TW_COLORS.CNAM_PRIMARY_700} />}
      </View>
      {renderInput()}
      {indicator.type === INDICATOR_TYPE.gauge && (
        <View className="flex-row justify-between">
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700 h-5")}>{"Très faible"}</Text>
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700 h-5")}>{"Très élevé(e)"}</Text>
        </View>
      )}
      {showComment && (
        <InputText
          fill
          preset="lighten"
          placeholder="Ajoutez une note"
          value={_comment}
          onChangeText={(nextComment) => {
            _setComment(nextComment);
            onCommentChanged?.({ comment: nextComment, indicator });
          }}
          multiline={true}
          textAlignVertical="top"
          containerStyle={{ marginTop: 20 }}
        />
      )}
      {indicator.isGeneric && (
        <View className="flex-row mt-6">
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <IndicatorModal
                  userIndicators={allIndicators}
                  genericIndicator={indicator}
                  category={indicator.mainCategory}
                  addedIndicators={addedIndicators}
                  initialSelectedIndicators={addedIndicators.map((i) => i.uuid)}
                  multiSelect={false}
                  onClose={(categoryName: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => {
                    if (typeof addIndicatorForCategory === "function") {
                      addIndicatorForCategory(categoryName, indicators);
                      closeBottomSheet();
                    }
                  }}
                />
              );
            }}
            className="flex-row ml-auto items-center justify-center"
          >
            <Text className={mergeClassNames(typography.textMdSemibold, "text-brand-950 mr-1")}>Préciser</Text>
            <ArrowIcon color={TW_COLORS.BRAND_700} />
          </TouchableOpacity>
        </View>
      )}
    </BasicCard>
  );
};
