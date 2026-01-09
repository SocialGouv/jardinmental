import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ArrowLeftSvg from "@assets/svg/arrow-left";
import ArrowRightSvg from "@assets/svg/arrow-right";
import { colors } from "@/utils/colors";
import { months, shortMonths, isAfterToday } from "@/utils/date/helpers";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { Typography } from "@/components/Typography";

const WeekPicker = ({ onBeforePress, onAfterPress, firstDay, lastDay, setDay }) => {
  return (
    <View className="flex-row items-center justify-between py-4">
      <TouchableOpacity onPress={onBeforePress} className="w-[45] h-[45] px-4 justify-center align-left">
        <ArrowLeftSvg />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDay(new Date())} style={styles.middleContainer}>
        <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900")}>
          {firstDay.getMonth() === lastDay.getMonth() ? (
            <>
              <Typography style={styles.day}>{`${firstDay.getDate()} - ${lastDay.getDate()}  `}</Typography>
              <Typography style={styles.month}>{months[firstDay.getMonth()]}</Typography>
            </>
          ) : (
            <>
              <Typography style={styles.day}>{`${firstDay.getDate()} `}</Typography>
              <Typography style={styles.month}>{`${shortMonths[firstDay.getMonth()]} - `}</Typography>
              <Typography style={styles.day}>{`${lastDay.getDate()} `}</Typography>
              <Typography style={styles.month}>{`${shortMonths[lastDay.getMonth()]}`}</Typography>
            </>
          )}
        </Typography>
      </TouchableOpacity>
      {/* if it is in the futur, we hide and disabled the button */}
      <TouchableOpacity className="w-[45] h-[45] justify-center px-4 align-right" onPress={(e) => !isAfterToday(lastDay) && onAfterPress(e)}>
        <ArrowRightSvg color={isAfterToday(lastDay) ? "transparent" : colors.LIGHT_BLUE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    color: colors.DARK_BLUE,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "400",
  },
  day: {
    fontWeight: "600",
  },
  month: {
    textTransform: "lowercase",
    fontStyle: "italic",
  },
  middleContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 45,
    height: 45,
    justifyContent: "center",
  },
});

export default WeekPicker;
