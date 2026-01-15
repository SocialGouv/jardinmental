import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import Health from "@assets/svg/icon/Health";
import TrashIcon from "@assets/svg/icon/Trash";

import React, { useState } from "react";
import { GestureResponderEvent, Text, TextInput, TouchableOpacity, View } from "react-native";

type DifficultyOptionProps = {
  id: string | number;
  label: string;
  description?: string;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  boxPosition?: string;
  shape?: "square" | "circle";
  placeholder?: string;
};

export default function SelectionnableItem({ id, label, description, selected, onPress, className, icon, boxPosition }: DifficultyOptionProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={mergeClassNames(
        "mb-3 p-4 rounded-xl border-2 flex-1",
        selected ? "border-brand-800 bg-brand-25" : "border-gray-300 bg-[#FCFCFD]",
        className
      )}
    >
      <View className={mergeClassNames("flex-row flex-1", boxPosition === "top" ? "items-start" : "items-center")}>
        {selected ? (
          <View className="mr-3 w-6 h-6 rounded-md items-center justify-center bg-cnam-primary-800">
            <Text className="text-white text-base font-bold">✓</Text>
          </View>
        ) : (
          <View className="mr-3 w-6 h-6 rounded-md items-center justify-center border-2 border-gray-300">
            <Text className="text-white text-xs" />
          </View>
        )}
        <View className="flex-1">
          <Text
            className={mergeClassNames(
              selected ? typography.textMdSemibold : typography.textMdMedium,
              selected ? "text-cnam-primary-950" : "text-cnam-primary-900"
            )}
          >
            {label}
          </Text>
          {description && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 mt-1")}>{description}</Text>}
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

export function LightSelectionnableItem({
  id,
  label,
  description,
  selected,
  onPress,
  className,
  disabled,
  icon,
  shape,
  boxPosition,
}: DifficultyOptionProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPress(id)}
      className={mergeClassNames("mb-3 py-3 border-b", "border-gray-300 bg-transparent", className, disabled ? "opacity-50" : "")}
    >
      <View className={mergeClassNames("flex-row items-center", boxPosition === "top" ? "items-start" : "items-center")}>
        {selected ? (
          <View
            className={mergeClassNames("w-6 h-6 items-center justify-center bg-primary mr-4", shape === "circle" ? "rounded-full" : "rounded-md")}
          >
            {shape == "circle" ? <View className="bg-white w-2 h-2 rounded-xl" /> : <Text className="text-white text-base font-bold">✓</Text>}
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
          {description && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 mt-1")}>{description}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const SelectionnableRadioItem = ({ onPress, selected, children, text }) => {
  return (
    <TouchableOpacity
      className={mergeClassNames("border rounded-xl bg-white p-4 w-full mb-4", selected ? "border-cnam-primary-900" : "border-cnam-primary-800")}
      onPress={onPress}
    >
      <View className="flex-row items-center mb-4">
        {selected ? (
          <View className={mergeClassNames("w-6 h-6 items-center justify-center bg-primary mr-2", "rounded-full")}>
            <View className="bg-white w-2 h-2 rounded-xl" />
          </View>
        ) : (
          <View className={mergeClassNames("w-6 h-6 items-center justify-center border-2 border-gray-300 mr-2", "rounded-full")}>
            <Text className="text-white text-xs" />
          </View>
        )}
        <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>{text}</Text>
      </View>
      <View className="mx-8">{children}</View>
    </TouchableOpacity>
  );
};

export function InputSelectionnableItem({
  id,
  label,
  selected,
  onPress,
  className,
  icon,
  shape,
  validationError,
  placeholder,
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
          <View
            className={mergeClassNames("w-6 h-6 items-center justify-center bg-primary mr-4", shape === "circle" ? "rounded-full" : "rounded-md")}
          >
            {shape == "circle" ? <View className="bg-white w-2 h-2 rounded-xl" /> : <Text className="text-white text-base font-bold">✓</Text>}
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
        <View className="flex-1 flex-col">
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 mb-2")}>{label}</Text>
          <View className="rounded rounded-lg flex-1">
            <TextInput
              placeholder={placeholder}
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

export function ListItem({ id, label, description, selected, onPress, className, icon, boxPosition }: DifficultyOptionProps) {
  return (
    <View className={mergeClassNames("bg-white border-2 border-cnam-primary-800 p-4 rounded-xl mt-2", className)}>
      <View className={mergeClassNames("flex-row items-start")}>
        {
          <View className="mr-4">
            <Health />
          </View>
        }
        {icon && (
          <View className="mr-3 rounded-lg border border-1 border-gray-300 bg-white w-10 h-10 items-center justify-center">
            {React.createElement(icon)}
          </View>
        )}
        <View className="flex-1">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>{label}</Text>
          {description && <Text className={mergeClassNames(typography.textSmMedium, "text-gray-600 mt-1")}>{description}</Text>}
        </View>
        <TouchableOpacity onPress={onPress} className="ml-auto items-center justify-center self-stretch">
          <TrashIcon color={TW_COLORS.CNAM_CYAN_600_DARKEN_20} width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
