import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";

export const Boolean = ({ indicator, value, onChange }) => {
  const trullyLabel = indicator?.order === "DESC" ? "Non" : "Oui";
  const falsyLabel = indicator?.order === "DESC" ? "Oui" : "Non";
  return (
    <View
      className={`flex ${
        indicator?.order === "DESC" ? "flex-row-reverse justify-end" : "flex-row justify-start"
      } gap-2 items-center my-3`}
    >
      <TouchableOpacity onPress={() => onChange(false)}>
        <View
          className={`flex justify-center h-8 py-1 px-4 rounded-full border border-[#26387C] ${
            typeof value === "boolean" && !value ? "border-red-500 bg-red-500" : ""
          }`}
        >
          <Text className={`${typeof value === "boolean" && !value ? "text-red-900" : "text-[#26387C]"}`}>
            {falsyLabel}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange(true)}>
        <View
          className={`flex justify-center h-8 py-1 px-4 rounded-full border border-[#26387C] ${
            typeof value === "boolean" && value ? "border-green-500 bg-green-500" : ""
          }`}
        >
          <Text className={`${typeof value === "boolean" && value ? "text-green-800" : "text-[#26387C]"}`}>
            {trullyLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
