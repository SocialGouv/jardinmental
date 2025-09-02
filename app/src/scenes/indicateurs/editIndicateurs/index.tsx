import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from "react-native";

import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import Plus from "../../../../assets/svg/Plus";
import ArrowUpSvg from "../../../../assets/svg/arrow-up.svg";
import { INDICATORS, INDICATEURS_LES_PLUS_COURANTS } from "../../../utils/liste_indicateurs.1";
import { toggleState } from "../../../utils";
import DangerIcon from "../../../../assets/svg/DangerIcon";
import CategorieElements from "../CategorieElements";
import { useFocusEffect } from "@react-navigation/native";
import logEvents from "../../../services/logEvents";
import TextTag from "../../../components/TextTag";
import JMButton from "@/components/JMButton";
import { INDICATOR_CATEGORIES_DATA } from "@/scenes/onboarding-v2/data/helperData";
import { generateIndicatorFromPredefinedIndicator, Indicator, PredefineIndicatorV2SchemaType } from "@/entities/Indicator";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { TW_COLORS } from "@/utils/constants";
import { areStringArraysIdentical } from "@/utils/string-util";

const EditIndicateurs = ({ navigation, route }) => {
  const [exemplesVisible, setExemplesVisible] = useState(false);
  const [existingIndicatorsVisible, setExistingIndicatorsVisible] = useState(false);
  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const indicateursByCategory = INDICATORS.reduce((prev, curr) => {
    for (const category of curr.categories) {
      if (!prev[category]) {
        prev[category] = [];
      }
      prev[category].push(curr);
    }
    return prev;
  }, {});
  // Sort each category group
  for (const category in indicateursByCategory) {
    indicateursByCategory[category].sort((a, b) => {
      if (a.isGeneric !== b.isGeneric) {
        return a.isGeneric ? -1 : 1;
      }
      return a.priority - b.priority;
    });
  }

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

  useEffect(() => {
    const handleIndicatorsChange = async () => {
      const savedUserIndicators = await localStorage.getIndicateurs();
      const savedActiveIndicators = savedUserIndicators.filter((i) => i.active).map((i) => i.uuid);
      const modifiedIndicators = userIndicateurs.filter((i) => i.active).map((i) => i.uuid);
      if (areStringArraysIdentical(savedActiveIndicators, modifiedIndicators)) {
        setIsChanged(false);
      } else {
        setIsChanged(true);
      }
    };
    handleIndicatorsChange();
    return;
  }, [userIndicateurs]);

  const onValidate = async () => {
    setIsLoading(true);
    await localStorage.setIndicateurs(userIndicateurs);
    setIsLoading(false);
    navigation.goBack();
  };

  const reactivateIndicateur = async (_indicateur) => {
    const _userIndicateurs = userIndicateurs.map((indicateur) => {
      if (indicateur.uuid === _indicateur.uuid) {
        indicateur.active = true;
      }
      return indicateur;
    });
    setUserIndicateurs(_userIndicateurs);
  };

  const handleAddNewIndicateur = async (_indicateur: Indicator) => {
    if (!_indicateur) return;
    const _userIndicateurs = [...userIndicateurs, _indicateur];
    setUserIndicateurs(_userIndicateurs);
    logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = async (_indicateur: PredefineIndicatorV2SchemaType) => {
    if (userIndicateurs.find((e) => e.uuid === _indicateur.uuid || e.baseIndicatorUuid === _indicateur.uuid)) {
      const _userIndicateurs = userIndicateurs.map((indicateur) => {
        if (indicateur.uuid === _indicateur.uuid || indicateur.baseIndicatorUuid === _indicateur.uuid) {
          indicateur.active = !indicateur.active;
        }
        return indicateur;
      });
      setUserIndicateurs(_userIndicateurs);
    } else {
      handleAddNewIndicateur(generateIndicatorFromPredefinedIndicator(_indicateur));
    }
  };

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={() => {
        navigation.goBack();
      }}
      title="Ajouter un indicateur"
      navigation={navigation}
      headerRightComponent={null}
      headerRightAction={() => {}}
      smallHeader={true}
      scrollViewBackground="#F7FCFD"
      bottomComponent={
        <NavigationButtons absolute={true}>
          <>
            <JMButton disabled={!isChanged} onPress={onValidate} loading={isLoading} title="Enregistrer" />
          </>
        </NavigationButtons>
      }
    >
      <View className="px-4 py-4">
        <View className="bg-cnam-cyan-50-lighten-90 bg-[#E5F6FC] p-4 rounded-2xl">
          <View className="flex-row items-center mb-4">
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 ml-2")}>Créer un indicateur personnalisé</Text>
          </View>
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
            Vous pouvez choisir la manière dont vous souhaitez l’évaluer
          </Text>
          <JMButton
            variant="outline"
            onPress={() => {
              navigation.push("CREATE_INDICATOR");
            }}
            className="mt-10"
            title="Créer un indicateur"
            icon={<Plus style={styles.plusButton} opacity={1} color={"#000"} width={19} height={19} />}
          />
        </View>

        {exemplesVisible && (
          <View style={styles.warningContainer}>
            <DangerIcon />
            <Text style={styles.warningText}>
              Essayez de ne pas sélectionner plus de <Text style={[styles.bold, styles.warningText]}>8</Text> indicateurs{" "}
              <Text style={[styles.bold, styles.warningText]}>au total</Text>
            </Text>
          </View>
        )}

        <View
          style={{
            height: 40,
          }}
        />
        <TouchableOpacity className="flex-row justify-between flex-1 items-center" onPress={() => toggleState(exemplesVisible, setExemplesVisible)}>
          <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-900")}>Choisir parmi des exemples</Text>
          {exemplesVisible ? (
            <ArrowUpSvg color={TW_COLORS.CNAM_PRIMARY_900} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{ rotateX: "180deg" }],
              }}
              color={TW_COLORS.CNAM_PRIMARY_900}
            />
          )}
        </TouchableOpacity>
        {exemplesVisible && (
          <View className="mt-4">
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
                  category={indicateursByCategory[_category][0].mainCategory}
                  title={INDICATOR_CATEGORIES_DATA[_category].name}
                  options={_indicateurs}
                  onClick={(value) => setToggleIndicateur(value)}
                  userIndicateurs={userIndicateurs}
                />
              );
            })}
          </View>
        )}
        <View
          style={{
            height: 15,
          }}
        />
        <View className="h-[1px] bg-cnam-primary-900 w-full mb-4 mt-2" />
        <TouchableOpacity
          onPress={() => toggleState(existingIndicatorsVisible, setExistingIndicatorsVisible)}
          className="flex-row justify-between flex-1 items-center"
        >
          <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-900")}>Réactiver un ancien indicateur</Text>
          {existingIndicatorsVisible ? (
            <ArrowUpSvg color={TW_COLORS.CNAM_PRIMARY_900} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{ rotateX: "180deg" }],
              }}
              color={TW_COLORS.CNAM_PRIMARY_900}
            />
          )}
        </TouchableOpacity>
        {existingIndicatorsVisible && (
          <>
            <View
              style={{
                height: 10,
              }}
            />
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
          </>
        )}

        <View
          style={{
            height: 15,
          }}
        />
        <View style={styles.divider} />
        <View
          style={{
            height: 50,
          }}
        />
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  headerText: {
    color: colors.BLUE,
    fontSize: 19,
    fontWeight: "700",
  },
  header: {
    height: 60,
  },
  headerBackButton: {
    position: "absolute",
    zIndex: 1,
  },
  headerTextContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personnalizeContainer: {
    backgroundColor: "rgba(31,198,213,0.2)",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
  },
  personnalizeTextContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  personnalizeTitle: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    marginBottom: 5,
  },
  personnalizeText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },
  plusButton: {
    marginRight: 10,
  },

  warningContainer: {
    backgroundColor: "rgba(254,170,90,0.1)",
    borderColor: "#FEAA5B",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
    marginTop: 20,
  },
  warningText: {
    color: colors.BLUE,
    fontSize: 17,
    flex: 1,
    marginLeft: 20,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingEnd: 5,
    paddingBottom: 15,
    paddingTop: 15,
  },
  bottomButtonsContainer: {
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default EditIndicateurs;
