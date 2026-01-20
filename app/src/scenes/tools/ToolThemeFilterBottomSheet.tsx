import { View, Text, ScrollView, Dimensions } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useEffect, useRef, useState } from "react";
import localStorage from "@/utils/localStorage";
import { Indicator } from "@/entities/Indicator";
import JMButton from "@/components/JMButton";
import { LightSelectionnableItem } from "@/components/SelectionnableItem";
import { ToolItemTheme, ToolItemThemes, ToolThemeFilter } from "@/entities/ToolItem";
import MenuIcon from "@assets/svg/icon/Menu";
import { TW_COLORS } from "@/utils/constants";
import { Typography } from "@/components/Typography";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

export const ToolThemeFilterBottomSheet = ({
  initialThemeFilter,
  onClose,
}: {
  initialThemeFilter?: ToolThemeFilter;
  onClose: ({ selectedThemeFilter }: { selectedThemeFilter: ToolThemeFilter }) => void;
}) => {
  const [indicatorList, setindicatorList] = useState<Indicator[] | null>(null);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<ToolThemeFilter>(initialThemeFilter || "Tout");

  useEffect(() => {
    const getIndicators = async function () {
      const indicators = await localStorage.getIndicateurs();
      setindicatorList(indicators);
    };
    getIndicators();
  }, []);

  const setToogleCheckbox = (toolTheme: ToolThemeFilter) => {
    setSelectedThemeFilter(toolTheme);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="flex-row bg-[#E5F6FC] self-start items-center p-2">
          <MenuIcon color={TW_COLORS.CNAM_CYAN_700_DARKEN_40} />
          <Typography className={mergeClassNames(typography.textSmBold, "ml-2 text-cnam-cyan-700-darken-40 text-left")}>Catégories</Typography>
        </View>
        <View className="p-4 flex-column flex-1 gap-6">
          <View className="flex-colum flex-1">
            {!indicatorList && <Typography>Chargement...</Typography>}
            {["Toutes les catégories", "Mes Favoris", ...ToolItemThemes].map((theme) => {
              let selectedValue = theme;
              if ("Toutes les catégories" === theme) {
                selectedValue = "Tout";
              } else if ("Mes Favoris" === theme) {
                selectedValue = "Favoris";
              }
              const selected = selectedThemeFilter === selectedValue;

              return (
                <LightSelectionnableItem
                  key={theme}
                  className="flex-row"
                  shape="circle"
                  id={theme}
                  label={theme}
                  boxPosition="top"
                  disabled={false}
                  selected={selected}
                  onPress={() => setToogleCheckbox(selectedValue as ToolThemeFilter)}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`flex-column justify-between items-center p-6 px-6 bg-white/90 pb-10 w-full`}
      >
        <JMButton
          onPress={async () => {
            onClose({
              selectedThemeFilter: selectedThemeFilter,
            });
          }}
          title={"Valider"}
        />
      </View>
    </View>
  );
};
