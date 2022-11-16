import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from "react-native";

import BackButton from "../../components/BackButton";
import { colors } from "../../utils/colors";
import SurveyMenu from "../../../assets/svg/SurveyMenu";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import TextTag from "../../components/TextTag";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import AjoutIndicateurPerso from "./AjoutIndicateurPerso";
import CategorieElements from "./CategorieElements";
import { INDICATEURS, INDICATEURS_LES_PLUS_COURANTS } from "../../utils/liste_indicateurs.1";
import { useFocusEffect } from "@react-navigation/native";

const Indicateurs = ({ navigation }) => {
  const [chosenCategories, setChosenCategories] = useState();
  const [userIndicateurs, setUserIndicateurs] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        // console.log("✍️ ~ user_indicateurs", JSON.stringify(user_indicateurs, null, 2));
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  const reactivateIndicateur = async (_indicateur) => {
    const _userIndicateurs = userIndicateurs.map((indicateur) => {
      if (indicateur.uuid === _indicateur.uuid) {
        indicateur.active = true;
      }
      return indicateur;
    });
    setUserIndicateurs(_userIndicateurs);
    await localStorage.setIndicateurs(_userIndicateurs);
  };

  const removeIndicateur = async (_indicateur) => {
    const _userIndicateurs = userIndicateurs.map((indicateur) => {
      if (indicateur.uuid === _indicateur.uuid) {
        indicateur.active = false;
      }
      return indicateur;
    });
    setUserIndicateurs(_userIndicateurs);
    await localStorage.setIndicateurs(_userIndicateurs);
  };

  const handleAddNewIndicateur = async (_indicateur) => {
    if (!_indicateur) return;
    const _userIndicateurs = [...userIndicateurs, _indicateur];
    setUserIndicateurs(_userIndicateurs);
    await localStorage.setIndicateurs(_userIndicateurs);
    logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = async (_indicateur) => {
    if (userIndicateurs.find((e) => e.uuid === _indicateur.uuid)) {
      const _userIndicateurs = userIndicateurs.map((indicateur) => {
        if (indicateur.uuid === _indicateur.uuid) {
          indicateur.active = !indicateur.active;
        }
        return indicateur;
      });
      setUserIndicateurs(_userIndicateurs);
      await localStorage.setIndicateurs(_userIndicateurs);
    } else {
      handleAddNewIndicateur({ ..._indicateur, active: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.titleContainer}>
          <SurveyMenu style={styles.image} width={30} height={30} />
          <Text style={styles.title}>
            <Text style={styles.bold}>Personnalisez votre questionnaire</Text> en ajoutant vos{" "}
            <Text style={styles.bold}>propres indicateurs</Text>
          </Text>
        </View>
        <Text style={styles.subtitle}>Vous suivez actuellement :</Text>
        <View style={styles.listContainer}>
          {userIndicateurs
            .filter((_indicateur) => _indicateur.active)
            .map((_indicateur, i) => {
              return (
                <TextTag
                  key={i}
                  value={_indicateur.name}
                  selected={false}
                  color="#D4F0F2"
                  onPress={() => {}}
                  enableClosed
                  onClose={() => removeIndicateur(_indicateur)}
                />
              );
            })}
        </View>
        <AjoutIndicateurPerso
          onChange={(v) => {
            if (Object.keys(chosenCategories || {}).find((e) => e === v)) return;
            handleAddNewIndicateur(v);
          }}
        />

        <View className="h-[1px] w-full bg-gray-200" />
        <>
          <Exemples setToggleIndicateur={setToggleIndicateur} userIndicateurs={userIndicateurs} />
          <View className="h-[1px] w-full bg-gray-200" />
          <OldCriteria userIndicateurs={userIndicateurs} reactivateIndicateur={reactivateIndicateur} />
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

const OldCriteria = ({ userIndicateurs, reactivateIndicateur }) => {
  const [showOldCriteria, setShowOldCriteria] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.flexRow} onPress={() => setShowOldCriteria((prev) => !prev)}>
        <Text style={[styles.subtitle, styles.underline]}>Réactiver vos anciens indicateurs</Text>
        {showOldCriteria ? (
          <Icon icon="ChevronUpSvg" width={20} height={20} color={colors.BLUE} />
        ) : (
          <Icon icon="ChevronDownSvg" width={20} height={20} color={colors.BLUE} />
        )}
      </TouchableOpacity>
      {showOldCriteria && (
        <View style={styles.listContainer}>
          {userIndicateurs
            .filter((_indicateur) => !_indicateur.active)
            .map((_indicateur, i) => {
              return (
                <TextTag
                  key={i}
                  value={_indicateur.name}
                  selected={false}
                  color="#D4F0F2"
                  onPress={() => reactivateIndicateur(_indicateur)}
                  enableAdd
                  onAdd={() => reactivateIndicateur(_indicateur)}
                />
              );
            })}
        </View>
      )}
    </View>
  );
};

const Exemples = ({ setToggleIndicateur, userIndicateurs }) => {
  const [open, setOpen] = useState(false);

  const indicateursByCategory = INDICATEURS.reduce((prev, curr) => {
    if (!prev[curr.category]) {
      prev[curr.category] = [];
    }
    prev[curr.category].push(curr);
    return prev;
  }, {});

  return (
    <View>
      <TouchableOpacity style={styles.flexRow} onPress={() => setOpen((prev) => !prev)}>
        <Text style={[styles.subtitle, styles.underline]}>Choisir parmi des exemples</Text>
        {open ? (
          <Icon icon="ChevronUpSvg" width={20} height={20} color={colors.BLUE} />
        ) : (
          <Icon icon="ChevronDownSvg" width={20} height={20} color={colors.BLUE} />
        )}
      </TouchableOpacity>
      {open && (
        <>
          <CategorieElements
            title="Les plus courants"
            options={INDICATEURS_LES_PLUS_COURANTS}
            onClick={(value) => setToggleIndicateur(value)}
            userIndicateurs={userIndicateurs}
          />
          {Object.keys(indicateursByCategory).map((_category) => {
            const _indicateurs = indicateursByCategory[_category];
            return (
              <CategorieElements
                key={_category}
                title={_category}
                options={_indicateurs}
                onClick={(value) => setToggleIndicateur(value)}
                userIndicateurs={userIndicateurs}
              />
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  titleContainer: {
    marginBottom: 13,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center",
  },
  bold: {
    color: colors.BLUE,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 18,
    marginVertical: 30,
    fontWeight: "400",
    textAlign: "center",
  },
  underline: {
    textDecorationLine: "underline",
  },
  listContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  h3: {
    color: "#181818",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "300",
    textAlign: "center",
  },
  spaceabove: {
    marginTop: 15,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Indicateurs;
