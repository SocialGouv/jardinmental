import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import PlusIcon from "@assets/svg/icon/plus";
import { Typography } from "@/components/Typography";

type SafetyCardProps = {
  safety: string[];
  addElement: () => void;
};

const SafetyCard: React.FC<SafetyCardProps> = ({ safety, addElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#CED9EB",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="flex-column space-y-4" disabled={!safety.length}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Typography
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#CED9EB",
              }}
            >
              6
            </Typography>
            <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Environnement sécurisé</Typography>
          </View>
          {!!safety.length && (
            <View className="mr-2">
              <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
            </View>
          )}
        </View>
        {safety.length === 0 && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Aucun élément pour le moment.</Typography>
        )}
        {safety.length !== 0 && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
            Les façons d’assurer votre sécurité ou de sécuriser votre environnement :
          </Typography>
        )}
        {!safety.length && (
          <TouchableOpacity className="flex-row items-center space-x-1" onPress={addElement}>
            <PlusIcon color={TW_COLORS.CNAM_PRIMARY_700} />{" "}
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Ajouter un élément</Typography>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-colmun">
          <View className="flex-colmun space-y-2">
            {safety?.map((itemSafety, idx) => {
              return (
                <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-2">
                  <View className="flex-row items-center space-x-2">
                    <ArrowIcon color={TW_COLORS.GRAY_500} />
                    <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemSafety}</Typography>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default SafetyCard;
