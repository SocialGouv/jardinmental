import React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import Header from "../../components/Header";
import ResourceCard from "./ResourceCard";
import { Resource, RESOURCES_DATA } from "./data/resources";
interface ResourcesProps {
  navigation: any;
}

const Resources: React.FC<ResourcesProps> = ({ navigation }) => {
  const handleResourcePress = (resource: Resource) => {
    navigation.navigate("resource-article", { resource });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-cnam-primary-800 flex flew-row justify-between p-[5px] pb-0">
        <Header title="Ressources" navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        className="bg-cnam-primary-50 flex-1"
      >
        <View className="p-4">
          {RESOURCES_DATA.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onPress={() => handleResourcePress(resource)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Resources;
