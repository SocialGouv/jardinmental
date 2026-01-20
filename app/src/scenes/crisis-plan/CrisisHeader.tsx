import { Typography } from "@/components/Typography";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import CrossIcon from "@assets/svg/icon/Cross";
import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row justify-between w-full bg-cnam-primary-800 p-4 items-center" style={{ paddingTop: insets.top + 20 }}>
      <View className="flex-column">
        <Typography className={mergeClassNames(typography.displayXsBold, "text-white")}>{title}</Typography>
        {description && (
          <View className="flex-row">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-white text-left")}>Par </Typography>
            <Typography className={mergeClassNames(typography.textMdRegular, "text-white text-left italic")}>{description}</Typography>
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
        className="w-16 justify-end flex-row items-center"
      >
        <CrossIcon color={"white"} width={25} height={25} strokeWidth={1.2} />
      </TouchableOpacity>
    </View>
  );
};
