import React from "react";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import { View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { stylesA } from "./onboardingSymptomsStart";

export const CheckBoxList = ({ list, symptomSelection, setSymptomSelection }) => {
  return (
    <>
      {list.map((id) => {
        if (id === null) return <View style={{ height: 40 }} collapsable={false} />;
        return (
          <TouchableOpacity
            key={id}
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
                  backgroundColor="#5DEE5A"
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor="#5DEE5A"
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
