import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import PhoneIcon from "@assets/svg/icon/Phone";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import User from "@assets/svg/icon/User";

type ChangeIdeasCardProps = {
  contactsChangeIdeas: { name: string; activities?: string[] }[];
};

const ChangeIdeasCard: React.FC<ChangeIdeasCardProps> = ({ contactsChangeIdeas }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#99DBF2",
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text
            className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
            style={{
              backgroundColor: "#CCEDF9",
            }}
          >
            3
          </Text>
          <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Se changer les idées</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="mr-2">
          <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
        Les proches que vous pouvez contacter et les activités que vous pouvez faire ensemble pour vous changer les idées :
      </Text>
      {isOpen && (
        <View className="flex-colmun">
          <View className="flex-colmun space-y-2">
            {contactsChangeIdeas?.map((item, idx) => {
              return (
                <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-4 items-center">
                  <View className="flex-row items-start space-x-4 flex-1">
                    <View className="pt-0">
                      <User color={TW_COLORS.CNAM_PRIMARY_800} width={20} height={20} />
                    </View>
                    <View className="flex-column flex-1">
                      <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.name}</Text>
                      <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
                        {item.activities?.join(", ") || "Aucune activitée n'a encore été renseignée"}
                      </Text>
                    </View>
                  </View>
                  <View className="items-center flex-row h-full">
                    <PhoneIcon width={24} height={24} color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
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

export default ChangeIdeasCard;
