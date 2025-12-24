import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrisisHeader from "./CrisisHeader";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import BeigeCard from "../onboarding-v2/BeigeCard";
import { VARIANT_BORDER_COLORS } from "../onboarding-v2/data/carouselData";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const { width: screenWidth } = Dimensions.get("window");

export const CrisisPlanSlideFinal: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  //CNAM - secondary/Cyan (Accent)/50 lighten 90
  return (
    <View className="flex-1 bg-cnam-cyan-50-lighten-90">
      <CrisisHeader navigation={navigation} title={"Ma liste de secours"} description={"Par Hop ma liste"} />
      <BeigeCard
        style={{
          width: screenWidth,
          position: "relative",
          paddingTop: 0,
        }}
        // bottomComponent={slide.bottomComponent}
        color={VARIANT_BORDER_COLORS.blue}
      >
        <View className="absolute right-4 -z-2 bg-red">
          <Image
            style={{ width: 100, height: 100, top: -80, right: 0, resizeMode: "contain", zIndex: -1 }}
            source={require("../../../assets/imgs/onboarding/carousel/outils.png")}
          />
        </View>

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
          navigation.navigate("crisis-plan-slide-sumup-list");
        }}
        showPrevious={false}
        nextText="Ouvrir ma liste"
      />
    </View>
  );
};
