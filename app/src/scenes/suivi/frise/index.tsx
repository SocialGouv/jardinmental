import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import RangeDate from "../RangeDate";
import FriseGraphList from "./FriseGraphList";
import { FriseInfoButton } from "./FriseInfoButton";
import { Button2 } from "../../../components/Button2";
import { FriseFilterBar } from "./FriseFilterBar";
import { styles as commonStyles } from "..";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import ColorLegendRow from "../Legend";
import JMButton from "@/components/JMButton";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import HelpView from "@/components/HelpView";
import { HELP_ANALYSE } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";

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
        <View className="w-full px-2">
          <View className="flex-row items-center pb-6 w-full justify-between">
            <View className="flex-row">
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
              </RangeDate>
              <Button2
                checkable
                title="Filtrer"
                style={{
                  height: 40,
                }}
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
            </View>
            <JMButton
              onPress={() => {
                showBottomSheet(<HelpView title={HELP_ANALYSE["correlation"]["title"]} description={HELP_ANALYSE["correlation"]["description"]} />);
              }}
              variant="outline"
              width="fixed"
              icon={<CircleQuestionMark />}
              className="mr-2"
            />
          </View>
          <View className="h-[1] bg-cnam-primary-400"></View>
        </View>
        {filterEnabled && (
          <FriseFilterBar
            hasTreatment={hasTreatment}
            onShowInfo={() => friseInfoButtonRef?.current?.press?.()}
            onShowTreatmentChanged={setShowTraitement}
            onFocusedScoresChanged={setFocusedScores}
          />
        )}
        <ColorLegendRow className={"mt-8"} />
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
