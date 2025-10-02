import React from "react";
import ResourceCategories from "./ResourceCategories";

interface ResourcesProps {
  navigation: any;
}

const Resources: React.FC<ResourcesProps> = ({ navigation }) => {
  return <ResourceCategories navigation={navigation} />;
};

export default Resources;
