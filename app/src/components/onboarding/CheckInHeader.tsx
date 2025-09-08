import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import ChevronIcon from "@assets/svg/icon/chevron";
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface CheckInHeaderProps {
  title: string;
  onPrevious?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  skipText?: string;
  animatedTextColor?: Animated.AnimateStyle<ViewStyle> | ViewStyle;
  leftComponent?: ReactNode; // custom left component, used in shared header
  rightComponent?: ReactNode; // custom right component, used in shared header
  rightAction?: () => void;
  leftAction?: () => void;
  dynamicTitle?: string; // dynamic title that replaces original title on scroll
  headerTitleStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for original title
  dynamicTitleStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for dynamic title
}

const CheckInHeader: React.FC<CheckInHeaderProps> = ({
  title,
  onPrevious,
  onSkip,
  showSkip = false,
  skipText = "Passer",
  animatedTextColor,
  leftAction,
  leftComponent,
  rightAction,
  rightComponent,
  dynamicTitle,
  headerTitleStyle,
  dynamicTitleStyle,
}) => {
  const headerHeight = 48; // 👈 fixed height ensures proper alignment
  return (
    <View
      className={"mx-4"}
      style={{
        height: headerHeight,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1001,
      }}
    >
      {/* Bouton Précédent */}
      {!!(leftAction || onPrevious) ? (
        <TouchableOpacity
          onPress={leftAction || onPrevious}
          className="px-3 py-2 rounded-lg"
          style={{
            position: "absolute",
            left: 0,
            // left: horizontalPadding,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <Animated.Text className="text-base font-medium" style={[{ color: TW_COLORS.WHITE }, animatedTextColor]}>
            {leftComponent ? leftComponent : <ChevronIcon color={TW_COLORS.WHITE} />}
          </Animated.Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            position: "absolute",
            left: 0,
            width: 48,
            height: headerHeight,
          }}
        />
      )}

      {/* Titre centré */}
      <View style={{ position: "relative", justifyContent: "center", alignItems: "center" }}>
        {/* Original title */}
        <Animated.Text
          numberOfLines={2}
          className={mergeClassNames(typography.textMdRegular, "text-center")}
          style={[{ color: TW_COLORS.WHITE, position: "absolute" }, animatedTextColor, headerTitleStyle]}
        >
          {title}
        </Animated.Text>

        {/* Dynamic title that appears on scroll */}
        {dynamicTitle && (
          <Animated.Text
            numberOfLines={2}
            // Apply padding when text is long and skip button is present to prevent overlap
            // Constants should be extracted and made responsive to actual button dimensions
            className={`text-base text-center ${dynamicTitle.length > 28 && showSkip && onSkip ? "pl-12 pr-14" : ""}`}
            style={[{ color: TW_COLORS.WHITE, position: "absolute" }, animatedTextColor, dynamicTitleStyle]}
          >
            {dynamicTitle}
          </Animated.Text>
        )}
      </View>

      {/* Bouton Passer */}
      {(showSkip && onSkip) || rightComponent ? (
        rightComponent ? (
          <TouchableOpacity
            onPress={rightAction}
            className="px-3 py-2 rounded-lg"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            {rightComponent}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSkip}
            className="px-3 py-2 rounded-lg"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <Animated.Text className="text-base" style={[{ color: TW_COLORS.WHITE }, animatedTextColor]}>
              {skipText}
            </Animated.Text>
          </TouchableOpacity>
        )
      ) : (
        <View
          style={{
            position: "absolute",
            right: 0,
            width: 48,
            height: headerHeight,
          }}
        />
      )}
    </View>
  );
};

export default CheckInHeader;
