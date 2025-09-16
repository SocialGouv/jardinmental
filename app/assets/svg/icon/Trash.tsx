import { Svg, Path } from "react-native-svg";

export default function TrashIcon({ color, width, height }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width || "24"} height={height || "25"} viewBox="0 0 24 25" fill="none">
      <Path
        d="M16 6.5V5.7C16 4.5799 16 4.01984 15.782 3.59202C15.5903 3.21569 15.2843 2.90973 14.908 2.71799C14.4802 2.5 13.9201 2.5 12.8 2.5H11.2C10.0799 2.5 9.51984 2.5 9.09202 2.71799C8.71569 2.90973 8.40973 3.21569 8.21799 3.59202C8 4.01984 8 4.5799 8 5.7V6.5M10 12V17M14 12V17M3 6.5H21M19 6.5V17.7C19 19.3802 19 20.2202 18.673 20.862C18.3854 21.4265 17.9265 21.8854 17.362 22.173C16.7202 22.5 15.8802 22.5 14.2 22.5H9.8C8.11984 22.5 7.27976 22.5 6.63803 22.173C6.07354 21.8854 5.6146 21.4265 5.32698 20.862C5 20.2202 5 19.3802 5 17.7V6.5"
        stroke={color || "#0084B2"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
