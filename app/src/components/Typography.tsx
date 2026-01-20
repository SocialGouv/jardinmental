import React from "react";
import { Text, TextProps } from "react-native";
import { styled } from "nativewind";

const fontFamilyMap: Record<string, string> = {
  "font-bold": "SourceSans3-Bold",
  "font-semibold": "SourceSans3-SemiBold",
  "font-medium": "SourceSans3-Medium",
  "font-light": "SourceSans3-Light",
  "font-normal": "SourceSans3-Regular",
};

type TypographyProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

export function Typography({ className = "", style, children, ...props }: TypographyProps) {
  let fontFamily = fontFamilyMap["font-normal"];

  // Vérifier si style est un tableau ou un objet unique
  if (style) {
    const styles = Array.isArray(style) ? style : [style];

    for (const s of styles) {
      if (s && typeof s === "object" && "fontWeight" in s && s.fontWeight) {
        switch (s.fontWeight) {
          case "bold":
          case "700":
            fontFamily = fontFamilyMap["font-bold"];
            break;
          case "600":
          case "semibold":
            fontFamily = fontFamilyMap["font-semibold"];
            break;
          case "500":
          case "medium":
            fontFamily = fontFamilyMap["font-medium"];
            break;
          case "300":
          case "light":
            fontFamily = fontFamilyMap["font-light"];
            break;
          case "normal":
          default:
            fontFamily = fontFamilyMap["font-normal"];
        }
        break;
      }
    }
  }

  return (
    <Text className={className} style={[style, { fontFamily }]} {...props}>
      {children}
    </Text>
  );
}
