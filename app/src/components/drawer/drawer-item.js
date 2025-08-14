import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";

export default ({ title, navigation, path = "tabs", icon, color = colors.LIGHT_BLUE, onClick, badge = false }) => {
  const handleClick = () => {
    onClick();
    navigation && navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.container}>
        <View style={styles.answer}>
          {icon ? (
            <View
              className={`ml-2  rounded-full p-2 border w-8 h-8 items-center justify-center`}
              style={{
                borderColor: color,
              }}
            >
              {React.cloneElement(icon, {
                color: color,
                width: 16,
                height: 16,
              })}
            </View>
          ) : (
            <View style={{ marginHorizontal: 30 }} />
          )}
          <Text style={styles.label} className="ml-4">
            {title}
          </Text>
          <View style={styles.button}>
            <ArrowRightSvg color={colors.LIGHT_BLUE} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.BLUE,
    flex: 1,
  },
  answer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
