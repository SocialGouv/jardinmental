import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Resource } from "./data/resources";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import { EXTERNAL_RESOURCES_DATA, ExternalResource } from "./data/resourcesExternal";

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
          <View className="mb-6 mt-9">
            <Image source={resource.image} className="w-full h-[200px] rounded-2xl mb-2" resizeMode="cover" />
          </View>
          <Text className="text-2xl font-bold text-cnam-primary-950 mb-5 font-source-sans leading-7 text-left">{resource.title}</Text>

          <MarkdownStyled markdown={resource.content} />

          {resource.externalResources ? (
            <View className="mt-8 pt-4">
              <Text className="text-lg text-cnam-primary-950 font-semibold mb-4 font-source-sans">À lire aussi dans ce dossier</Text>
              <View className="flex flex-col gap-4">
                {resource.externalResources?.map((item) => {
                  const externalResource = getExternalResource(item);
                  if (!externalResource) {
                    return null;
                  }
                  return (
                    <TouchableOpacity onPress={() => handleContinueReadingMore(externalResource)} key={externalResource.id}>
                      <View className="rounded-xl p-4 flex-row items-center border border-cnam-primary-200 bg-white">
                        <View className="flex-1 pr-2">
                          <Text className="text-base font-semibold text-cnam-primary-950 mb-1 font-source-sans">{externalResource.title}</Text>
                          <Text className="text-sm text-gray-500 font-source-sans leading-tight">{externalResource.author}</Text>
                        </View>
                        <View className="justify-center items-center">
                          <Text className="text-lg text-cnam-primary-950 font-bold">→</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceArticle;
