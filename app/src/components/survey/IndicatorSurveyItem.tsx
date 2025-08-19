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
import { generateIndicatorFromPredefinedIndicator, Indicator, INDICATOR_TYPE, PredefineIndicatorV2SchemaType } from "@/entities/Indicator";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS, INDICATORS, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import BasicCard from "../BasicCard";
import IndicatorModal from "@/scenes/onboarding-v2/indicators/IndicatorModal";
import { useBottomSheet } from "@/context/BottomSheetContext";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
import localStorage from "@/utils/localStorage/index";

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

  const addIndicatorForCategory = async (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => {
    for (const indicatorItem of indicators) {
      await localStorage.replaceOrAddIndicateur({
        ...generateIndicatorFromPredefinedIndicator(indicatorItem),
        baseIndicatorUuid: indicatorItem.uuid,
        uuid: indicator.uuid, // we keep the same uuid for tracking purpose in the stats
      });
    }
    if (typeof onIndicatorChange === "function") {
      onIndicatorChange();
    }
  };

  const computeIndicatorLabel = (): string => {
    if (value === null) return "";
    const index = Math.min(Math.floor(value * 5), 4);
    return (INDICATOR_LABELS[indicator.uuid] || DEFAULT_INDICATOR_LABELS)[index] ?? "";
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
    <BasicCard>
      <View>
        <Text className={mergeClassNames(typography.textMdMedium, "text-brand-950", "mb-6")}>{indicator.name}</Text>
      </View>
      {renderInput()}
      {indicator.type === INDICATOR_TYPE.gauge && (
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700 h-5")}>{computeIndicatorLabel() || ""}</Text>
      )}
      {showComment && (
        <InputText
          fill
          preset="lighten"
          placeholder="Ajoutez une note sur cet élément"
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
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => {
              showBottomSheet(
                <IndicatorModal
                  disabledIndicators={allIndicators}
                  category={indicator.mainCategory}
                  addedIndicators={[]}
                  initialSelectedIndicators={[]}
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    marginVertical: 8,
  },
  contentContainer: {
    padding: 16,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 3,
  },
  emojisContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  selectionContainer: {
    padding: 6,
    backgroundColor: "white",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 8,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
});
