import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ToolItemEntity } from "./toolsData";
import localStorage from "@/utils/localStorage";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

import BookmarkMinus from "@assets/svg/icon/BookmarkMinus";
import Bookmark from "@assets/svg/icon/Bookmark";
import logEvents from "@/services/logEvents";
import { ToolItemIcon } from "./toolUtils";

interface ToolItemCardProps {
  toolItem: ToolItemEntity;
  onPress: (resource: ToolItemEntity) => void;
  onBookmarkChange?: () => void;
}

const ToolItemCard: React.FC<ToolItemCardProps> = ({ toolItem, onPress, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const itemId = toolItem.id;

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await localStorage.getBookmarkedToolItems();
        setIsBookmarked(ids.includes(itemId));
      } catch (error) {
        console.error("Failed to load viewed resources:", error);
      }
    };
    load();
  }, [itemId]);

  const handlePress = async () => {
    onPress(toolItem);
  };

  const handleBookmarkToggle = async (e: any) => {
    // Prevent the card's onPress from being triggered
    e?.stopPropagation?.();

    try {
      if (isBookmarked) {
        const updated = await localStorage.removeBookmarkToolItem(itemId);
        setIsBookmarked(updated.includes(itemId));
      } else {
        const updated = await localStorage.bookmarkToolItem(itemId);
        setIsBookmarked(updated.includes(itemId));
      }
      // Log bookmark event
      logEvents.logOutilsBookmark();
      // Notify parent to refresh bookmarks
      onBookmarkChange?.();
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handlePress} key={itemId}>
      <View className={`rounded-2xl flex flex-row  min-h-[112px] ${"border-2 border-cnam-primary-400 bg-white"}`}>
        <View className={`${"bg-cnam-cyan-lighten-90"} rounded-l-2xl flex items-center justify-center w-20`}>
          <ToolItemIcon type={toolItem.type} />
          <Text className="text-xs text-cnam-primary-900 font-medium pt-1 rounded text-center">
            {Array.isArray(toolItem.type) ? (
              toolItem.type[0] === "Questionnaire" ? (
                <>Question&shy;naire</>
              ) : (
                toolItem.type[0]
              )
            ) : toolItem.type === "Questionnaire" ? (
              <>Question&shy;naire</>
            ) : (
              toolItem.type
            )}
          </Text>
        </View>
        <View className="flex-1 flex">
          <View className="px-4 grow pt-4">
            <View className="flex flex-row items-start space-x-2">
              <Text className="flex-1 text-base font-semibold text-cnam-primary-950">{toolItem.title}</Text>
              <TouchableOpacity onPress={handleBookmarkToggle}>
                {isBookmarked ? <BookmarkMinus width={20} height={20} /> : <Bookmark width={20} height={20} />}
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-4 grow pb-4 mt-2">
            <View className="flex flex-row items-start">
              <Text className={mergeClassNames(typography.textSmMedium, "flex-1 text-gray-800")} numberOfLines={2}>
                {toolItem.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ToolItemCard;
