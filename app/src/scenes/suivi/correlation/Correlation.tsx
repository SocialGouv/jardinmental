import React, { useState, useMemo } from "react";
import { ScrollView, View, Image, Text, TouchableOpacity, Dimensions, Platform } from "react-native";

import { TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import { beforeToday, getArrayOfDates, formatDay } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { useContext } from "react";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import PlusIcon from "@assets/svg/icon/plus";
import EmptyCorrelationIllustration from "@assets/svg/illustrations/EmptyCorrelationIllustration";
import { IndicatorsBottomSheet } from "@/components/IndicatorsBottomSheet";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import InfoCircle from "@assets/svg/icon/InfoCircle";
import { Indicator } from "@/entities/Indicator";
import { Typography } from "@/components/Typography";
import { Goal } from "@/entities/Goal";

const screenHeight = Dimensions.get("window").height;

export const CorrelationHeader = ({ fromDate, toDate, scrollY }) => {
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
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      <View className="w-full px-4">{/* <Legend className="mt-6" /> */}</View>
    </Animated.View>
  );
};

export const Correlation = ({ navigation }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [diaryData] = useContext(DiaryDataContext);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);

  const generateLineSegments = (data) => {
    if (!data || data.length === 0) return [];

    const segments: Array<{
      startIndex: number;
      endIndex: number;
      color: string;
      thickness: number;
    }> = [];
    let startIndex = null;

    data.forEach((point, index) => {
      if (point.value === 1 && point.noValue) {
        // Début d'un segment
        if (startIndex === null) {
          // console.log("start index", index);
          startIndex = index - 1;
        }
      } else {
        // Fin d'un segment
        if (startIndex !== null) {
          // console.log("end index", index - 1);
          segments.push({
            startIndex,
            endIndex: index,
            color: "transparent", // Vert
            thickness: 3,
          });
          startIndex = null;
        }
      }
    });

    // Gérer le cas où le segment se termine à la fin du tableau
    if (startIndex !== null) {
      segments.push({
        startIndex,
        endIndex: data.length - 1,
        color: "#4CAF50",
        thickness: 3,
      });
    }

    return segments;
  };

  const [showTreatment, setShowTreatment] = useState<boolean>(false);

  const onPressChooseIndicator = () => {
    navigation.navigate("correlation-modal" as never);
  };

  const dataToDisplay = useMemo(() => {
    if (!diaryData) {
      return null;
    }
    const data = [];
    const twoYearsAgo = beforeToday(40 * 1); // Calculate date from 2 years ago
    const chartDates = getArrayOfDates({ startDate: twoYearsAgo }); // Get all dates from 2 years ago to today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    chartDates.push(formatDay(tomorrow));
    for (const indicator of selectedIndicators) {
      const newData = chartDates
        .map((date) => {
          const dayData = diaryData[date];
          if (!dayData) {
            return {
              value: 1,
              hideDataPoint: false,
              noValue: true,
              date: date,
              indicator,
              label: date,
            };
          }
          const categoryState = diaryData[date][getIndicatorKey(indicator)];
          if (!categoryState) {
            return {
              value: 1,
              hideDataPoint: false,
              noValue: true,
              date: date,
              label: date,
              indicator,
            };
          }
          if (indicator?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
          if (indicator?.type === "gauge")
            return {
              label: date,
              date: date,
              indicator,
              value: Math.min(Math.floor(categoryState?.value * 5), 4) + 1,
            };
          if (categoryState?.value)
            return {
              value: categoryState?.value,
              label: date,
              date: date,
              indicator,
            };

          // get the name and the suffix of the category
          const [categoryName, suffix] = getIndicatorKey(indicator).split("_");
          let categoryStateIntensity = null;
          if (suffix && suffix === "FREQUENCE") {
            // if it's one category with the suffix 'FREQUENCE' :
            // add the intensity (default level is 3 - for the frequence 'never')
            categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
            return {
              value: categoryState.level + categoryStateIntensity.level - 2,
              label: date,
              date: date,
              indicator,
            };
          }
          return {
            data: categoryState.level ? categoryState.level : null,
            hideDataPoint: false,
            noValue: !categoryState.level,
            label: date,
            date: date,
            indicator,
          };
        })
        .filter((d) => d)
        .filter((d) => {
          if (!Number.isFinite(d.value)) {
            return false;
          }
          return true;
        });
      data.push(newData);
    }
    return data;
  }, [diaryData, selectedIndicators]); // 👈 recalcul dès que rawData ou filters changent

  const isSmallScreen = screenHeight < 700;

  const bottomPadding = Platform.OS === "ios" ? TAB_BAR_HEIGHT + 100 : TAB_BAR_HEIGHT + (isSmallScreen ? 400 : 300);

  if (selectedIndicators.length === 0) {
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        className="px-4 flex-col space-y-4 pt-60 bg-white"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <Typography className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>
          Comparez vos indicateurs, comprenez vos tendances
        </Typography>
        <View className="bg-cnam-cyan-50-lighten-90 p-4 border border-dashed border-cnam-primary-500 flex-col space-y-4">
          <EmptyCorrelationIllustration width="100%" />
          <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
            Sommeil, énergie, humeur, activité… Affichez un ou deux indicateurs pour :{"\n"}- Observer leur(s) évolution(s)
            {"\n"}- Repérer quand ils évoluent ensemble ou en sens opposé.
          </Typography>
          <JMButton
            onPress={() => {
              navigation.navigate("correlation-modal", {});
            }}
            variant="outline"
            title="Choisir mes indicateurs"
            icon={<PlusIcon />}
          />
        </View>
        <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700 items-center")}>
          Un lien apparent n’implique pas une causalité. Cette vue propose une lecture sans interprétation médicale.
        </Typography>
      </ScrollView>
    );
  } else if (!dataToDisplay) {
    return (
      <ScrollView className="px-4 flex-col space-y-4 pt-60 bg-white" contentContainerStyle={{ paddingBottom: bottomPadding }}>
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(
              <IndicatorsBottomSheet
                onClose={function ({ showTreatment, selectedIndicators }: { showTreatment: boolean; selectedIndicators: string[] }): void {
                  throw new Error("Function not implemented.");
                }}
              />
            );
          }}
          className="border border-cnam-primary-700 flex-row h-[48px] rounded-2xl items-center px-4 justify-between"
        >
          <Typography className={mergeClassNames(typography.textLgMedium, "text-gray-900")}>
            Modifier les indicateurs ({selectedIndicators.length + selectedGoals.length})
          </Typography>
          <ArrowUpSvg
            style={{
              transform: [{ rotateX: "180deg" }],
            }}
            color={TW_COLORS.CNAM_PRIMARY_900}
          />
        </TouchableOpacity>
        <View className="border border-cnam-primary-300 rounded-2xl">
          <Image
            style={{ width: "100%", height: "230" }}
            resizeMode="contain"
            source={require("@assets/imgs/courbe.png")}
            blurRadius={20} // 👈 controls blur intensity
          />
          <View className="absolute w-full">
            <Typography className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4 mt-4")}>
              Continuez à renseigner vos indicateurs pendant quelques jours.
            </Typography>
          </View>
        </View>
        <View className="bg-cnam-cyan-50-lighten-90 flex-row py-4 space-x-2 px-4 rounded-2xl">
          <View>
            <InfoCircle />
          </View>
          <View className="flex-1">
            <Typography className={mergeClassNames(typography.textMdMedium, "text-primary-900")}>
              Les premières courbes apparaîtront dès qu’il y aura assez de données pour repérer des liens. Il faut en moyenne 3 semaines d’utilisation
              pour faire des corrélations.
            </Typography>
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView className="px-4 flex-col space-y-4 pt-60 bg-white" contentContainerStyle={{ paddingBottom: bottomPadding }}>
        <TestChart
          data={dataToDisplay[0]}
          dataB={dataToDisplay[1]}
          treatment={undefined}
          diaryData={diaryData}
          selectedIndicators={selectedIndicators}
        />
      </ScrollView>
    );
  }
};
