import React from "react";
import { View, SafeAreaView, ScrollView, Text, Image, TouchableOpacity, Linking } from "react-native";
import BackButton from "../../components/BackButton";
import { Resource } from "./index";
import MarkdownStyled from "./MarkdownStyled";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TW_COLORS } from "@/utils/constants";

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

  const handleContinueReading = async () => {
    if (!resource.nextContent) {
      return;
    }
    if (resource.nextContent.url) {
      try {
        await Linking.openURL(resource.nextContent.url);
      } catch (error) {
        console.error("Failed to open URL:", error);
      }
    }
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
          <View className="mb-6">
            <Image source={resource.image} className="w-full h-[200px] rounded-2xl mb-2" resizeMode="cover" />
          </View>
          <Text className="text-2xl font-bold text-cnam-primary-950 mb-5 font-source-sans leading-7 text-left">{resource.content.title}</Text>

          <MarkdownStyled markdown={resource.content.markdown} />

          {resource.nextContent ? (
            <View className="mt-8 pt-4">
              <Text className="text-lg text-cnam-primary-950 font-semibold mb-4 font-source-sans">Continuer la lecture</Text>

              <TouchableOpacity onPress={handleContinueReading}>
                <View className="rounded-xl p-4 flex-row items-center border border-cnam-primary-200 bg-white">
                  <View className="flex-1 pr-2">
                    <Text className="text-base font-semibold text-cnam-primary-950 mb-1 font-source-sans">{resource.nextContent.title}</Text>
                    <Text className="text-sm text-gray-500 font-source-sans leading-tight">{resource.nextContent.text}</Text>
                  </View>
                  <View className="justify-center items-center">
                    <Text className="text-lg text-cnam-primary-950 font-bold">→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ResourceArticle;
