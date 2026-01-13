import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const chunkedImages = chunk(reasonToLiveImage || [], 3);

  const openImageModal = (img: string) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white "
      style={{
        borderWidth: 1,
        borderColor: "#99DDD2",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="flex-column  space-y-4">
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
        <View>
          <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Vos principales raisons de vivre :</Text>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <>
          <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
            <TouchableWithoutFeedback onPress={closeImageModal}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      padding: 10,
                      alignItems: "center",
                      maxWidth: "90%",
                      maxHeight: "80%",
                    }}
                  >
                    {selectedImage && (
                      <Image source={{ uri: selectedImage }} style={{ width: 300, height: 300, borderRadius: 16, resizeMode: "contain" }} />
                    )}
                    <TouchableOpacity
                      onPress={closeImageModal}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: 16,
                        padding: 4,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 20 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View className="flex-col space-y-2 mt-4">
            <View>
              {chunkedImages.map((row, rowIdx) => (
                <View key={rowIdx} className="flex-row mb-2 justify-between">
                  {row.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => openImageModal(img)}
                      activeOpacity={0.8}
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
                    </TouchableOpacity>
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
            {reasonToLive.length === 0 && (
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>Aucune raison de vivre renseignée.</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ReasonToLiveCard;
