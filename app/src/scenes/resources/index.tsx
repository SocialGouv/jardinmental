import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/components/Header";
import ResourceCard from "./ResourceCard";
import { Resource, RESOURCES_DATA } from "./data/resources";
import logEvents from "@/services/logEvents";
import { TAB_BAR_HEIGHT } from "@/utils/constants";

interface ResourcesProps {
  navigation: any;
}

const Resources: React.FC<ResourcesProps> = ({ navigation }) => {
  const handleResourcePress = (resource: Resource, position: number) => {
    logEvents.logResourceArticleSelected(resource.matomoId);
    logEvents.logResourceArticleSelectedPosition(position);
    navigation.navigate("resource-article", { resource });
  };
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <View className="bg-cnam-primary-800 flex flew-row justify-between p-[5px] pb-0">
        <Header title="Ressources" navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="p-4">
          {RESOURCES_DATA.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} onPress={() => handleResourcePress(resource, index + 1)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Resources;
