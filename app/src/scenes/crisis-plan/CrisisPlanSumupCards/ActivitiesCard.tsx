import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";

type ActivitiesCardProps = {
  activities: string[];
};

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ activities }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#F9D1E6E6",
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text
            className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
            style={{
              backgroundColor: "#F9D1E6",
            }}
          >
            2
          </Text>
          <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Activités</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="mr-2">
          <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
        Ce que vous pouvez faire seul.e pour mettre à distance les idées suicidaires :
      </Text>
      {isOpen && (
        <View className="flex-colmun space-y-2">
          {activities?.map((itemActivity, idx) => {
            return (
              <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-2">
                <View className="flex-row items-center space-x-2">
                  <ArrowIcon color={TW_COLORS.GRAY_500} />
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemActivity}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ActivitiesCard;
