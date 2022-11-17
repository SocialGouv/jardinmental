import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const HintButton = ({ title, subtitle, onPress, disabled, testID }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={testID}>
        <View>
          <View>
            {title && <Text>{title}</Text>}
            {subtitle && <Text>{subtitle}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
