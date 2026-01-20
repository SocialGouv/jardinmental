import React from "react";
import { Text, TextProps } from "react-native";
import { styled } from "nativewind";

const fontFamilyMap: Record<string, string> = {
  "font-bold": "SourceSans3-Bold",
  "font-bold-italic": "SourceSans3-BoldItalic",
  "font-semibold": "SourceSans3-SemiBold",
  "font-semibold-italic": "SourceSans3-SemiBoldItalic",
  "font-medium": "SourceSans3-Medium",
  "font-medium-italic": "SourceSans3-MediumItalic",
  "font-light": "SourceSans3-Light",
  "font-light-italic": "SourceSans3-LightItalic",
  "font-normal": "SourceSans3-Regular",
  "font-normal-italic": "SourceSans3-Italic",
  "font-extralight": "SourceSans3-ExtraLight",
  "font-extralight-italic": "SourceSans3-ExtraLightItalic",
  "font-extrabold": "SourceSans3-ExtraBold",
  "font-extrabold-italic": "SourceSans3-ExtraBoldItalic",
};

type TypographyProps = TextProps & {
  className?: string;
  children?: React.ReactNode;
};

export function Typography({ className = "", style, children, ...props }: TypographyProps) {
  // Détection du fontWeight et fontStyle
  let fontWeight: string = "normal";
  let fontStyle: string = "normal";

  if (style) {
    const styles = Array.isArray(style) ? style : [style];
    for (const s of styles) {
      if (s && typeof s === "object") {
        if ("fontWeight" in s && s.fontWeight) {
          switch (s.fontWeight) {
            case "bold":
            case "700":
              fontWeight = "bold";
              break;
            case "600":
            case "semibold":
              fontWeight = "semibold";
              break;
            case "500":
            case "medium":
              fontWeight = "medium";
              break;
            case "300":
            case "light":
              fontWeight = "light";
              break;
            case "200":
              fontWeight = "extralight";
              break;
            case "800":
              fontWeight = "extrabold";
              break;
            case "normal":
              fontWeight = "normal";
              break;
            default:
              fontWeight = "normal";
          }
        }
      }
    }
  }

  // Construction de la clé pour le mapping
  let fontKey = `font-${fontWeight}`;
  let fontFamily = fontFamilyMap[fontKey] || fontFamilyMap["font-normal"];

  return (
    <Text className={className} style={[style, { fontFamily }]} {...props}>
      {children}
    </Text>
  );
}
