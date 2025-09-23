import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React from "react";
import { Text, View } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import { SquircleButton } from "expo-squircle-view";
import PhoneIcon from "@assets/svg/icon/Phone";
import Accordion from "@/components/Accordion";
import MessageHeartCircleIcon from "@assets/svg/icon/MessageHeartCircle";
import colors from "tailwindcss/colors";

export default function FaqMainScreen({ navigation, route }) {
  return (
    <AnimatedHeaderScrollScreen
      title={"Soutien 24h/24 - 7J/7"}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      showBottomButton={false}
      navigation={navigation}
    >
      <View className="bg-gray-50 flex-1 p-4 flex-col space-y-12 pt-10">
        <View className="flex-col space-y-6">
          <View className="flex-row items-center">
            <MessageHeartCircleIcon width={"24"} height={"24"} color={TW_COLORS.CNAM_PRIMARY_800} />
            <Text className={mergeClassNames(typography.textXlSemibold, "ml-2 text-cnam-primary-950 text-left")}>Urgence Immédiate</Text>
          </View>
          <View className="flex-col space-y-5">
            <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
              Si vous êtes en détresse, appelez le 3114 (24h/24, 7j/7, appel gratuit).
            </Text>
            <SquircleButton
              style={{
                borderRadius: 20,
              }}
              preserveSmoothing={true}
              cornerSmoothing={100}
              className="border border-cnam-jaune-500 bg-cnam-jaune-100 h-[60] flex-row px-6 py-4 justify-content items-center mt-0"
            >
              <PhoneIcon width={24} height={24} />
              <Text className={mergeClassNames(typography.textLgSemibold, "ml-3 text-cnam-primary-900 text-left")}>Appeler le 3114</Text>
            </SquircleButton>
            <SquircleButton
              preserveSmoothing={true}
              cornerSmoothing={100}
              style={{
                borderRadius: 20,
              }}
              className="border border-cnam-primary-800 h-[60] flex-row px-6 py-4 bg-white justify-content items-center"
            >
              <PhoneIcon width={24} height={24} />
              <Text className={mergeClassNames(typography.textLgSemibold, "ml-3 text-cnam-primary-900 text-left")}>Écrire au 114 par SMS</Text>
            </SquircleButton>
          </View>
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
}
