import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { TW_COLORS } from "@/utils/constants";
import JMButton from "../JMButton";
import ChevronIcon from "@assets/svg/icon/chevron";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import LinearGradient from "react-native-linear-gradient";
import ArrowIcon from "@assets/svg/icon/Arrow";

// Navigation Props
interface NavigationButtonsProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  showPrevious?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
  nextText?: string;
  skipText?: string;
  loading?: boolean;
  absolute?: boolean;
  onLeftAction?: () => void;
  onLeftIconAction?: JSX.Element;
  headerContent?: JSX.Element;
  withArrow?: boolean;
  children?: JSX.Element;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  nextDisabled = false,
  nextText = "Suivant",
  skipText = "Passer",
  loading = false,
  absolute = false,
  onLeftAction,
  onLeftIconAction,
  headerContent,
  withArrow,
  children,
}) => {
  const content = children ?? (
    <>
      {headerContent}
      <View className="flex-row justify-between items-center">
        {/* <View
        className="flex-row justify-between items-center p-6 px-6 bg-white/50"> */}
        {typeof onPrevious === "function" && (
          <JMButton
            onPress={onPrevious}
            variant="outline"
            width="fixed"
            icon={<ChevronIcon />}
            // title='<'
            className="mr-2"
            loading={loading}
          />
        )}
        {typeof onLeftAction === "function" && (
          <JMButton
            onPress={onLeftAction}
            variant="outline"
            width="fixed"
            icon={onLeftIconAction || <CircleQuestionMark />}
            className="mr-2"
            loading={loading}
          />
        )}

        <JMButton
          onPress={onNext}
          title={nextText}
          width="adapt"
          loading={loading}
          disabled={nextDisabled}
          icon={withArrow && !nextDisabled ? <ArrowIcon color={TW_COLORS.BRAND_25} /> : undefined}
          iconPosition="right"
        />
      </View>
    </>
  );
  if (absolute) {
    return (
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        locations={[0, 0.3]} // transition très rapide
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className={`p-6 px-4 pb-5`}
      >
        {content}
      </LinearGradient>
    );
  }
  return <View className={`p-6 px-6`}>{content}</View>;
};

export default NavigationButtons;
