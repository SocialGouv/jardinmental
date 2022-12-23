import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import Text from "../../../components/MyText";
import Button from "../../../components/Button";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE } from "../../../utils/liste_indicateurs.1";
import { StickyButtonContainer } from "../StickyButton";
import { OnboardingBackButton } from "../BackButton";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { ONBOARDING_STEPS } from "../../../utils/constants";

export const OnboardingSimpleCustomSymptoms = ({ navigation }) => {
  const [userIndicateurs, setUserIndicateurs] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM);
    })();
  }, []);

  const handleAddNewIndicateur = async (_indicateur) => {
    if (!_indicateur) return;
    const _userIndicateurs = [...(userIndicateurs || []), _indicateur];
    setUserIndicateurs(_userIndicateurs);
    await localStorage.setIndicateurs(_userIndicateurs);
    // logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = async (_indicateur) => {
    if ((userIndicateurs || [])?.find((e) => e.uuid === _indicateur.uuid)) {
      const _userIndicateurs = userIndicateurs?.map((indicateur) => {
        if (indicateur.uuid === _indicateur.uuid) {
          indicateur.active = !indicateur.active;
        }
        return indicateur;
      });
      setUserIndicateurs(_userIndicateurs);
      await localStorage.setIndicateurs(_userIndicateurs);
    } else {
      handleAddNewIndicateur({ ..._indicateur, version: 1, active: true });
    }
  };

  const handleNext = async () => {
    navigation.navigate(ONBOARDING_STEPS.STEP_GOALS);
  };

  return (
    <SafeAreaViewWithOptionalHeader style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <OnboardingBackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={onboardingStyles.scroll}
        contentContainerStyle={onboardingStyles.scrollContentContainer}
      >
        <View style={onboardingStyles.container}>
          <View style={onboardingStyles.containerTopTitle} key="title">
            <Text style={onboardingStyles.h1}>Que souhaitez-vous suivre ?</Text>
          </View>
          <View style={onboardingStyles.imageContainer} key="image">
            <Image
              source={require("../../../../assets/imgs/onboarding/custom-symptoms.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={onboardingStyles.h3}>Vous sentez-vous concerné(e) par :</Text>
          </View>
          {INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE.map((group) => (
            <CheckBoxList
              list={group}
              userIndicateurs={userIndicateurs}
              setToggleIndicateur={setToggleIndicateur}
            />
          ))}
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button title="Suivant" onPress={handleNext} buttonStyle={{ minWidth: 0 }} />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};

const CheckBoxList = ({ list, userIndicateurs, setToggleIndicateur }) => {
  return (
    <View className="mb-10">
      {list.map((_indicateur) => {
        const isActive = userIndicateurs?.find((_ind) => _ind.uuid === _indicateur.uuid && _ind.active);
        return (
          <TouchableOpacity
            key={_indicateur.uuid}
            style={[stylesA.choixContainer, isActive ? stylesA.choixContainerSelected : null]}
            onPress={() => setToggleIndicateur(_indicateur)}
          >
            {isActive ? (
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
            <Text style={stylesA.choixLabel}>{_indicateur.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const stylesA = StyleSheet.create({
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
    marginLeft: 6,
  },
});
