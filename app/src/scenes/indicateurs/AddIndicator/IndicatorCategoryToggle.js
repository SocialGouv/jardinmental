import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../utils/colors";
import { TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import ArrowUpSvg from "../../../../assets/svg/arrow-up.svg";
import CheckBox from "@react-native-community/checkbox";
import { INDICATEURS_LISTE_PAR_CATEGORIE } from "../../../utils/liste_indicateurs";

const IndicatorCategoryToggle = ({
  currentExempleVisible,
  toggleCurrentExempleVisible,
  exempleName,
  chosenCategories,
  setToogleCheckbox,
}) => {
  return (
    <View style={styles.exempleContainer}>
      <TouchableOpacity onPress={() => toggleCurrentExempleVisible(exempleName)} style={styles.touchable}>
        <Text style={styles.bold}>{exempleName}</Text>
        {currentExempleVisible === exempleName ? (
          <ArrowUpSvg color={colors.BLUE} />
        ) : (
          <ArrowUpSvg
            style={{
              transform: [{ rotateX: "180deg" }],
            }}
            color={colors.BLUE}
          />
        )}
      </TouchableOpacity>
      {currentExempleVisible === exempleName && (
        <>
          {INDICATEURS_LISTE_PAR_CATEGORIE[exempleName].map((indicatorName) => (
            <View key={indicatorName} style={styles.categories}>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={chosenCategories[indicatorName]}
                onValueChange={(newValue) => setToogleCheckbox(indicatorName, newValue)}
                // for android
                tintColors={{ true: colors.LIGHT_BLUE, false: "#aaa" }}
                // for ios
                tintColor="#aaa"
                onCheckColor={colors.LIGHT_BLUE}
                onTintColor={colors.LIGHT_BLUE}
                onAnimationType="bounce"
                offAnimationType="bounce"
              />
              <Text style={styles.label}>{indicatorName}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
  exempleContainer: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    padding: 20,
    paddingBottom: 0,
    paddingLeft: 0,
    marginBottom: 12,
  },
  touchable: {
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  checkbox: {
    margin: 10,
    width: 25,
    height: 25,
  },
  categories: {
    paddingLeft: 5,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 17,
  },
});

export default IndicatorCategoryToggle;
