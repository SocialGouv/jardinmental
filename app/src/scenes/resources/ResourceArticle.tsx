import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Resource } from "./data/resources";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import { EXTERNAL_RESOURCES_DATA, ExternalResource } from "./data/resourcesExternal";
import ExternalResourceCard from "./ExternalResourceCard";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { Typography } from "@/components/Typography";

interface ResourceArticleProps {
  navigation: any;
  route: {
    params: {
      resource: Resource;
    };
  };
}

const ResourceArticle: React.FC<ResourceArticleProps> = ({ navigation, route }) => {
  const { resource } = route.params;

  useEffect(() => {
    const componentStartTime = Date.now();
    return () => {
      const endTime = Date.now();
      const timeSpentSeconds = Math.round((endTime - componentStartTime) / 1000);
      logEvents.logResourceArticleTimeSpentId(resource.matomoId);
      logEvents.logResourceArticleTimeSpentSeconds(timeSpentSeconds);
    };
  }, [resource.matomoId]);

  const handleContinueReadingMore = async (item: ExternalResource) => {
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

  const getExternalResource = (id: string) => {
    return EXTERNAL_RESOURCES_DATA.find((item) => item.id === id);
  };

  const getP1Resources = (): ExternalResource[] => {
    if (!resource.externalResources) return [];
    return resource.externalResources
      .map((id) => getExternalResource(id))
      .filter((res): res is ExternalResource => res !== undefined && res.category === "P1 - A lire dans ce dossier");
  };

  const getP2Resources = (): ExternalResource[] => {
    if (!resource.externalResources) return [];
    return resource.externalResources
      .map((id) => getExternalResource(id))
      .filter((res): res is ExternalResource => res !== undefined && res.category === "P2 - Explorer d'autres ressources");
  };

  const handleExploreMoreResources = () => {
    const p2ResourceIds = getP2Resources().map((res) => res.id);
    navigation.navigate("resource-external-resources", { resourceIds: p2ResourceIds });
  };

  const p1Resources = getP1Resources();
  const p2Resources = getP2Resources();

  return (
    <AnimatedHeaderScrollScreen
      title={resource.category}
      headerTitle="Dossier"
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
    >
      <View className="flex-1">
        <View className="px-5">
          {resource.image ? (
            <View className="mb-6 mt-9">
              <Image source={resource.image} className="w-full h-[200px] rounded-2xl mb-2" resizeMode="cover" />
            </View>
          ) : (
            <View className="mb-12" />
          )}
          <Typography className="text-2xl font-bold text-cnam-primary-950 mb-5 leading-7 text-left">{resource.title}</Typography>

          <MarkdownStyled markdown={resource.content} />

          {/* P1 Resources - À lire aussi dans ce dossier */}
          {p1Resources.length > 0 && (
            <View className="mt-8 pt-4">
              <Typography className="text-lg text-cnam-primary-950 font-semibold mb-4">À lire dans ce dossier :</Typography>
              <View className="flex flex-col">
                {p1Resources.map((externalResource) => (
                  <ExternalResourceCard key={externalResource.id} externalResource={externalResource} onPress={handleContinueReadingMore} />
                ))}
              </View>
            </View>
          )}

          {/* P2 Resources - Poursuivre la découverte du sujet */}
          {p2Resources.length > 0 && (
            <View className="mt-8 pt-4">
              <Typography className="text-lg text-cnam-primary-950 font-normal mb-4">Poursuivre la découverte du sujet :</Typography>
              <TouchableOpacity
                onPress={handleExploreMoreResources}
                className="bg-cnam-primary-800 rounded-[20px] px-4 py-2.5 flex flex-row items-center justify-center"
              >
                <Typography className="text-white font-semibold text-base mr-2">Explorer {p2Resources.length} ressources</Typography>
                <ArrowIcon width={18} height={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceArticle;
