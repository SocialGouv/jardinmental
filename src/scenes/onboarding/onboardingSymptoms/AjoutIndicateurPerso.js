import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput, Keyboard, Platform } from "react-native";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import Text from "../../../components/MyText";
import Plus from "../../../../assets/svg/Plus";

const AjoutIndicateurPerso = ({
  onChange = console.log,
  placeholder = "Ajouter...",
  styleContainer,
  onChangeText = () => {},
}) => {
  const [value, setValue] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <View style={[styles.container, styleContainer]}>
      {!isOpen ? (
        <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
          <View style={styles.buttonPlusContainer}>
            <Plus opacity={1} color="white" width={19} height={19} />
          </View>
          <Text style={styles.textAjouter}>Ajouter un élément personnalisé à la liste</Text>
        </TouchableOpacity>
      ) : null}
      {isOpen ? (
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              multiline={false}
              onChangeText={(e) => {
                setValue(e);
                onChangeText(e);
              }}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={colors.LIGHT_GRAY}
              style={styles.text}
            />
          </View>
          <Button
            title="Valider"
            buttonStyle={{ minWidth: 0 }}
            onPress={() => {
              onChange(value);
              setValue("");
              onChangeText("");
              Keyboard.dismiss();
              setIsOpen(false);
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonPlusContainer: {
    marginRight: 10,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1FC6D5",
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#0A215C",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  textAjouter: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    flex: 1,
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
    marginBottom: 5,
  },
  container: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    textAlign: "left",
    color: colors.DARK_BLUE,
    flex: 1,
  },
});

export default AjoutIndicateurPerso;
