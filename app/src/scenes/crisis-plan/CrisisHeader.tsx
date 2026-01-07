import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrossIcon from "@assets/svg/icon/Cross";
import { View, TouchableOpacity, Text } from "react-native";

export default ({
  navigation,
  title,
  description,
  initialRouteName,
}: {
  navigation: any;
  title: string;
  description?: string;
  initialRouteName: string;
}) => {
  return (
    <View className="flex-row justify-between w-full bg-cnam-primary-800 p-4 items-center pt-20">
      <View className="flex-column">
        <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>{title}</Text>
        {description && (
          <View className="flex-row">
            <Text className={mergeClassNames(typography.textMdRegular, "text-white text-left")}>Par </Text>
            <Text className={mergeClassNames(typography.textMdRegular, "text-white text-left italic")}>{description}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (initialRouteName) {
            navigation.navigate(initialRouteName, {
              isClosing: true,
            });
          } else {
            navigation.goBack();
          }
        }}
        className="w-16 justify-end flex-row items-center absolute right-5 top-15"
      >
        <CrossIcon color={"white"} width={25} height={25} strokeWidth={1.2} />
      </TouchableOpacity>
    </View>
  );
};
