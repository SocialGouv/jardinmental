import React from "react";
import { View, SafeAreaView, ScrollView, Text, Image } from "react-native";
import BackButton from "../../components/BackButton";
import { Resource } from "./index";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";

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

  return (
    <AnimatedHeaderScrollScreen
      title={resource.content.rubrique}
      headerTitle="Dossier"
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
    >
      <View className="bg-white flex-1">
        <View className="px-5">
          <View className="mb-6">
            <Image source={resource.image} className="w-full h-[200px] rounded-2xl mb-2" resizeMode="cover" />
            <Text className="text-xs text-gray-500 italic font-source-sans">{resource.content.imageCaption}</Text>
          </View>
          <Text className="text-2xl font-bold text-cnam-primary-950 mb-5 font-source-sans leading-7 text-left">{resource.content.title}</Text>

          <MarkdownStyled markdown={resource.content.markdown} />
          <View className="mt-8 pt-4">
            <Text className="text-sm text-gray-500 mb-4 font-source-sans">Contenu fourni par</Text>
            <View className="rounded-xl p-4 flex-row items-center border border-cnam-primary-200">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                <Image source={resource.content.authorIcon} className="w-full h-full rounded-full" resizeMode="cover" />
              </View>
              <View className="flex-1 pr-2">
                <Text className="text-base font-semibold text-cnam-primary-950 mb-1 font-source-sans">{resource.content.author}</Text>
                <Text className="text-sm text-gray-500 font-source-sans leading-tight">{resource.content.authorDescription}</Text>
              </View>
              <View className="justify-center items-center">
                <Text className="text-lg text-cnam-primary-950 font-bold">→</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceArticle;
