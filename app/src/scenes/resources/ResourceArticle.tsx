import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Resource } from "./data/resources";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";
import logEvents from "../../services/logEvents";
import { EXTERNAL_RESOURCES_DATA, ExternalResource, ExternalResourceType } from "./data/resourcesExternal";
import BookOpenIcon from "../../../assets/svg/icon/BookOpen";
import LinkExternalIcon from "../../../assets/svg/icon/LinkExternal";
import PlayCircleIcon from "../../../assets/svg/icon/PlayCircle";
import HeadphonesIcon from "../../../assets/svg/icon/Headphones";
import InstagramIcon from "../../../assets/svg/icon/Instagram";
import FilmIcon from "../../../assets/svg/icon/Film";
import LinkIcon from "../../../assets/svg/icon/Link";
import BriefcaseIcon from "../../../assets/svg/icon/Briefcase";

interface ResourceArticleProps {
  navigation: any;
  route: {
    params: {
      resource: Resource;
    };
  };
}

function textByType(type: ExternalResourceType) {
  switch (type) {
    case "Article":
      return "Lire l'article";
    case "Vidéo":
      return "Regarder la vidéo";
    case "Podcast":
      return "Écouter le podcast";
    case "Guide":
      return "Découvrir le guide";
    case "Instagram":
      return "Voir sur Instagram";
    case "Site":
      return "Visiter le site";
    case "Fiche pratique":
      return "Voir la fiche pratique";
    case "Série":
      return "Voir le documentaire";
    case "BD":
      return "Découvrir la BD";
    case "Livre":
      return "Découvrir le livre";
    case "Questionnaire":
      return "Voir le questionnaire";
    case "Outils":
      return "Découvrir";
  }
}

function ExternalResourceIcon({ type }: { type: ExternalResourceType }) {
  switch (type) {
    case "Article":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Vidéo":
      return <PlayCircleIcon color="#3D6874" width={20} height={20} />;
    case "Podcast":
      return <HeadphonesIcon color="#3D6874" width={20} height={20} />;
    case "Guide":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Instagram":
      return <InstagramIcon color="#3D6874" width={20} height={20} />;
    case "Site":
      return <LinkIcon strokeColor="#3D6874" size={20} />;
    case "Fiche pratique":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Série":
      return <FilmIcon color="#3D6874" width={20} height={20} />;
    case "BD":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Livre":
      return <BookOpenIcon color="#3D6874" width={20} height={20} />;
    case "Questionnaire":
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
    case "Outils":
      return <BriefcaseIcon color="#3D6874" width={20} height={20} />;
  }
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
          <Text className="text-2xl font-bold text-cnam-primary-950 mb-5 leading-7 text-left">{resource.title}</Text>

          <MarkdownStyled markdown={resource.content} />

          {resource.externalResources ? (
            <View className="mt-8 pt-4">
              <Text className="text-lg text-cnam-primary-950 font-semibold mb-4">À lire aussi dans ce dossier</Text>
              <View className="flex flex-col gap-4">
                {resource.externalResources?.map((item) => {
                  const externalResource = getExternalResource(item);
                  if (!externalResource) {
                    return null;
                  }
                  return (
                    <TouchableOpacity onPress={() => handleContinueReadingMore(externalResource)} key={externalResource.id}>
                      <View className="rounded-2xl flex flex-row border-2 border-cnam-primary-400 bg-white min-h-[112px]">
                        <View className="bg-cnam-cyan-lighten-90 rounded-l-2xl flex items-center justify-center w-20">
                          <ExternalResourceIcon type={externalResource.type} />
                          <Text className="text-xs text-cnam-primary-900 font-medium pt-1 rounded">{externalResource.type}</Text>
                        </View>
                        <View className="flex-1 flex">
                          <View className="p-4 grow">
                            <Text className="text-base font-semibold text-cnam-primary-950">{externalResource.title}</Text>
                          </View>
                          <View className="flex flex-row px-2 pb-4 items-center gap-1">
                            <View className="flex-1">
                              <Text numberOfLines={1} ellipsizeMode="tail" className="text-xs text-gray-500">
                                {externalResource.author}
                              </Text>
                            </View>
                            <View className="flex flex-row items-center">
                              <Text className="mr-2 text-cnam-primary-950 font-semibold">{textByType(externalResource.type)}</Text>
                              <LinkExternalIcon width={18} height={18} />
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
