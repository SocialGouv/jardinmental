import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { colors } from "../../utils/colors";
import Button from "../../components/RoundButtonIcon";
import Text from "../../components/MyText";
import { displayedCategories, translateCategories } from "../../utils/constants";
import SurveyMenu from "../../../assets/svg/SurveyMenu";

const MAX_SIZE = 80;

const DiarySymptom = ({ userComment }) => {
  const [toggled, setToggled] = useState(false);
  if (!userComment || !userComment?.value) return null;

  const lines = userComment?.value?.split(/\r\n|\r|\n/);
  const textIsLong = userComment?.value.length > MAX_SIZE || lines.length >= 3;

  const getValue = (v) => {
    if (!toggled)
      return userComment?.value
        ?.substring(0, MAX_SIZE)
        ?.split(/\r\n|\r|\n/)
        ?.slice(0, 3)
        ?.join("\n")
        ?.concat(textIsLong ? "..." : "");
    else return userComment?.value;
  };

  const [categoryName] = userComment.id.split("_");

  return (
    <>
      <View key={userComment.id} style={styles.item}>
        <View>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <SurveyMenu height={20} width={20} style={[styles.image, styles.tiltUp]} />
            </View>
            <Text style={styles.label}>
              <Text style={styles.id}>{translateCategories[userComment.id] || categoryName}</Text>
              &nbsp;:&nbsp;{getValue()}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button icon="toggle" visible={textIsLong} onPress={() => setToggled((e) => !e)} isToggled={toggled} />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    marginRight: 10,
  },
  image: {
    color: colors.LIGHT_BLUE,
    marginVertical: 0,
  },
  tiltUp: {
    marginTop: -0.1 * 20,
  },
  buttonsContainer: {
    display: "flex",
    position: "absolute",
    right: 0,
    bottom: -25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    marginVertical: 10,
    backgroundColor: "rgba(38, 56, 124, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(38, 56, 124, 0.08)",
    paddingVertical: 10,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  id: {
    color: colors.LIGHT_BLUE,
    fontSize: 15,
  },
  label: {
    color: colors.DARK_BLUE,
    flex: 1,
    fontSize: 15,
  },
});

export default DiarySymptom;
