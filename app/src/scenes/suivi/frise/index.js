import React, { useRef } from "react";
import { View } from "react-native";
import RangeDate from "../RangeDate";
import FriseGraphList from "./FriseGraphList";
import { FriseInfoButton } from "./FriseInfoButton";
import { Button2 } from "../../../components/Button2";
import { FriseFilterBar } from "./FriseFilterBar";
import { styles as commonStyles } from "..";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";

export const FriseScreen = ({ navigation, presetDate, setPresetDate, fromDate, setFromDate, toDate, setToDate, hasTreatment }) => {
  const [focusedScores, setFocusedScores] = React.useState([]);
  const [showTraitement, setShowTraitement] = React.useState(true);
  const [filterEnabled, setFilterEnabled] = React.useState(false);

  const friseInfoButtonRef = useRef();

  if (!toDate || !fromDate) return null;

  return (
    <>
      <View style={commonStyles.headerContainer}>
        <RangeDate
          presetValue={presetDate}
          onChangePresetValue={setPresetDate}
          fromDate={fromDate}
          toDate={toDate}
          onChangeFromDate={setFromDate}
          onChangeToDate={setToDate}
          withPreset={true}
        >
          {/* TODO : make it work avec les autres types d'indicateur */}
          <Button2
            checkable
            title="Filtrer"
            icon={!filterEnabled ? "TuneSvg" : "CheckSvg"}
            preset="secondary"
            size="small"
            containerStyle={{ marginHorizontal: 8 }}
            checked={filterEnabled}
            onPress={() => {
              const nextValue = !filterEnabled;
              if (!nextValue) {
                setShowTraitement(true);
                setFocusedScores([]);
              }
              setFilterEnabled(nextValue);
              autoLayoutAnimation();
            }}
          />
          <FriseInfoButton
            ref={friseInfoButtonRef}
            navigation={navigation}
            hasTreatment={hasTreatment}
            containerStyle={{ marginLeft: 10, position: "relative", right: 0 }}
          />
        </RangeDate>
        {filterEnabled && (
          <FriseFilterBar
            hasTreatment={hasTreatment}
            onShowInfo={() => friseInfoButtonRef?.current?.press?.()}
            onShowTreatmentChanged={setShowTraitement}
            onFocusedScoresChanged={setFocusedScores}
          />
        )}
      </View>
      <FriseGraphList
        navigation={navigation}
        fromDate={fromDate}
        toDate={toDate}
        focusedScores={focusedScores}
        showTraitement={showTraitement}
        hasTreatment={hasTreatment}
      />
    </>
  );
};
