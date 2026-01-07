import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import PhoneIcon from "@assets/svg/icon/Phone";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import User from "@assets/svg/icon/User";

type HelpCardProps = {
  contactsHelp: {
    name: string;
    phoneNumbers: [
      {
        number: string;
        digits: string;
      }
    ];
  }[];
};

const HelpCard: React.FC<HelpCardProps> = ({ contactsHelp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCall = async (number: string) => {
    const phoneNumber = number;
    const url = `tel:${phoneNumber}`;

    try {
      await Linking.openURL(url);
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Les appels ne sont pas supportés sur cet appareil vérifié les permissions de l'application.");
    }
  };

  return (
    <View
      className="rounded-2xl mx-4 my-2 p-4 bg-white flex-column space-y-4"
      style={{
        borderWidth: 1,
        borderColor: "#99DDD2",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#CCEEE8E6",
              }}
            >
              4
            </Text>
            <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Demander de l’aide</Text>
          </View>
          <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className="mr-2">
            <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
          Les proches que vous pouvez contacter pour recevoir de l’aide :{" "}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-colmun">
          <View className="flex-colmun space-y-2">
            {contactsHelp?.map((item, idx) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleCall(item.phoneNumbers[0].digits);
                  }}
                  key={idx}
                  className="flex-row justify-between bg-cnam-primary-25 rounded-xl border border-gray-400 px-4 py-4 items-center"
                >
                  <View className="flex-row items-start space-x-4 flex-1">
                    <View className="pt-0">
                      <User color={TW_COLORS.CNAM_PRIMARY_800} width={20} height={20} />
                    </View>
                    <View className="flex-column flex-1">
                      <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.name}</Text>
                    </View>
                  </View>
                  <View className="items-center flex-row h-full">
                    <PhoneIcon width={24} height={24} color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
                  </View>
                </TouchableOpacity>
              );
            })}
            {contactsHelp.length === 0 && (
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>Aucun contact renseigné.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default HelpCard;
