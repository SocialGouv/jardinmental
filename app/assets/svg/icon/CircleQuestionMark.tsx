import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function CircleQuestionMark({
    color
}: {
    color?: string
}) {
    return <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <G clip-path="url(#clip0_17718_3108)">
            <Path d="M7.57484 7.49984C7.77076 6.94289 8.15746 6.47326 8.66647 6.17411C9.17547 5.87497 9.77392 5.76562 10.3558 5.86543C10.9377 5.96524 11.4655 6.26777 11.8457 6.71944C12.226 7.17111 12.4341 7.74277 12.4332 8.33317C12.4332 9.99984 9.93317 10.8332 9.93317 10.8332M9.99984 14.1665H10.0082M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984Z"
                stroke={color || "#617778"}
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </G>
        <Defs>
            <ClipPath id="clip0_17718_3108">
                <Rect width="20" height="20" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
}
