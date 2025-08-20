import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type DifficultyOptionProps = {
  id: string | number;
  label: string;
  description?: string;
  selected: boolean;
  onPress: (id: string | number) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  shape?: "square" | "circle";
};

export default function SelectionnableItem({ id, label, description, selected, onPress, className, icon }: DifficultyOptionProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={mergeClassNames(
        "mb-3 p-4 rounded-xl border-2 flex-1",
        selected ? "border-brand-800 bg-brand-25" : "border-gray-300 bg-transparent",
        className
      )}
    >
      <View className="flex-row flex-1 items-center">
        {selected ? (
          <View className="mr-3 w-6 h-6 rounded-md items-center justify-center bg-primary">
            <Text className="text-white text-base font-bold">✓</Text>
          </View>
        ) : (
          <View className="mr-3 w-6 h-6 rounded-md items-center justify-center border-2 border-gray-300">
            <Text className="text-white text-xs" />
          </View>
        )}
        <View className="flex-1">
          <Text className={mergeClassNames(typography.textMdMedium, "text-brand-950")}>{label}</Text>
          {description && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mt-1")}>{description}</Text>}
        </View>
        {icon && (
          <View className="rounded-full border border-1 border-gray-700 bg-white w-10 h-10 items-center justify-center">
            {React.createElement(icon)}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function LightSelectionnableItem({ id, label, description, selected, onPress, className, disabled, icon, shape }: DifficultyOptionProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPress(id)}
      className={mergeClassNames("mb-3 py-3 border-b", "border-gray-300 bg-transparent", className, disabled ? "opacity-50" : "")}
    >
      <View className="flex-row items-center">
        {selected ? (
          <View
            className={mergeClassNames("w-6 h-6 items-center justify-center bg-primary mr-4", shape === "circle" ? "rounded-full" : "rounded-md")}
          >
            <Text className="text-white text-base font-bold">✓</Text>
          </View>
        ) : (
          <View
            className={mergeClassNames(
              "w-6 h-6 items-center justify-center border-2 border-gray-300 mr-4",
              shape === "circle" ? "rounded-full" : "rounded-md"
            )}
          >
            <Text className="text-white text-xs" />
          </View>
        )}
        {icon && (
          <View className="mr-3 rounded-lg border border-1 border-gray-300 bg-white w-10 h-10 items-center justify-center">
            {React.createElement(icon)}
          </View>
        )}
        <View className="flex-1">
          <Text className={mergeClassNames(typography.textMdMedium, "text-brand-950", disabled ? "line-through" : "")}>{label}</Text>
          {description && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-600 mt-1")}>{description}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function InputSelectionnableItem({
  id,
  label,
  selected,
  onPress,
  className,
  icon,
  validationError,
  onTextChange,
}: DifficultyOptionProps & {
  validationError?: string;
  onTextChange?: (text: string) => void;
}) {
  const [value, setValue] = useState<string>("");

  const handleTextChange = (text: string) => {
    setValue(text);
    if (onTextChange) {
      onTextChange(text);
    }
  };

  return (
    <TouchableOpacity
      key={id}
      onPress={() => onPress(id)}
      className={mergeClassNames("mb-3 py-3 border-b", selected ? "border-brand-800 bg-brand-25" : "border-gray-300 bg-transparent", className)}
    >
      <View className="flex-row items-center">
        {selected ? (
          <View className="w-6 h-6 rounded-md items-center justify-center bg-primary mr-2">
            <Text className="text-white text-base font-bold">✓</Text>
          </View>
        ) : (
          <View className="w-6 h-6 rounded-md items-center justify-center border-2 border-gray-300 mr-4">
            <Text className="text-white text-xs" />
          </View>
        )}
        {icon && (
          <View className="mr-3 rounded-lg border border-1 border-gray-300 bg-white w-10 h-10 items-center justify-center">
            {React.createElement(icon)}
          </View>
        )}
        <View className="flex-1 flex-col">
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mb-2")}>{label}</Text>
          <View className="rounded rounded-lg flex-1">
            <TextInput
              onChangeText={handleTextChange}
              className={mergeClassNames(typography.textMdRegular, "text-left border border-gray-300 p-2 rounded rounded-lg flex-1")}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 10,
                bottom: 5,
              }}
              onPress={() => onPress(value)}
            >
              <Text className={mergeClassNames(typography.textMdSemibold, "text-brand-800")}>Valider</Text>
            </TouchableOpacity>
          </View>
          {validationError && <Text className={mergeClassNames(typography.textSmMedium, "text-red-600 mt-2")}>{validationError}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
