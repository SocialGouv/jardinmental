import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Resource } from "./data/resources";
import CheckMarkIcon from "@assets/svg/icon/check";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
// import StopWatchIcon from "../../../assets/svg/icon/StopWatch";
// import { colors } from "@/utils/colors";

interface ResourceCardProps {
  resource: Resource;
  onPress: () => void;
  read?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress, read = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`text-cnam-primary-950  border p-2 ${
        read ? "border-cnam-primary-200 bg-cnam-primary-25" : "border-cnam-primary-400 bg-white"
      } rounded-lg flex flex-row mb-2 h-32 items-center`}
    >
      <View className="w-20 h-full relative">
        <Image
          source={resource.image || require("../../../assets/imgs/resources/Article2.png")}
          className="absolute rounded-lg inset-0 w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 px-2 ml-1">
        <Text
          numberOfLines={4} // change to how many lines you want
          ellipsizeMode="tail"
          className="text-base font-semibold mb-2 text-cnam-primary-950"
        >
          {resource.title}
        </Text>
        {/* 
        <View className="flex flex-row items-center mt-2">
          <View className="bg-gray-200 rounded-xl py-1 px-2 flex flex-row justify-center items-center">
            <StopWatchIcon color={colors.CNAM_PRIMARY_900} />
            <Text className="text-sm text-cnam-primary-900 ml-1">{resource.duration}</Text>
          </View>
        </View> 
        */}
      </View>
      <View className={`flex flex-col h-full justify-center items-center pr-2`}>
        {read ? (
          <CheckMarkIcon width={16} height={16} color={TW_COLORS.CNAM_PRIMARY_900} />
        ) : (
          <ArrowIcon width={16} height={16} color={TW_COLORS.CNAM_PRIMARY_900} />
        )}
      </View>
    </TouchableOpacity>
  );
};
export default ResourceCard;
