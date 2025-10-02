import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { answers } from "../survey-v2/utils";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { analyzeScoresMapIcon, TW_COLORS } from "@/utils/constants";
import EyeIcon from "@assets/svg/icon/Eye";
import EyeOffIcon from "@assets/svg/icon/EyeOff";

type Item = { label: string; color: string };
const DEFAULT_COLOR = "#D7D3D3";
const TREATMENT_COLOR = "#CCEDF9";
const NO_TREATMENT_COLOR = "#F9D1E6";

export default function Legend({ className }: { className?: string }) {
  const [extended, setExtended] = React.useState(false);

  return (
    <View className={mergeClassNames("items-center px-2 mt-8 w-full", className)}>
      <View className={mergeClassNames("rounded-xl w-full px-2 py-3 flex-col space-y-4", extended ? "bg-primary-50" : "")}>
        <TouchableOpacity
          onPress={() => setExtended(!extended)}
          className="bg-cnam-primary-100 rounded-full flex-row px-3 py-1 space-x-1 self-start items-center"
        >
          {extended && <EyeIcon />}
          {!extended && <EyeOffIcon />}
          <Text className={mergeClassNames("text-cnam-primary-950", typography.textSmSemibold)}>
            {extended ? "Voir la légende" : "Masquer la légende"}
          </Text>
        </TouchableOpacity>
        {extended && (
          <View className="flex-row space-x-3 items-center">
            {[
              {
                label: "Très bas",
                ...analyzeScoresMapIcon[1],
              },
              {
                label: "Bas",
                ...analyzeScoresMapIcon[2],
              },
              {
                label: "Normal",
                ...analyzeScoresMapIcon[3],
              },
              {
                label: "Élevé",
                ...analyzeScoresMapIcon[4],
              },
              {
                label: "Très élevé",
                ...analyzeScoresMapIcon[5],
              },
            ].map((item) => {
              return (
                <View className="flex-row items-center space-x-1">
                  <View
                    style={{
                      backgroundColor: item.color,
                    }}
                    className={mergeClassNames("px-[4] h-[20] rounded-md justify-center items-center text-center ")}
                  >
                    <Text style={{ textAlign: "center" }} className={mergeClassNames(typography.textSmMedium, item.iconColor, "leading-none")}>
                      {item.symbol}
                    </Text>
                  </View>
                  <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-800")}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        )}
        {extended && (
          <View className="flex-row space-x-3 items-center">
            {[
              {
                label: "Non",
                color: NO_TREATMENT_COLOR,
                symbol: "x",
                iconColor: TW_COLORS.CNAM_PRIMARY_800,
              },
              {
                label: "Oui",
                color: TREATMENT_COLOR,
                symbol: "✓",
                iconColor: TW_COLORS.CNAM_PRIMARY_800,
              },
            ].map((item) => {
              return (
                <View className="flex-row items-center space-x-1">
                  <View
                    style={{
                      backgroundColor: item.color,
                    }}
                    className={mergeClassNames("h-[20] px-2 rounded-md")}
                  >
                    <Text className={mergeClassNames(typography.textSmMedium, item.iconColor, "leading-none")}>{item.symbol}</Text>
                  </View>
                  <Text className={mergeClassNames(typography.textSmMedium, "ml-2 text-cnam-primary-800 ")}>{item.label}</Text>
                </View>
              );
            })}
            <View className="flex-row items-center space-x-1">
              <View className="rounded-full h-2 w-2 bg-cnam-primary-800"></View>
              <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-800")}>Si besoin</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
