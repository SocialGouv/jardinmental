import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Resource } from "./data/resources";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import { EXTERNAL_RESOURCES_DATA, ExternalResource } from "./data/resourcesExternal";
import BookOpenIcon from "../../../assets/svg/icon/BookOpen";
import LinkExternalIcon from "../../../assets/svg/icon/LinkExternal";

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
          {resource.image ? (
            <View className="mb-6 mt-9">
              <Image source={resource.image} className="w-full h-[200px] rounded-2xl mb-2" resizeMode="cover" />
            </View>
          ) : (
            <View className="mb-12" />
          )}
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
                      <View className="rounded-xl flex flex-row border border-cnam-primary-200 bg-white shadow-sm">
                        <View className="bg-cnam-cyan-lighten-90 rounded-l-xl flex items-center justify-center w-20">
                          <BookOpenIcon color="#3D6874" width={20} height={20} />
                          <Text className="text-xs text-cnam-primary-900 font-medium py-1 rounded font-source-sans">{externalResource.type}</Text>
                        </View>
                        <View className="flex-1">
                          <View className="p-4">
                            <Text className="text-base font-semibold text-cnam-primary-950 mb-1 font-source-sans leading-tight">
                              {externalResource.title}
                            </Text>
                          </View>
                          <View className="flex flex-row px-2 pb-4 items-center">
                            <View className="flex-1">
                              <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm text-gray-500">
                                {externalResource.author}
                              </Text>
                            </View>
                            <View className="flex flex-row items-center text-cnam-primary-950">
                              <Text className="mr-2">Lire l'article</Text>
                              <LinkExternalIcon color="#518B9A" width={18} height={18} />
                            </View>
                          </View>
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
