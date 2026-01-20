import React from "react";
import { View, Text } from "react-native";
import Separator from "@/components/Separator";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import FileIcon from "@assets/svg/icon/File";
import { Typography } from "@/components/Typography";

const Context = ({ data }) => {
  if (!data || !data.userComment) return null;

  return (
    <>
      <Separator separatorColor={TW_COLORS.GRAY_400} />
      <View className="justify-between items-start bg-cnam-primary-50 rounded-xl p-2 my-2">
        <Typography className={mergeClassNames(typography.textSmSemibold, "mb-1 text-cnam-primary-900")}>Note générale</Typography>
        <View className="w-full flex-row items-center items-start">
          <FileIcon />
          <Typography
            className={mergeClassNames("flex-1", typography.textSmRegular, "text-cnam-gray-950 italic px-2")}
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3-Italic",
              fontWeight: "500",
              fontStyle: "italic",
              color: TW_COLORS.GRAY_950,
            }}
          >
            {data.userComment || "Oui"}
          </Typography>
        </View>
      </View>
    </>
  );
};

export default Context;
