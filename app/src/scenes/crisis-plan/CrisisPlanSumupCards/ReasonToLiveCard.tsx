import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";

type ReasonToLiveCardProps = {
  reasonToLive: string[];
  reasonToLiveImage: string[];
};

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const ReasonToLiveCard: React.FC<ReasonToLiveCardProps> = ({ reasonToLive, reasonToLiveImage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const chunkedImages = chunk(reasonToLiveImage || [], 3);

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#99DDD2",
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text
            className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
            style={{
              backgroundColor: "#CCEEE8E6",
            }}
          >
            7
          </Text>
          <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Raisons de vivre</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="mr-2">
          <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
        Les façon d’assurer vote sécurité ou de sécuriser votre environnement :
      </Text>
      {isOpen && (
        <View className="flex-col space-y-2">
          <View>
            {chunkedImages.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row mb-2 justify-between">
                {row.map((img, idx) => (
                  <View
                    key={idx}
                    className="bg-cnam-primary-50 rounded-2xl mb-2 items-center justify-center mr-2"
                    style={{
                      borderWidth: 1.5,
                      borderColor: TW_COLORS.CNAM_PRIMARY_50,
                      width: 98,
                      height: 98,
                      overflow: "hidden",
                    }}
                  >
                    <Image source={{ uri: img }} style={{ width: 94, height: 94, borderRadius: 16 }} resizeMode="cover" />
                  </View>
                ))}
                {Array.from({ length: 3 - row.length }).map((_, idx) => {
                  // empty coluumn to diplay row correclty with justify-between
                  return (
                    <View
                      key={idx}
                      className="rounded-2xl mb-2 items-center justify-center mr-2"
                      style={{
                        width: 98,
                        height: 98,
                        overflow: "hidden",
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
          {reasonToLive?.map((itemReason, idx) => {
            return (
              <View key={idx} className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-2">
                <View className="flex-row items-center space-x-2">
                  <ArrowIcon color={TW_COLORS.GRAY_500} />
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{itemReason}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ReasonToLiveCard;
