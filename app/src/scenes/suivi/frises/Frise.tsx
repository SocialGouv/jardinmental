import React, { useRef } from "react";
import { View } from "react-native";
import { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import RangeDate from "../RangeDate";
import { styles as commonStyles } from "../Bilan";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import HelpView from "@/components/HelpView";
import { HELP_ANALYSE } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";
import Legend from "../Legend";
import FriseGraphList from "../correlation/FriseGraphList";
import { FriseFilterBar } from "../correlation/FriseFilterBar";

export const FriseHeader = ({
  presetDate,
  setPresetDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  hasTreatment,
  scrollY,
  focusedScores,
  setFocusedScores,
  showTraitement,
  setShowTraitement,
  filterEnabled,
  setFilterEnabled,
  friseInfoButtonRef,
}) => {
  const { showBottomSheet } = useBottomSheet();

  const animatedShadowStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { shadowOpacity: 0, elevation: 0 };
    }

    const shadowOpacity = interpolate(scrollY.value, [0, 50], [0, 0.2], Extrapolate.CLAMP);
    const elevation = interpolate(scrollY.value, [0, 50], [0, 8], Extrapolate.CLAMP);

    return { shadowOpacity, elevation };
  });

  if (!toDate || !fromDate) return null;

  return (
    <Animated.View
      style={[
        commonStyles.headerContainer,
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      <View className="w-full px-4">
        <RangeDate
          isFilterActive={filterEnabled}
          hideFromBeginningButton={true}
          presetValue={presetDate}
          onChangePresetValue={setPresetDate}
          fromDate={fromDate}
          toDate={toDate}
          setIsFilterActive={() => {
            const nextValue = !filterEnabled;
            if (!nextValue) {
              setShowTraitement(true);
              setFocusedScores([]);
            }
            setFilterEnabled(nextValue);
            autoLayoutAnimation();
          }}
          onHelpClick={() => {
            showBottomSheet(
              <HelpView title={HELP_ANALYSE["correlation"]["title"]} description={HELP_ANALYSE["correlation"]["description"]} isMd={true} />
            );
          }}
          onChangeFromDate={setFromDate}
          onChangeToDate={setToDate}
          withPreset={true}
        />
        {filterEnabled && (
          <FriseFilterBar
            hasTreatment={hasTreatment}
            onShowInfo={() => friseInfoButtonRef?.current?.press?.()}
            onShowTreatmentChanged={setShowTraitement}
            onFocusedScoresChanged={setFocusedScores}
          />
        )}
        <Legend className="mt-6" />
      </View>
    </Animated.View>
  );
};

export const FriseScreen = ({ navigation, fromDate, toDate, onScroll, focusedScores, showTraitement, dynamicPaddingTop }) => {
  if (!toDate || !fromDate) return null;

  return (
    <>
      <FriseGraphList
        navigation={navigation}
        fromDate={fromDate}
        toDate={toDate}
        focusedScores={focusedScores}
        showTraitement={showTraitement}
        onScroll={onScroll}
        dynamicPaddingTop={dynamicPaddingTop}
      />
    </>
  );
};
