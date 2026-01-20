import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import PlusIcon from "@assets/svg/icon/plus";
import { Typography } from "@/components/Typography";

type ActivitiesCardProps = {
  activities: string[];
  addElement: () => void;
};

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ activities, addElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#F9D1E6E6",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className=" flex-column space-y-4" disabled={!activities.length}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Typography
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#F9D1E6",
              }}
            >
              2
            </Typography>
            <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Activités</Typography>
          </View>
          {!!activities.length && (
            <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="mr-2">
              <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
        {!!activities.length && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
            Ce que vous pouvez faire seul.e pour mettre à distance les idées suicidaires :
          </Typography>
        )}
        {!activities.length && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Aucun élément pour le moment.</Typography>
        )}
        {!activities.length && (
          <TouchableOpacity className="flex-row items-center space-x-1" onPress={addElement}>
            <PlusIcon color={TW_COLORS.CNAM_PRIMARY_700} />{" "}
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Ajouter un élément</Typography>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-colmun space-y-2">
          {activities?.map((itemActivity, idx) => {
            return (
              <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-2">
                <View className="flex-row items-center space-x-2">
                  <ArrowIcon color={TW_COLORS.GRAY_500} />
                  <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemActivity}</Typography>
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
