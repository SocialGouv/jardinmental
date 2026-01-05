import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";

import { colors } from "../../utils/colors";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import { ONBOARDING_STEPS, TW_COLORS, categories, displayedCategories, reliquatCategories } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Indicator } from "@/entities/Indicator";
import { INDICATEURS } from "@/utils/liste_indicateurs.1";
import ChevronIcon from "@assets/svg/icon/chevron";
import ReorderableList, { reorderItems, useReorderableDrag } from "react-native-reorderable-list";
import { Gesture } from "react-native-gesture-handler";
import ParagraphSpacing from "@assets/svg/icon/ParagraphSpacing";
import TrashIcon from "@assets/svg/icon/Trash";
import CrossIcon from "@assets/svg/icon/Cross";
import { IndicatorEditProvider, useIndicatorEdit } from "@/context/IndicatorEditContext";

const CustomSymptomScreenContent = ({ navigation, route, settings = false }) => {
  const [chosenCategories, setChosenCategories] = React.useState();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = React.useState<boolean>(false);
  const bannerTimeout = useRef<number | undefined>(undefined);

  const { userIndicateurs, setUserIndicateurs, isLoading, setIsLoading, saveIndicators, resetIndicators } = useIndicatorEdit();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (route.params?.backFromAddingIndicator) {
          setShowSuccessBanner(true);
        }
      })();
    }, [route.params])
  );

  useEffect(() => {
    (async () => {
      !settings && (await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM));
    })();
  }, [settings]);

  useEffect(() => {
    if (!chosenCategories || chosenCategories === undefined) return;
    (async () => {
      const isCustom = (e) => !displayedCategories[e] && !Object.keys(INDICATEURS).includes(e);
      const isDefault = (e) => !!displayedCategories[e] || Object.keys(INDICATEURS).includes(e);

      const customSymptomsKeys = Object.keys(chosenCategories).filter(isCustom);
      const defaultSymptomsKeys = Object.keys(chosenCategories).filter(isDefault);

      let customSymptoms = {};
      customSymptomsKeys.forEach((e) => (customSymptoms[e] = chosenCategories[e]));
      await localStorage.setCustomSymptoms(customSymptomsKeys);

      let defaultSymptoms = {};
      defaultSymptomsKeys.forEach((e) => (defaultSymptoms[e] = chosenCategories[e]));
      await localStorage.setSymptoms(chosenCategories);
    })();
  }, [chosenCategories]);

  const data = React.useMemo(() => userIndicateurs.filter((indicator) => indicator.active), [userIndicateurs]);

  const onValidate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await saveIndicators();
    setIsLoading(false);
    setShowSuccessBanner(true);
    if (bannerTimeout.current !== undefined) clearTimeout(bannerTimeout.current);
    bannerTimeout.current = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 10000) as unknown as number;
    // navigation.goBack();
  };

  const renderItem = useCallback(
    ({ item: indicator }) => {
      return <IndicatorItem indicator={indicator} setUserIndicateurs={setUserIndicateurs} />;
    },
    [setUserIndicateurs]
  );

  const keyExtractor = useCallback((indicator: Indicator) => indicator.uuid || indicator.name, []);

  const panGesture = React.useMemo(() => Gesture.Pan().activateAfterLongPress(220), []);

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={async () => {
        navigation.goBack();
      }}
      title=""
      smallHeader={true}
      navigation={navigation}
      headerLeftComponent={
        <TouchableOpacity
          onPress={async () => {
            if (isEditing) {
              Alert.alert("Annuler les modifications ?", "Les modifications que vous avez faites ne seront pas enregistrées.", [
                {
                  text: "Continuer",
                  style: "cancel",
                  onPress: async () => {
                    await resetIndicators();
                    navigation.goBack();
                  },
                },
                {
                  text: "Annuler",
                  style: "destructive",
                  onPress: () => {},
                },
              ]);
            } else {
              navigation.goBack();
            }
          }}
          className="flex-row space-x-2 items-center justify-center"
        >
          <ChevronIcon direction="left" color={TW_COLORS.CNAM_PRIMARY_25} />
          <Text className="text-cnam-primary-25">Mes indicateurs</Text>
        </TouchableOpacity>
      }
      headerRightComponent={null}
      headerRightAction={() => {}}
      bottomComponent={
        <>
          <NavigationButtons absolute={true}>
            <>
              {isEditing && (
                <>
                  <JMButton
                    variant="outline"
                    className="mb-2"
                    size="medium"
                    onPress={() => {
                      logEvents.logStartAddIndicator();
                      navigation.navigate("EDIT_INDICATOR");
                    }}
                    title="Ajouter un indicateur"
                  />
                  <JMButton
                    variant="primary"
                    onPress={() => {
                      onValidate();
                      setIsEditing(false);
                    }}
                    title="Enregistrer les modifications"
                  />
                </>
              )}
              {!isEditing && (
                <JMButton
                  variant="primary"
                  onPress={() => {
                    logEvents.logEditSurvey();
                    setIsEditing(true);
                  }}
                  title="Modifier mon questionnaire"
                />
              )}
            </>
          </NavigationButtons>
          {showSuccessBanner && (
            <View className="abolute left-0 right-0 -bottom-10 px-8 bg-cnam-cyan-700-darken-40">
              <View className="flex-row items-center justify-between w-full h-20">
                <Text
                  style={{
                    color: "#F7FCFE",
                  }}
                  className={typography.textMdSemibold}
                >
                  Votre suivi a été modifié avec succès
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowSuccessBanner(false);
                    if (bannerTimeout.current !== undefined) clearTimeout(bannerTimeout.current);
                  }}
                >
                  <CrossIcon color={"#F7FCFE"} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      }
    >
      <View className="px-4">
        <View className="flex-column mb-6">
          <View className="flex-row items-center">
            <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>Mes indicateurs</Text>
            <View className="bg-cnam-cyan-500-0 h-7 w-7 rounded-full items-center justify-center ml-2">
              <Text className={mergeClassNames("text-cnam-primary-900", typography.textMdSemibold)}>
                {userIndicateurs.filter((_indicateur) => _indicateur.active).length}
              </Text>
            </View>
          </View>
          {!isEditing && (
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 mt-3")}>
              Gérez vos éléments de suivi, ajoutez-en de nouveaux et choisissez la manière dont vous les évaluez
            </Text>
          )}
          {isEditing && (
            <View className="bg-cnam-cyan-50-lighten-90 py-4 px-4 rounded-2xl mt-3">
              <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>Modifier mon suivi quotidien </Text>
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 mt-3")}>
                Vous pouvez changer l’ordre d’apparition de vos indicateurs, en ajouter de nouveaux et/ou les supprimer.
              </Text>
            </View>
          )}
        </View>
        {!isEditing && (
          <View>
            {userIndicateurs
              .filter((_indicateur) => _indicateur.active)
              .map((_indicateur) => {
                return (
                  <View key={_indicateur.uuid || _indicateur.name} className="p-4 bg-gray-100 mb-2 rounded-xl">
                    <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>{_indicateur.name}</Text>
                  </View>
                );
              })}
          </View>
        )}
        {isEditing && (
          <ReorderableList
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={data}
            onReorder={({ from, to }) => {
              const activeuserIndicateurs = userIndicateurs.filter((indicator) => indicator.active);
              const reordered = reorderItems(activeuserIndicateurs, from, to);

              // Merge back with inactive userIndicateurs
              const inactiveuserIndicateurs = userIndicateurs.filter((indicator) => !indicator.active);
              setUserIndicateurs([...reordered, ...inactiveuserIndicateurs]);
            }}
            scrollEnabled={false}
            contentContainerStyle={{ flex: 1, paddingHorizontal: 0 }}
            panGesture={panGesture}
          />
        )}
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const IndicatorItem = ({
  indicator,
  setUserIndicateurs,
}: {
  indicator: Indicator;
  setUserIndicateurs: React.Dispatch<React.SetStateAction<Indicator[]>>;
}) => {
  const drag = useReorderableDrag();

  const deleteIndicator = () => {
    logEvents.logDeleteIndicator();
    setUserIndicateurs((prev) => prev.map((i) => (i.uuid === indicator.uuid ? { ...i, active: false } : i)));
  };

  return (
    <TouchableOpacity onLongPress={drag} delayLongPress={200}>
      <View
        className={mergeClassNames("p-4 bg-gray-100 mb-2 rounded-xl flex-row items-center justify-between", !indicator.active ? "bg-gray-50" : "")}
      >
        <ParagraphSpacing width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_700} />
        <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950 flex-1 mx-3 ml-4")}>{indicator?.name}</Text>
        <TouchableOpacity onPress={deleteIndicator} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <TrashIcon width={24} height={24} color={TW_COLORS.CNAM_PRIMARY_800} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const CustomSymptomScreen = (props) => <CustomSymptomScreenContent {...props} />;

export default CustomSymptomScreen;
