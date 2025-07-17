import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

export default function ToggleButtons() {
  const [selected, setSelected] = useState(0);

  return (
    <View className="flex-row rounded-lg border border-gray-300 self-start">
      <TouchableOpacity
        className={`p-3 items-center ${selected === 0 ? 'bg-brand-800' : 'bg-white'} rounded-l-lg`}
        onPress={() => setSelected(0)}
      >
        <Text className={`${selected === 0 ? 'text-white' : 'text-gray-800'} font-medium`}>Oui</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`p-3 items-center ${selected === 1 ? 'bg-brand-800' : 'bg-white'} rounded-r-lg border-l border-gray-300`}
        onPress={() => setSelected(1)}
      >
        <Text className={`${selected === 1 ? 'text-white' : 'text-gray-800'} font-medium`}>Non</Text>
      </TouchableOpacity>
    </View>
  );
}