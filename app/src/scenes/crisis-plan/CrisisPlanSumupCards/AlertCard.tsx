import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import PlusIcon from "@assets/svg/icon/plus";

type AlertCardProps = {
  alerts: string[];
  addElement: () => void;
};

const AlertCard: React.FC<AlertCardProps> = ({ alerts, addElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#D9BDE2",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className=" flex-column space-y-4" disabled={!alerts.length}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#ECDEF0",
              }}
            >
              1
            </Text>
            <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Mes signes d'alerte</Text>
          </View>
          {!!alerts.length && (
            <View className="mr-2">
              <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
            </View>
          )}
        </View>
        {!!alerts.length && (
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
            Les signes d’alerte qui sont pour vous annonciateurs d’idées suicidaires :
          </Text>
        )}

        {!alerts.length && <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Aucun élément pour le moment.</Text>}
        {!alerts.length && (
          <TouchableOpacity className="flex-row items-center space-x-1" onPress={addElement}>
            <PlusIcon color={TW_COLORS.CNAM_PRIMARY_700} />{" "}
            <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Ajouter un élément</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-colmun space-y-2">
          {alerts?.map((itemAlert, idx) => {
            return (
              <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-2">
                <View className="flex-row items-center space-x-2">
                  <ArrowIcon color={TW_COLORS.GRAY_500} />
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemAlert}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default AlertCard;
