import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import ChevronIcon from "@assets/svg/icon/chevron";
import PhoneIcon from "@assets/svg/icon/Phone";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import User from "@assets/svg/icon/User";
import PlusIcon from "@assets/svg/icon/plus";
import { Typography } from "@/components/Typography";

type ChangeIdeasCardProps = {
  addElement: () => void;
  contactsChangeIdeas: {
    name: string;
    activities?: string[];
    phoneNumbers: [
      {
        digits: string;
        number: string;
      }
    ];
  }[];
};

const ChangeIdeasCard: React.FC<ChangeIdeasCardProps> = ({ contactsChangeIdeas, addElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter contacts to only those with a valid phone number
  const filteredContacts = contactsChangeIdeas?.filter(
    (item) => item.phoneNumbers && item.phoneNumbers.length > 0 && (item.phoneNumbers[0].number || item.phoneNumbers[0].digits)
  );

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
        borderColor: "#99DBF2",
      }}
    >
      <TouchableOpacity onPress={() => setIsOpen((v) => !v)} className=" flex-column space-y-4" disabled={!filteredContacts.length}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Typography
              className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 p-1 px-3 rounded mr-2")}
              style={{
                backgroundColor: "#CCEDF9",
              }}
            >
              3
            </Typography>
            <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Se changer les idées</Typography>
          </View>
          {!!filteredContacts.length && (
            <View className="mr-2">
              <ChevronIcon width={14} height={14} direction={isOpen ? "down" : "up"} strokeWidth={2} />
            </View>
          )}
        </View>
        {!!filteredContacts.length && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>
            Les proches que vous pouvez contacter et les activités que vous pouvez faire ensemble pour vous changer les idées :
          </Typography>
        )}
        {filteredContacts.length === 0 && (
          <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700")}>Aucun élément pour le moment.</Typography>
        )}
        {!filteredContacts.length && (
          <TouchableOpacity className="flex-row items-center space-x-1" onPress={addElement}>
            <PlusIcon color={TW_COLORS.CNAM_PRIMARY_700} />{" "}
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>Ajouter un élément</Typography>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isOpen && (
        <View className="flex-colmun">
          <View className="flex-colmun space-y-2">
            {filteredContacts?.map((item, idx) => {
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
                      <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{item.name}</Typography>
                      <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
                        {item.activities?.join(", ") || "Aucune activitée n'a encore été renseignée"}
                      </Typography>
                    </View>
                  </View>
                  <View className="items-center flex-row h-full">
                    <PhoneIcon width={24} height={24} color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default ChangeIdeasCard;
