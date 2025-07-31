import { mergeClassNames } from "@/utils/className"
import { typography } from "@/utils/typography"
import { View, Text } from "react-native"

interface AlertBannerProps {
  text: string;
}

export default ({ text }: AlertBannerProps) => {
    return <View 
        className={'bg-[#FDF2E7] py-3 px-2 mb-1'}
        role="alert"
        accessibilityRole="text"
    >
        <Text 
            className={mergeClassNames(typography.textSmMedium, 'text-[#822F2F]')}
            accessibilityLabel={text}
        >
            {text}
        </Text>
    </View>
}