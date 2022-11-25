import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "../../../components/Icon";
import Separator from "../../../components/Separator";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";

export const GoalsStatus = ({ goalsData, date, withSeparator }) => {
  const recordIds = goalsData?.records?.byDate?.[date] || [];
  const records = recordIds
    .map((id) => goalsData?.records?.data?.[id])
    .sort(
      (a, b) =>
        goalsData?.goals?.byOrder?.indexOf?.(a?.goalId) - goalsData?.goals?.byOrder?.indexOf?.(b?.goalId)
    );
  return (
    <>
      {withSeparator && <Separator style={{ paddingHorizontal: 40 }} />}
      <View style={styles.container}>
        {records.map((record, index) => (
          <GoalStatusItem goalsData={goalsData} record={record} />
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
    <View style={styles.itemContainer}>
      <PressableIfNeeded>
        <View style={styles.itemContentContainer}>
          <View style={styles.itemTopContentContainer}>
            <View
              style={[
                styles.iconContainer,
                record.value === true
                  ? {
                      backgroundColor: "#5DEE5A",
                      borderColor: "#1A6300",
                    }
                  : {
                      backgroundColor: "#F16B6B",
                      borderColor: "#5E000",
                    },
              ]}
            >
              <Icon
                icon="CheckSvg"
                color={record.value === true ? "#1A6300" : "#5E0000"}
                width={20}
                height={20}
              />
            </View>
            <Text style={[styles.label]}>{goal?.label}</Text>
            {record.comment?.length && (
              <Icon
                icon="ArrowUpSvg"
                color="#C7CED5"
                width={13}
                height={13}
                styleContainer={{
                  width: 13,
                  height: 13,
                  transform: [{ rotate: commentVisible ? "0deg" : "180deg" }],
                }}
              />
            )}
          </View>
          {commentVisible && <Text style={styles.comment}>{record?.comment}</Text>}
        </View>
      </PressableIfNeeded>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
  },
  itemContainer: {
    flex: 1,
  },
  itemContentContainer: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  itemTopContentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 26,
    borderWidth: 1,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: "#000000",
    flex: 1,
  },
  comment: {
    flex: 1,
    fontSize: 14,
    color: "#26387C",
    fontStyle: "italic",
    marginLeft: 60,
    marginRight: 13,
    marginTop: -8,
  },
});
