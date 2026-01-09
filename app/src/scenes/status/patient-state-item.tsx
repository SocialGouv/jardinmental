import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import CircledIcon from "../../components/CircledIcon";
import { EMOTION_COLORS, TW_COLORS, analyzeScoresMapIcon, scoresMapIcon } from "../../utils/constants";
import { getScoreWithState } from "../../utils";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import { DiaryDataAnswer, DiaryDataNewEntryInput, DiaryEntry } from "@/entities/DiaryData";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { computeIndicatorColor, computeIndicatorLabel } from "@/utils/indicatorUtils";
import { Typography } from "@/components/Typography";

const PatientStateItem = ({ patientStateRecord, category, label }: { patientStateRecord: DiaryDataAnswer; category: string; label: string }) => {
  const [userCommentVisible, setUserCommentVisible] = useState(false);

  const isTouchable = () => !!patientStateRecord?.userComment?.trim();

  const renderResponse = () => {
    if (patientStateRecord?._indicateur?.type === "smiley") {
      let _icon;
      if (patientStateRecord?._indicateur?.order === "DESC") {
        _icon = scoresMapIcon[5 + 1 - patientStateRecord?.value];
      } else {
        _icon = scoresMapIcon[patientStateRecord?.value];
      }
      if (!_icon || (!_icon.color && !_icon.faceIcon))
        return <CircledIcon color="#cccccc" borderColor="#999999" iconColor="#888888" icon="QuestionMarkSvg" iconWidth={32} iconHeight={32} />;
      return (
        <CircledIcon
          color={_icon.color}
          borderColor={_icon.borderColor}
          iconColor={_icon.iconColor}
          icon={_icon.faceIcon}
          iconWidth={20}
          iconHeight={20}
          iconContainerStyle={{
            flexDirection: "row",
            justifyContent: "start",
            height: "auto",
            borderRadius: 0,
            marginRight: 0,
            width: 32, // w-10 = 40px
          }}
        />
      );
    }
    if (patientStateRecord?._indicateur?.type === "boolean" || patientStateRecord?.value === true || patientStateRecord?.value === false) {
      const _value = patientStateRecord?.value;
      const color = computeIndicatorColor(patientStateRecord?._indicateur, _value);

      return (
        <View className={mergeClassNames("flex flex-row w-8")}>
          <View className="h-4 w-4 rounded-full" style={{ backgroundColor: color.color, borderColor: color?.iconColor, borderWidth: 1 }} />
        </View>
      );
    }
    if (patientStateRecord?._indicateur?.type === "gauge") {
      const _value = patientStateRecord?.value;
      const color = computeIndicatorColor(patientStateRecord?._indicateur, _value);
      return (
        <View className={mergeClassNames("flex flex-row w-8")}>
          <View className="h-4 w-4 rounded-full" style={{ backgroundColor: color.color, borderColor: color?.iconColor, borderWidth: 1 }} />
        </View>
      );
    }
    return <View />;
  };

  const content = (
    <View className="flex-col pb-1.5">
      <View className="flex flex-row items-center pt-1.5">
        {renderResponse()}
        <View className="flex-1 flex-col justify-between">
          <Typography className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-900")}>
            {label} :{" "}
            <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700")}>
              {computeIndicatorLabel(patientStateRecord._indicateur, patientStateRecord?.value)}
            </Typography>
          </Typography>
        </View>
        {isTouchable() ? (
          <Icon
            icon="ArrowUpSvg"
            color={TW_COLORS.CNAM_PRIMARY_800}
            width={13}
            height={13}
            styleContainer={{
              width: 13,
              height: 13,
              transform: [{ rotate: userCommentVisible ? "0deg" : "180deg" }],
            }}
          />
        ) : null}
      </View>
      {userCommentVisible && isTouchable() ? (
        <View className="flex flex-row items-center">
          <Typography
            numberOfLines={3}
            ellipsizeMode={"tail"}
            className={mergeClassNames("flex-1", typography.textXsRegular, "text-gray-700 text-left ml-8")}
          >
            {patientStateRecord?.userComment?.trim()}
          </Typography>
        </View>
      ) : null}
    </View>
  );

  if (isTouchable()) return <TouchableLayout onPress={() => setUserCommentVisible((e) => !e)}>{content}</TouchableLayout>;
  else return content;
};

const TouchableLayout = ({ children, onPress }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

export default PatientStateItem;
