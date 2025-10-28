import Svg, { Path } from "react-native-svg";

export default function MailIcon({ color, width = 24, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18.5C6 18.9596 6.09053 19.4147 6.26642 19.8394C6.44231 20.264 6.70012 20.6498 7.02513 20.9749C7.35013 21.2999 7.73597 21.5577 8.16061 21.7336C8.58525 21.9094 9.04037 22 9.5 22C9.95963 22 10.4148 21.9094 10.8394 21.7336C11.264 21.5577 11.6499 21.2999 11.9749 20.9749C12.2999 20.6498 12.5577 20.264 12.7336 19.8394C12.9095 19.4147 13 18.9596 13 18.5C13 16.93 13.92 15.98 15.04 15.04"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 8.49999C6 7.74999 6.13 7.02999 6.36 6.35999"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.80005 3.14999C9.77572 2.47449 10.9177 2.07898 12.1021 2.00633C13.2866 1.93369 14.4684 2.18669 15.5193 2.7379C16.5702 3.2891 17.4501 4.11749 18.0637 5.13323C18.6773 6.14897 19.0011 7.3133 19 8.49999C19 10.13 18.56 11.31 17.91 12.26"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.5 6C13.163 6 13.7989 6.26339 14.2678 6.73223C14.7366 7.20107 15 7.83696 15 8.5M10 13C10.3847 12.9992 10.761 12.8874 11.0839 12.6782C11.4067 12.4689 11.6623 12.1709 11.82 11.82"
        stroke={color || "#3D6874"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M2 2L22 22" stroke={color || "#3D6874"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
