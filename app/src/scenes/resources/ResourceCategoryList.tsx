import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import ResourceCard from "./ResourceCard";
import { Resource, RESOURCES_DATA } from "./data/resources";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import localStorage from "@/utils/localStorage";

interface ResourceCategoryListProps {
  navigation: any;
  route: {
    params: {
      category: string;
    };
  };
}

const ResourceCategoryList: React.FC<ResourceCategoryListProps> = ({ navigation, route }) => {
  const { category } = route.params;
  const scrollPositionRef = useRef(0);

  // Filter resources by category
  const categoryResources = RESOURCES_DATA.filter((resource) => resource.category === category);

  // Group resources by subcategory
  const DEFAULT_SUBCATEGORY = "Sommaire";
  const groupedResources = categoryResources.reduce((acc, resource) => {
    const subCategory = resource.subCategory || DEFAULT_SUBCATEGORY;
    if (!acc[subCategory]) {
      acc[subCategory] = [];
    }
    acc[subCategory].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  // Sort sections to ensure "Sommaire" comes first
  const sortedSections = Object.entries(groupedResources).sort(([a], [b]) => {
    if (a === DEFAULT_SUBCATEGORY) return -1;
    if (b === DEFAULT_SUBCATEGORY) return 1;
    return a.localeCompare(b);
  });

  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await localStorage.getViewedResources();
        setReadIds(ids);
      } catch (error) {
        console.error("Failed to load viewed resources:", error);
        setReadIds([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Log when user arrives on the articles list
    logEvents.logViewedArticlesList(categoryResources.length);
  }, [categoryResources.length, category]);

  const handleResourcePress = async (resource: Resource, position: number) => {
    logEvents.logResourceArticleSelected(resource.matomoId);
    logEvents.logResourceArticleSelectedPosition(position);
    try {
      const updated = await localStorage.addViewedResource(resource.id);
      setReadIds(updated);
    } catch (error) {
      console.error("Failed to add viewed resource:", error);
    }
    navigation.navigate("resource-article", { resource });
  };

  const handleScrollPositionChange = (position: number) => {
    scrollPositionRef.current = position;
  };

  return (
    <AnimatedHeaderScrollScreen
      title={category}
      headerTitle="Ressources"
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
      preserveScrollOnBlur={true}
      onScrollPositionChange={handleScrollPositionChange}
      initialScrollPosition={scrollPositionRef.current}
    >
      <View className="flex-1">
        <View className="px-4 mt-4">
          {sortedSections.map(([subCategory, resources]) => {
            const sectionStartIndex = sortedSections
              .slice(
                0,
                sortedSections.findIndex(([name]) => name === subCategory)
              )
              .reduce((acc, [, sectionResources]) => acc + sectionResources.length, 0);

            return (
              <View key={subCategory} className="mb-6">
                <Text className="text-xl font-semibold text-cnam-primary-950 mb-3" accessibilityRole="header" accessibilityLevel={2}>
                  {subCategory}
                </Text>
                {resources.map((resource, localIndex) => {
                  const globalPosition = sectionStartIndex + localIndex + 1;
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onPress={() => handleResourcePress(resource, globalPosition)}
                      read={readIds.includes(resource.id)}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceCategoryList;
