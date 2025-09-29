import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Resource } from "./data/resources";
// import StopWatchIcon from "../../../assets/svg/icon/StopWatch";
// import { colors } from "@/utils/colors";

interface ResourceCardProps {
  resource: Resource;
  onPress: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="text-cnam-primary-950 bg-white border p-2 border-cnam-primary-400 rounded-lg flex flex-row mb-2 h-32 items-center"
    >
      {resource.image && (
        <View className="w-20 h-full relative">
          <Image source={resource.image} className="absolute rounded-lg inset-0 w-full h-full" resizeMode="cover" />
        </View>
      )}
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
      <View className="justify-center items-center pr-4">
        <Text className="text-lg text-cnam-primary-950 font-bold">→</Text>
      </View>
    </TouchableOpacity>
  );
};
export default ResourceCard;
