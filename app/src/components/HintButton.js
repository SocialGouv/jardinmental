import { Text, View } from "react-native";

export const HintButton = ({}) => {
  return (
    <View>
      <View>
        {title && <Text>{title}</Text>}
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    </View>
  );
};
