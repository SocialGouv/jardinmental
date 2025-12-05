import React from "react";
import { TouchableOpacity, View, Pressable, Text } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { TW_COLORS } from "@/utils/constants";
import { InputCheckbox } from "@/components/InputCheckbox";
import RoundButtonIcon from "@/components/RoundButtonIcon";

const GoalElementsSelection = ({
  title,
  options,
  onClick,
  goalsToChange,
  enabledExampleGoals,
}: {
  title: string;
  options: string[];
  onClick: (checked, goalName) => void;
}) => {
  // we filter out genericIndicators, and indicators that will already be in existingRefinedIndicators
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
          {options.map((goalName, index) => {
            console.log(goalsToChange, enabledExampleGoals);
            return (
              <View key={`${goalName}`} className="mx-4">
                <Pressable
                  onPress={() => {
                    onClick(!(goalsToChange?.[goalName]?.enabled ?? enabledExampleGoals?.[goalName]), goalName);
                  }}
                  hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                >
                  <View className={mergeClassNames(index !== 0 ? "border-t border-gray-300" : "", "pb-2 pt-1")} pointerEvents="none">
                    <InputCheckbox label={goalName} checked={goalsToChange?.[goalName]?.enabled ?? enabledExampleGoals?.[goalName]} />
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

export default GoalElementsSelection;
