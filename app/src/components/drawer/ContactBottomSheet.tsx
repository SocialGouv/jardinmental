import { View, Text, ScrollView, useWindowDimensions, Dimensions, Linking, Alert, Platform, TouchableOpacity } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import MessageHeartCircleIcon from "@assets/svg/icon/MessageHeartCircle";
import MailIcon from "@assets/svg/icon/Mail";
import NPSManager from "@/services/NPS/NPSManager";
import localStorage from "@/utils/localStorage";
import { Typography } from "../Typography";

const screenHeight = Dimensions.get("window").height;

export const ContactBottomSheet = ({ navigation }: { navigation: any }) => {
  const { closeBottomSheet } = useBottomSheet();
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{
            paddingVertical: 20,
          }}
        >
          <View className="flex-row justify-between items-center px-4">
            <Typography className={mergeClassNames(typography.textXlBold, "text-cnam-primary-950")}>À savoir avant de nous contacter</Typography>
          </View>
          <View className="p-4 flex-column flex-1 space-y-2">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-950 leading-7")}>
              Jardin Mental ne peut malheureusement pas répondre aux situations d’urgence.
            </Typography>
            <Typography className={mergeClassNames(typography.textMdRegular, "text-left text-cnam-primary-950 leading-7")}>
              Nous restons toutefois disponibles pour répondre à vos questions sur l’application.
            </Typography>
          </View>
          <View className="w-full py-6 px-6">
            <JMButton
              onPress={() => {
                closeBottomSheet();
                navigation.navigate("support");
              }}
              icon={<MessageHeartCircleIcon />}
              className="mb-2"
              title={"Trouver un soutien 24h/24 - 7j/7"}
              iconSize={20}
            />
            <JMButton
              onPress={async () => {
                closeBottomSheet();
                Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr");
              }}
              className="flex-row items-center justify-center"
              icon={<MailIcon />}
              iconSize={20}
              variant="outline"
              title={"Continuer vers le mail"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
