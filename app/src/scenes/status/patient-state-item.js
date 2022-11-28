import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../components/MyText";
import CircledIcon from "../../components/CircledIcon";
import { scoresMapIcon } from "../../utils/constants";
import { getScoreWithState } from "../../utils";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";

const PatientStateItem = ({ patientState, category, label }) => {
  const [{ color, borderColor, faceIcon, iconColor }, setIcon] = useState({});
  const [userCommentVisible, setUserCommentVisible] = useState(false);

  useEffect(() => {
    const score = getScoreWithState({ patientState, category });
    const icon = scoresMapIcon[score] || {};
    setIcon(icon);
  }, [patientState, category]);

  const isTouchable = () => !!patientState[category]?.userComment?.trim();

  const content = (
    <View>
      <View style={styles.container}>
        {color && faceIcon ? (
          <CircledIcon
            color={color}
            borderColor={borderColor}
            iconColor={iconColor}
            icon={faceIcon}
            iconWidth={32}
            iconHeight={32}
          />
        ) : (
          <CircledIcon
            color="#cccccc"
            borderColor="#999999"
            iconColor="#888888"
            icon="QuestionMarkSvg"
            iconWidth={32}
            iconHeight={32}
          />
        )}

        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        {isTouchable() ? (
          <Icon
            icon="ArrowUpSvg"
            color="#C7CED5"
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
        <View style={[styles.container, styles.tilt]}>
          <Text style={styles.userComment}>{patientState[category]?.userComment?.trim()}</Text>
        </View>
      ) : null}
    </View>
  );

  if (isTouchable())
    return <TouchableLayout onPress={() => setUserCommentVisible((e) => !e)}>{content}</TouchableLayout>;
  else return content;
};

const TouchableLayout = ({ children, onPress }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  arrowDown: {
    transform: [{ rotate: "90deg" }],
  },
  arrowUp: {
    transform: [{ rotate: "270deg" }],
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
    // width: 32,
    // height: 32,
  },
  tilt: {
    // small negative marginTop for narrowing the texts
    marginTop: -15,
    // align the text with the symptom label
    // container's padding : 20
    // icon's marginRight: 20
    // icon's width : 40
    paddingLeft: 80, // 20 + 20 + 40 = 80
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
  },
  userComment: {
    flex: 1,
    fontSize: 14,
    color: colors.BLUE,
    fontStyle: "italic",
  },
  labelContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
});

export default PatientStateItem;
