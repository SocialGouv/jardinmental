import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "../../../components/Icon";
import Separator from "../../../components/Separator";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";

export const GoalsStatus = ({ goalsData, date, withSeparator }) => {
  const recordIds = goalsData?.records?.byDate?.[date] || [];
  const records = recordIds
    .map((id) => goalsData?.records?.data?.[id])
    .sort((a, b) => goalsData?.goals?.byOrder?.indexOf?.(a?.goalId) - goalsData?.goals?.byOrder?.indexOf?.(b?.goalId));
  if (!records.length) {
    return null;
  }
  return (
    <>
      {withSeparator && <Separator separatorColor={TW_COLORS.GRAY_400} />}
      <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-900")}>Objectifs</Text>
      <View className="my-2">
        {records.map((record, index) => (
          <GoalStatusItem key={record?.id} goalsData={goalsData} record={record} />
        ))}
      </View>
    </>
  );
};

const GoalStatusItem = ({ goalsData, record }) => {
  const goal = goalsData?.goals?.data?.[record.goalId];

  const [commentVisible, setCommentVisible] = useState(false);

  const PressableIfNeeded = ({ children }) =>
    record.comment ? (
      <TouchableOpacity
        onPress={() => {
          setCommentVisible(!commentVisible);
          autoLayoutAnimation();
        }}
      >
        {children}
      </TouchableOpacity>
    ) : (
      <>{children}</>
    );

  return (
    <View className="flex-col mb-2">
      <PressableIfNeeded>
        <View className="flex-col w-full">
          <View className="flex-row items-center">
            <View className={mergeClassNames("flex-row w-8")}>
              {record.value === true ? <CheckMarkIcon /> : <CrossIcon color={TW_COLORS.CNAM_PRIMARY_900} />}
            </View>
            <View className="flex-1 flex-row justify-between items-center">
              <View className="flex-1">
                <Text numberOfLines={1} className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-900")}>
                  {goal?.label}
                </Text>
              </View>
              {record.comment?.length ? (
                <Icon
                  icon="ArrowUpSvg"
                  color={TW_COLORS.CNAM_PRIMARY_800}
                  width={13}
                  height={13}
                  styleContainer={{
                    width: 13,
                    height: 13,
                    transform: [{ rotate: commentVisible ? "0deg" : "180deg" }],
                  }}
                />
              ) : null}
            </View>
          </View>
          {commentVisible && (
            <Text className={mergeClassNames("flex-1", typography.textXsRegular, "text-gray-700 text-left ml-8")} style={{ color: colors.BLUE }}>
              {record?.comment}
            </Text>
          )}
        </View>
      </PressableIfNeeded>
    </View>
  );
};
