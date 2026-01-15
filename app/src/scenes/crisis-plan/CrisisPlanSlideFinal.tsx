import React, { useEffect } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrisisHeader from "./CrisisHeader";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import BeigeCard from "../onboarding-v2/BeigeCard";
import { VARIANT_BORDER_COLORS } from "../onboarding-v2/data/carouselData";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ModalCorrelationScreenProps {
  navigation: any;
  route: {
    params: {
      isEdit: boolean;
      initialRouteName?: string;
    };
  };
}

const { width: screenWidth } = Dimensions.get("window");

export const CrisisPlanSlideFinal: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  useEffect(() => {
    AsyncStorage.setItem("@CRISIS_PLAN_COMPLETED", "true");
  }, []);

  return (
    <View className="flex-1 bg-cnam-cyan-50-lighten-90">
      <CrisisHeader initialRouteName={route.params?.initialRouteName} navigation={navigation} title={"Mon plan de crise"} />
      <View className="absolute right-4">
        <Image
          style={{ width: 200, height: 200, top: 250, right: 0, resizeMode: "contain", zIndex: 0 }}
          source={require("../../../assets/imgs/CrisisPlanFinalIllu.png")}
        />
      </View>
      <BeigeCard
        style={{
          width: screenWidth,
          position: "relative",
          paddingTop: 0,
        }}
        // bottomComponent={slide.bottomComponent}
        color={VARIANT_BORDER_COLORS.blue}
      >
        <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 text-left")}>Votre liste de secours est terminée!</Text>

        {/* Description */}
        <Text
          className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left mt-10")}
          style={{
            maxWidth: screenWidth - 64,
          }}
        >
          Vous pourrez la modifier à tout moment.
        </Text>
        {/* {slide.children} */}
      </BeigeCard>
      <NavigationButtons
        absolute={true}
        onNext={() => {
          navigation.navigate("crisis-plan-slide-sumup-list", {
            initialRouteName: route.params.initialRouteName,
          });
        }}
        showPrevious={false}
        nextText="Ouvrir ma liste"
      />
    </View>
  );
};
