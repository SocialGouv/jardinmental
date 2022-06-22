import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import AjoutIndicateurPerso from "./AjoutIndicateurPerso";

const CategorieElements = ({
  title,
  options,
  onClick,
  indicateursSelection,
  handleAddNewSymptom,
  enableAddNewElement,
}) => {
  const [listeComplementaire, setListeComplementaire] = React.useState([]);
  return (
    <>
      <View style={stylesA.listeContainer}>
        {(options || []).concat(listeComplementaire).map((option) => {
          const indicateurSelectionne = indicateursSelection[option.id];
          return (
            <TouchableOpacity
              key={`${title}_${option.id}`}
              style={[stylesA.choixContainer, indicateurSelectionne ? stylesA.choixContainerSelected : null]}
              onPress={() => onClick({ id: option.id, value: !indicateurSelectionne })}
            >
              <Text style={stylesA.choixLabel}>{option.label}</Text>
              {indicateurSelectionne ? (
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
            </TouchableOpacity>
          );
        })}
        {enableAddNewElement ? (
          <AjoutIndicateurPerso
            onChange={(v) => {
              if (Object.keys(indicateursSelection).find((e) => e === v)) return;
              setListeComplementaire((prev) => [...prev, { id: v, label: v }]);
              handleAddNewSymptom(v);
            }}
          />
        ) : null}
      </View>
    </>
  );
};

const stylesA = StyleSheet.create({
  choixContainer: {
    backgroundColor: "#fff",
    borderColor: "#dadada",
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44, // standard
  },
  choixContainerSelected: {
    backgroundColor: "#EFFDEF",
  },
  listeContainer: {
    marginBottom: 10,
  },
  choixLabel: {
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
});

export default CategorieElements;
