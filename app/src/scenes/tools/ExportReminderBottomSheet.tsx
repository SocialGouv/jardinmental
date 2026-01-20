import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Button from "@/components/Button";
import { Typography } from "@/components/Typography";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import localStorage from "@/utils/localStorage";

type Props = {
  onExport: () => void;
  onRemindLater: () => void;
};

const ExportReminderBottomSheet: React.FC<Props> = ({ onExport, onRemindLater }) => {
  const [lastExportDate, setLastExportDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchExportDate = async () => {
      const date = await localStorage.getLastExportDate();
      setLastExportDate(date);
    };
    fetchExportDate();
  }, []);

  // Format date to "12 janvier 2026"
  const getFormattedDate = (isoDate: string) => {
    try {
      const dateObj = new Date(isoDate);
      return dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 0, minHeight: "100%" }}
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: 20,
          }}
        >
          <View className="p-4 flex-col space-y-4">
            <Typography className={mergeClassNames(typography.textXlBold, "text-cnam-primary-950")}>
              Pensez à sauvegarder vos données régulièrement
            </Typography>
            {lastExportDate && (
              <View
                className="flex-row self-start border rounded-full pr-[10px] pt-[2px] pb-[2px] pl-2 mb-4"
                style={{
                  backgroundColor: "#FCE8F2",
                  borderColor: "#F9D1E6E6",
                }}
              >
                <Typography
                  style={{
                    color: "#C11574",
                  }}
                >
                  Dernier export : {getFormattedDate(lastExportDate)}
                </Typography>
              </View>
            )}
            <Typography className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>
              Vous avez un suivi précieux dans l’app.
            </Typography>
            <Typography className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>
              Selon les réglages de votre téléphone des données peuvent être perdues.
            </Typography>
            <Typography className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950 mb-4")}>
              Exporter régulièrement vos données permet de les conserver.
            </Typography>
            <JMButton title="Exporter mon suivi" onPress={onExport} />
            <JMButton title="Me le rappeler plus tard" className="mb-4" onPress={onRemindLater} variant="text" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ExportReminderBottomSheet;
