import React from "react";
import { TouchableOpacity, StyleSheet, View, Pressable } from "react-native";
import Text from "../../components/MyText";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import { InputCheckbox } from "../../components/InputCheckbox";
import { Indicator } from "@/entities/Indicator";

const CategorieElements = ({
  title,
  options,
  onClick,
  userIndicateurs,
}: {
  title: string;
  options: any[];
  onClick: (option: any) => void;
  userIndicateurs: Indicator[];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <TouchableOpacity style={styles.categorieContainer} onPress={() => setIsOpen((e) => !e)}>
        <Text style={styles.categorieTitre}>{title}</Text>
        <View>
          <RoundButtonIcon icon="toggle" visible onPress={() => setIsOpen((e) => !e)} isToggled={isOpen} medium />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.listeContainer}>
          {(options || [])
            .filter((e) => !e.active)
            .map((option) => {
              const indicateurSelectionne = userIndicateurs.find(
                (_ind) => (_ind.uuid === option.uuid || _ind.genericUuid === option.uuid || _ind.baseIndicatorUuid === option.uuid) && _ind.active
              );
              return (
                <View
                  key={`${option.uuid}`}
                  style={[
                    styles.container,
                    {
                      backgroundColor: indicateurSelectionne ? "#F4FCFD" : "#F8F9FB",
                      borderColor: indicateurSelectionne ? "#DEF4F5" : "#E7EAF1",
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => {
                      console.log("✍️  option", option);
                      onClick(option);
                    }}
                    hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                  >
                    <View style={[styles.contentContainer]} pointerEvents="none">
                      <InputCheckbox label={option.name} checked={indicateurSelectionne} />
                    </View>
                  </Pressable>
                </View>
              );
            })}
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
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
