import React from "react";
import { TouchableOpacity, StyleSheet, View, Pressable, Text } from "react-native";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import { InputCheckbox } from "../../components/InputCheckbox";
import { Indicator } from "@/entities/Indicator";
import { NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { TW_COLORS } from "@/utils/constants";

const CategorieElements = ({
  title,
  options,
  onClick,
  userIndicateurs,
  category,
}: {
  title: string;
  options: any[];
  onClick: (option: any) => void;
  userIndicateurs: Indicator[];
  category?: NEW_INDICATORS_CATEGORIES;
}) => {
  //  Gathered refined generic indicators with custom value (isCustom === true) or with preexisting indicators (baseIndicatorUuid exists)
  const existingRefinedIndicators = userIndicateurs.filter((ind) => ind.mainCategory === category && (ind.isCustom || ind.baseIndicatorUuid));

  // Gathered non refined generic indicators
  const genericIndicators = userIndicateurs.filter((ind) => ind.mainCategory === category && ind.isGeneric);

  // Gathered all baseIndicatorUuids of refined generic indicators with preexisting indicators
  const allBaseIndicatorUuids = userIndicateurs
    .filter((ind) => ind.baseIndicatorUuid && ind.mainCategory === category)
    .map((ind) => ind.baseIndicatorUuid);

  // we filter out genericIndicators, and indicators that will already be in existingRefinedIndicators
  const preExistingIndicators = options.filter((ind) => !ind.isGeneric && !allBaseIndicatorUuids.includes(ind.uuid));
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <TouchableOpacity
        className={mergeClassNames("bg-cnam-primary-100 flex-row p-4 justify-between items-center rounded-xl bg-[#E0EFF3] mb-4")}
        onPress={() => setIsOpen((e) => !e)}
      >
        <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>{title}</Text>
        <View>
          <RoundButtonIcon
            backgroundColor={"#FCFCFD"}
            iconColor={TW_COLORS.GRAY_700}
            borderColor={TW_COLORS.GRAY_700}
            icon="toggle"
            visible
            onPress={() => setIsOpen((e) => !e)}
            isToggled={isOpen}
            medium
          />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View className="mb-4">
          {[...preExistingIndicators, ...existingRefinedIndicators, ...genericIndicators].map((option, index) => {
            const indicateurSelectionne = userIndicateurs.find(
              (_ind) =>
                (_ind.uuid === option.uuid ||
                  (!_ind.baseIndicatorUuid && _ind.genericUuid === option.uuid) ||
                  _ind.baseIndicatorUuid === option.uuid) &&
                _ind.active
            );
            return (
              <View key={`${option.uuid}`} style={[styles.container]} className="mx-4">
                <Pressable
                  onPress={() => {
                    console.log("✍️  option", option);
                    onClick(option);
                  }}
                  hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                >
                  <View
                    style={[styles.contentContainer]}
                    className={mergeClassNames(index !== 0 ? "border-t border-gray-300" : "", "pb-2 pt-1")}
                    pointerEvents="none"
                  >
                    <InputCheckbox label={option.name} checked={indicateurSelectionne} />
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
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
    borderColor: "#dadada",
    borderBottomWidth: 0.5,
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
  choixLabel: {
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
});

export default CategorieElements;
