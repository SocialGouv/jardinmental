import React from "react";
import { TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle, Text, ActivityIndicator, View } from "react-native";
import { mergeClassNames } from "@/utils/className";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { SquircleButton } from "expo-squircle-view";
import { TW_COLORS } from "@/utils/constants";

type ButtonProps = TouchableOpacityProps & {
  variant?: "primary" | "secondary" | "outline" | "text" | "secondary-blue";
  className?: string;
  style?: StyleProp<ViewStyle>;
  textClassName?: string;
  title?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: JSX.Element;
  iconPosition?: "right" | "left";
  size?: "small" | "medium" | "large";
  width?: "full" | "fixed" | "adapt";
  iconSize?: number;
};

export default function JMButton({
  variant = "primary",
  size = "medium",
  width = "full",
  className = "",
  style,
  textClassName = "",
  title,
  children,
  disabled = false,
  loading = false,
  iconPosition = "left",
  iconSize,
  icon,
  ...props
}: ButtonProps) {
  const heightMap: Record<"small" | "medium" | "large", number> = {
    small: 32,
    large: 52,
    medium: 48,
  };

  const paddingMap: Record<"small" | "medium" | "large", string> = {
    small: "px-3 ",
    large: "px-6 ",
    medium: "px-5 ",
  };

  const textSizeMap: Record<"small" | "medium" | "large", string> = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const classMap: Record<"full" | "adapt" | "fixed", string> = {
    full: "w-full",
    adapt: "flex-1", // the button should be in a row
    fixed: "",
  };

  const baseClasses = `${classMap[width]} ${paddingMap[size]} rounded-3xl items-center justify-center flex-row`;
  let variantClasses = "";
  let borderStyle: ViewStyle | null = null;

  switch (variant) {
    case "primary":
      variantClasses = "bg-cnam-primary-800";
      break;
    case "secondary":
      variantClasses = "bg-gray-500";
      break;
    case "secondary-blue":
      variantClasses = "bg-[#006386]"; // TODO: trouver où on doit mettre cette couleur
      break;
    case "outline":
      variantClasses = "bg-white";
      if (!disabled) {
        borderStyle = {
          borderColor: TW_COLORS.PRIMARY,
          borderWidth: 1,
        };
      } else {
        borderStyle = {
          borderColor: TW_COLORS.GRAY_200,
        };
      }
      break;
    case "text":
      variantClasses = "bg-transparent";
      break;
  }

  let disabledClasses = disabled || loading ? "bg-[#EFF1F5]" : "";
  if (variant === "outline" && disabled) {
    disabledClasses = "bg-[#FCFCFD]";
  }
  const finalClassName = mergeClassNames(baseClasses, variantClasses, disabledClasses, className);

  let textColor = "text-white";
  if (variant === "outline") textColor = "text-primary";
  if (variant === "secondary") textColor = "text-black";
  if (variant === "text") textColor = "text-cnam-primary-800";
  if (disabled || loading) textColor = "text-gray-800";
  if (disabled && variant === "outline") textColor = "text-gray-600";

  const styledIcon = icon
    ? React.cloneElement(icon, {
        width: iconSize || 15,
        height: iconSize || 15,
        styleContainer: {
          ...(icon.props?.styleContainer || {}),
          width: iconSize || 15,
          height: iconSize || 15,
        },
      })
    : null;
  return (
    <SquircleButton
      cornerSmoothing={100}
      preserveSmoothing={true}
      className={finalClassName}
      style={[{ height: heightMap[size], borderRadius: 20 }, style, borderStyle]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ActivityIndicator size="small" color={variant === "outline" || variant === "text" ? "#3D6874" : "#fff"} className="mr-2" />}
      {!loading && styledIcon && iconPosition === "left" && (
        <View className={mergeClassNames(!!(children ?? title) ? `mr-2` : "")}>{styledIcon}</View>
      )}
      {!!(children || title) && <Text className={mergeClassNames("font-semibold", textSizeMap[size], textColor, textClassName)}>{title}</Text>}
      {!loading && icon && iconPosition === "right" && <View className={!!(children ?? title) ? `ml-2 ` : ""}>{icon}</View>}
    </SquircleButton>
  );
}
