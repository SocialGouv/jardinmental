import React, { useEffect, useState } from "react";
import { View } from "react-native";
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

  // Filter resources by category
  const categoryResources = RESOURCES_DATA.filter((resource) => resource.category === category);

  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const ids = await localStorage.getViewedResources();
      setReadIds(ids);
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
    const updated = await localStorage.addViewedResource(resource.id);
    setReadIds(updated);
    navigation.navigate("resource-article", { resource });
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
    >
      <View className="flex-1">
        <View className="px-4 mt-4">
          {categoryResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onPress={() => handleResourcePress(resource, index + 1)}
              read={readIds.includes(resource.id)}
            />
          ))}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceCategoryList;
