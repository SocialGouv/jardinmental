import React from "react";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import { View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { stylesA } from "./onboardingSymptomsStart";
import { TW_COLORS } from "@/utils/constants";

export const CheckBoxList = ({ list, symptomSelection, setSymptomSelection }) => {
  return (
    <>
      {list.map((id, index) => {
        if (id === null) return <View key={index} style={{ height: 40 }} collapsable={false} />;
        return (
          <TouchableOpacity
            key={index}
            style={[stylesA.choixContainer, symptomSelection[id] ? stylesA.choixContainerSelected : null]}
            onPress={() =>
              setSymptomSelection((prev) => ({
                ...prev,
                [id]: !prev[id],
              }))
            }
          >
            {symptomSelection[id] ? (
              <View>
                <RoundButtonIcon
                  backgroundColor={TW_COLORS.SUCCESS}
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor={TW_COLORS.SUCCESS}
                  icon="validate"
                  visible={true}
                  medium
                />
              </View>
            ) : (
              <View>
                <RoundButtonIcon
                  backgroundColor="#f4f4f4"
                  iconColor="#e1e1e1"
                  borderWidth={0.5}
                  borderColor="#e1e1e1"
                  icon="validate"
                  visible={true}
                  medium
                />
              </View>
            )}
            <Text style={stylesA.choixLabel}>{id}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};
