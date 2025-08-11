import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../MyText";

const LegalItem = ({ title, navigation, path = "tabs", onClick }) => {
  const handleClick = () => {
    onClick();
    navigation && navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View className="py-2.5 pl-5">
        <View className="flex flex-row items-center">
          <Text className="flex-1 text-[13px] font-medium text-neutral-600 underline">{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LegalItem;
