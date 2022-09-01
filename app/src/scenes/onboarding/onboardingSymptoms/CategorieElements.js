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
  const [isOpen, setIsOpen] = React.useState(false);
  const [listeComplementaire, setListeComplementaire] = React.useState([]);
  return (
    <>
      <TouchableOpacity style={stylesA.categorieContainer} onPress={() => setIsOpen((e) => !e)}>
        <Text style={stylesA.categorieTitre}>{title}</Text>
        <View>
          <RoundButtonIcon
            icon="toggle"
            visible
            onPress={() => setIsOpen((e) => !e)}
            isToggled={isOpen}
            medium
          />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={stylesA.listeContainer}>
          {(options || []).concat(listeComplementaire).map((option) => {
            const indicateurSelectionne = indicateursSelection[option.id];
            return (
              <TouchableOpacity
                key={`${title}_${option.id}`}
                style={[
                  stylesA.choixContainer,
                  indicateurSelectionne ? stylesA.choixContainerSelected : null,
                ]}
                onPress={() => onClick({ id: option.id, value: !indicateurSelectionne })}
              >
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
                <Text style={stylesA.choixLabel}>{option.label}</Text>
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
      ) : null}
    </>
  );
};

const stylesA = StyleSheet.create({
  categorieContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44, // standard
  },
  categorieTitre: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
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
    marginBottom: 44,
  },
  choixLabel: {
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
});

export default CategorieElements;
