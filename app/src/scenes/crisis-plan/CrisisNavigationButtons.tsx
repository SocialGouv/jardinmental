import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { TW_COLORS } from "@/utils/constants";
import ChevronIcon from "@assets/svg/icon/chevron";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { LinearGradient } from "expo-linear-gradient";
import ArrowIcon from "@assets/svg/icon/Arrow";
import JMButton from "@/components/JMButton";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

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

export const CrisisNavigationButtons: React.FC<NavigationButtonsProps> = ({
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
        {/* {typeof onPrevious === "function" && (
          <JMButton
            onPress={onPrevious}
            variant="outline"
            width="fixed"
            icon={<ChevronIcon />}
            // title='<'
            className="mr-2"
            loading={loading}
          />
        )} */}
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
        <View className="flex-row items-center justify-center space-x-2">
          <JMButton
            onPress={onPrevious}
            title={""}
            width="fixed"
            loading={loading}
            disabled={nextDisabled}
            icon={
              withArrow && !nextDisabled ? (
                <View
                  style={{
                    transform: [
                      {
                        scaleX: -1,
                      },
                    ],
                  }}
                >
                  <ArrowIcon color={TW_COLORS.BRAND_25} />
                </View>
              ) : undefined
            }
            iconPosition="right"
          />
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Précédent</Text>
        </View>
        <View className="flex-row items-center justify-center space-x-2">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Suivant</Text>
          <JMButton
            onPress={onNext}
            title={""}
            width="fixed"
            loading={loading}
            disabled={nextDisabled}
            icon={withArrow && !nextDisabled ? <ArrowIcon color={TW_COLORS.BRAND_25} /> : undefined}
            iconPosition="right"
          />
        </View>
      </View>
    </>
  );
  if (absolute) {
    return (
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        className={`p-6 px-4 pb-5`}
        locations={[0, 0.3]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {content}
      </LinearGradient>
    );
  }
  return <View className={`p-6 px-6`}>{content}</View>;
};

export default CrisisNavigationButtons;
