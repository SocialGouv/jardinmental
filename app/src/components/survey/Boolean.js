import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../MyText";
import colors from "@/utils/colors";

export const Boolean = ({ indicator, value, onChange }) => {
  const color = {
    ASC: {
      false: { text: "text-white", bg: "border-red-400 bg-red-400" },
      true: { text: "text-white", bg: "border-green-400 bg-green-400" },
    },
    DESC: {
      true: { text: "text-white", bg: "border-red-400 bg-red-400" },
      false: { text: "text-white", bg: "border-green-400 bg-green-400" },
    },
  };

  return (
    <View className={`flex flex-row justify-start gap-2 items-center my-3`}>
      <TouchableOpacity onPress={() => onChange(false)}>
        <View
          className={`flex justify-center h-8 py-1 px-4 rounded-full border border-[${colors.BLUE}] ${typeof value === "boolean" && !value ? color[indicator?.order]?.false.bg : ""
            }`}
        >
          <Text
            className={`${typeof value === "boolean" && !value ? color[indicator?.order]?.false.text : `text-[${colors.BLUE}]`
              }`}
          >
            Non
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange(true)}>
        <View
          className={`flex justify-center h-8 py-1 px-4 rounded-full border border-[${colors.BLUE}] ${typeof value === "boolean" && value ? color[indicator?.order]?.true.bg : ""
            }`}
        >
          <Text
            className={`${typeof value === "boolean" && value ? color[indicator?.order]?.true.text : `text-[${colors.BLUE}]`
              }`}
          >
            Oui
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
