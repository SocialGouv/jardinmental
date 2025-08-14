import React from "react";
import { View, Image, Text } from "react-native";
import { styled } from "nativewind";

const StyledImage = styled(Image);

interface Avatar {
  uri: string;
  alt: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  max?: number;
  size?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, max = 4, size = 40 }) => {
  const displayed = avatars.slice(0, max);
  const extra = avatars.length > max ? avatars.length - max : 0;
  console.log("AvatarGroup", displayed);
  return (
    <View className="flex-row items-center">
      {displayed.map((avatar, index) => (
        <StyledImage
          key={index}
          source={typeof avatar.uri === "string" ? { uri: avatar.uri } : avatar.uri}
          accessibilityLabel={avatar.alt}
          className="rounded-full border-2 border-white"
          style={{
            width: size,
            height: size,
            marginLeft: index === 0 ? 0 : -size * 0.3,
            zIndex: index + 1,
          }}
        />
      ))}

      {extra > 0 && (
        <View
          className="bg-gray-300 rounded-full border-2 border-white justify-center items-center"
          style={{
            width: size,
            height: size,
            marginLeft: -size * 0.3,
            zIndex: displayed.length + 1,
          }}
        >
          <Text className="text-xs text-black">+{extra}</Text>
        </View>
      )}
    </View>
  );
};
