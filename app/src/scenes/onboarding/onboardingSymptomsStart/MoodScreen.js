import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Switch, Image } from "react-native";
import Text from "../../../components/MyText";
import Button from "../../../components/Button";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { INDICATEURS_HUMEUR, INDICATEURS_LISTE_ONBOARDING_HUMEUR } from "../../../utils/liste_indicateurs.1";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { colors } from "../../../utils/colors";
import { stylesA, styles, styleSwitch } from ".";
import { StickyButtonContainer } from "../StickyButton";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { OnboardingBackButton } from "../BackButton";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";

export const OnboardingMood = ({ navigation }) => {
  const [isMoodTroubleEnable, setIsMoodTroubleEnabled] = useState();
  const [userIndicateurs, setUserIndicateurs] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          console.log("oui");
          setUserIndicateurs(user_indicateurs);
        } else {
          console.log("non");
          setToggleIndicateur(INDICATEURS_HUMEUR);
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
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

  useFocusEffect(
    useCallback(() => {
      if (!userIndicateurs) return;
      // cocher par défaut si on a jamais enregistré notre choix
      if (!userIndicateurs?.some((_ind) => _ind.uuid === INDICATEURS_HUMEUR.uuid))
        setToggleIndicateur(INDICATEURS_HUMEUR);

      // deplier par defaut si au moins un des enfants est selectionné
      if (
        userIndicateurs?.some(
          (_ind) => INDICATEURS_LISTE_ONBOARDING_HUMEUR.map((e) => e.uuid).includes(_ind.uuid) && _ind.active
        )
      ) {
        setIsMoodTroubleEnabled(true);
      }
    }, [userIndicateurs])
  );

  const handleNext = async () => {
    if (!isMoodTroubleEnable) {
      const _userIndicateurs = userIndicateurs?.map((_ind) => {
        if (INDICATEURS_LISTE_ONBOARDING_HUMEUR.map((e) => e.uuid).includes(_ind.uuid)) {
          _ind.active = false;
        }
        return _ind;
      });
      setUserIndicateurs(_userIndicateurs);
      await localStorage.setIndicateurs(_userIndicateurs);
    }

    navigation.navigate(ONBOARDING_STEPS.STEP_SYMPTOMS_SLEEP);
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
              source={require("../../../../assets/imgs/onboarding/mood.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <TouchableOpacity
            key="main-checkbox"
            style={[
              stylesA.choixContainer,
              userIndicateurs?.find((_ind) => _ind.uuid === INDICATEURS_HUMEUR.uuid && _ind.active)
                ? stylesA.choixContainerSelected
                : null,
            ]}
            onPress={() => setToggleIndicateur(INDICATEURS_HUMEUR)}
          >
            {userIndicateurs?.find((_ind) => _ind.uuid === INDICATEURS_HUMEUR.uuid && _ind.active) ? (
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
            <Text style={stylesA.choixLabel}>{INDICATEURS_HUMEUR.name}</Text>
          </TouchableOpacity>
          <View key="question">
            <Text style={styles.question}>
              Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?
            </Text>
          </View>
          <View style={styleSwitch.container} key="secondary-switch">
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => {
                autoLayoutAnimation();
                setIsMoodTroubleEnabled((e) => !e);
              }}
              value={isMoodTroubleEnable}
              trackColor={{ true: colors.LIGHT_BLUE }}
              thumbColor="#EFEFEF"
            />
            <Text style={styleSwitch.label}>Oui</Text>
          </View>
          {isMoodTroubleEnable ? (
            <View key="secondary-details">
              <Text style={styles.description}>
                Renseignez les variations de votre humeur au cours de la journée avec :
              </Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_HUMEUR}
                userIndicateurs={userIndicateurs}
                setToggleIndicateur={setToggleIndicateur}
              />
            </View>
          ) : null}
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
    <>
      {list.map((_indicateur) => {
        if (_indicateur === null) return <View style={{ height: 40 }} collapsable={false} />;
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
    </>
  );
};
