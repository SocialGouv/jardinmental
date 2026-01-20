import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Markdown from "react-native-markdown-display";
import ArrowUpSvg from "../../assets/svg/icon/ArrowUp";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { TW_COLORS } from "@/utils/constants";
import { Typography } from "./Typography";

export interface AccordionItem {
  title: string;
  description: string; // Markdown content
}

interface AccordionProps {
  items: AccordionItem[];
}

interface AccordionItemComponentProps {
  item: AccordionItem;
  isExpanded: boolean;
  showDivider?: boolean;
  onToggle: () => void;
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({ item, isExpanded, onToggle, showDivider }) => {
  const animatedHeight = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized && contentHeight > 0) {
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? contentHeight : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, contentHeight, isInitialized]);

  const handleToggle = () => {
    onToggle();
  };

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && !isInitialized) {
      setContentHeight(height);
      setIsInitialized(true);
      // Set initial height based on expanded state
      animatedHeight.setValue(isExpanded ? height : 0);
    }
  };

  const markdownStyles = {
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: TW_COLORS.CNAM_PRIMARY_800,
      fontFamily: "SourceSans3",
    },
    heading1: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "700" as const,
      color: TW_COLORS.CNAM_PRIMARY_800,
      marginBottom: 12,
      fontFamily: "SourceSans3-Bold",
    },
    heading2: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: "700" as const,
      color: TW_COLORS.CNAM_PRIMARY_800,
      marginBottom: 8,
      fontFamily: "SourceSans3-Bold",
    },
    heading3: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "700" as const,
      color: TW_COLORS.CNAM_PRIMARY_800,
      marginBottom: 6,
      fontFamily: "SourceSans3-Bold",
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      color: TW_COLORS.CNAM_PRIMARY_800,
      marginBottom: 8,
      fontFamily: "SourceSans3",
    },
    strong: {
      fontWeight: "600" as const,
      color: TW_COLORS.CNAM_PRIMARY_800,
    },
    list_item: {
      fontSize: 16,
      lineHeight: 24,
      color: "#3D6874",
      marginBottom: 4,
      fontFamily: "SourceSans3",
    },
    bullet_list: {
      marginBottom: 8,
    },
    ordered_list: {
      marginBottom: 8,
    },
  };

  return (
    <View>
      <TouchableOpacity onPress={handleToggle} className="flex-row items-center justify-between p-4 py-4">
        <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950 flex-1 mr-3")}>{item.title}</Typography>
        <Animated.View
          style={{
            transform: [{ rotate: isExpanded ? "0deg" : "180deg" }],
          }}
        >
          <ArrowUpSvg width={20} height={20} color={TW_COLORS.CNAM_PRIMARY_900} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          height: animatedHeight,
          overflow: "hidden",
        }}
      >
        <View className={mergeClassNames("px-4 pb-4")}>
          <View>
            <Markdown style={markdownStyles}>{item.description}</Markdown>
          </View>
        </View>
      </Animated.View>

      {/* Hidden view to measure content height */}
      <View
        style={{
          position: "absolute",
          opacity: 0,
          zIndex: -1,
        }}
        onLayout={handleContentLayout}
      >
        <View className={mergeClassNames("px-4 pb-4")}>
          <View>
            <Markdown style={markdownStyles}>{item.description}</Markdown>
          </View>
        </View>
      </View>
      {showDivider && <View className="h-[1] bg-cnam-primary-300 mx-4 mt-2"></View>}
    </View>
  );
};

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <View
      className={mergeClassNames("w-full border border-gray-300 rounded-xl bg-white")}
      style={{
        shadowColor: "#0A0D125F",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4, // Android
      }}
    >
      {items.map((item, index) => (
        <AccordionItemComponent
          showDivider={index != items.length - 1}
          key={index}
          item={item}
          isExpanded={expandedItems.has(index)}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </View>
  );
};

export default Accordion;
