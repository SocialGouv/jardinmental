import React from "react";
import { View, Linking, Text } from "react-native";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import { EXTERNAL_RESOURCES_DATA, ExternalResource } from "./data/resourcesExternal";
import ExternalResourceCard from "./ExternalResourceCard";

interface ExternalResourcesScreenProps {
  navigation: any;
  route: {
    params: {
      resourceIds: string[];
    };
  };
}

const ExternalResourcesScreen: React.FC<ExternalResourcesScreenProps> = ({ navigation, route }) => {
  const { resourceIds } = route.params;

  const handleOpenExternalResource = async (item: ExternalResource) => {
    if (item.url) {
      try {
        // Log external link click before opening
        logEvents.logResourceOpenedExternalLink(item.matomoId);
        await Linking.openURL(item.url);
      } catch (error) {
        console.error("Failed to open URL:", error);
      }
    }
  };

  // Get P2 resources for this resource category
  const p2Resources = EXTERNAL_RESOURCES_DATA.filter(
    (resource) => resource.category === "P2 - Explorer d'autres ressources" && resourceIds.includes(resource.id)
  );

  return (
    <AnimatedHeaderScrollScreen
      title="Ressources complémentaires"
      headerTitle="Ressources"
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
    >
      <View className="flex-1 px-5">
        <View className="flex flex-col mt-4">
          {p2Resources.map((externalResource) => (
            <ExternalResourceCard key={externalResource.id} externalResource={externalResource} onPress={handleOpenExternalResource} />
          ))}
          {p2Resources.length === 0 && (
            <View className="flex flex-col">
              <Text className="text-cnam-primary-950 font-normal">Aucune ressource trouvée</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ExternalResourcesScreen;
