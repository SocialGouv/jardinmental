import React, { useRef } from "react";
import { View } from "react-native";
import RangeDate from "../RangeDate";
import FriseGraphList from "./FriseGraphList";
import { FriseFilterBar } from "./FriseFilterBar";
import { styles as commonStyles } from "../Bilan";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import HelpView from "@/components/HelpView";
import { HELP_ANALYSE } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";
import Legend from "../Legend";

export const FriseScreen = ({ navigation, presetDate, setPresetDate, fromDate, setFromDate, toDate, setToDate, hasTreatment, onScroll }) => {
  const [focusedScores, setFocusedScores] = React.useState([]);
  const [showTraitement, setShowTraitement] = React.useState(true);
  const [filterEnabled, setFilterEnabled] = React.useState(false);
  const { showBottomSheet } = useBottomSheet();
  const friseInfoButtonRef = useRef();

  if (!toDate || !fromDate) return null;

  return (
    <>
      <View style={commonStyles.headerContainer}>
        <View className="w-full px-4">
          <RangeDate
            isFilterActive={filterEnabled}
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
          <View className="h-[1] bg-cnam-primary-400 mt-6"></View>
          <Legend className="mt-6" />
        </View>
      </View>
      <FriseGraphList
        navigation={navigation}
        fromDate={fromDate}
        toDate={toDate}
        focusedScores={focusedScores}
        showTraitement={showTraitement}
        hasTreatment={hasTreatment}
        onScroll={onScroll}
      />
    </>
  );
};
