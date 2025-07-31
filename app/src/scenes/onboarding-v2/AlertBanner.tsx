import { mergeClassNames } from "@/utils/className"
import { typography } from "@/utils/typography"
import { View, Text } from "react-native"

export default ({ text }: { text: string }) => {
    return <View className={'bg-[#FDF2E7] py-3 px-2 mb-1'}>
        <Text className={mergeClassNames(typography.textSmMedium, 'text-[#822F2F]')}>{text}</Text>
    </View>
}