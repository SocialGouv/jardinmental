import Svg, { Path } from "react-native-svg";

export default function PlayCircleIcon({ color, width = 25, height = 24 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 20" fill="none">
      <Path
        d="M10.5 18.3334C15.1024 18.3334 18.8334 14.6025 18.8334 10.0001C18.8334 5.39771 15.1024 1.66675 10.5 1.66675C5.89765 1.66675 2.16669 5.39771 2.16669 10.0001C2.16669 14.6025 5.89765 18.3334 10.5 18.3334Z"
        stroke="#3D6874"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.41669 7.47119C8.41669 7.07345 8.41669 6.87459 8.49981 6.76356C8.57224 6.66681 8.68312 6.60628 8.80367 6.59767C8.94201 6.58779 9.10929 6.69533 9.44386 6.91041L13.3777 9.4393C13.668 9.62593 13.8132 9.71925 13.8633 9.83791C13.9071 9.94159 13.9071 10.0586 13.8633 10.1623C13.8132 10.2809 13.668 10.3742 13.3777 10.5609L9.44386 13.0898C9.10929 13.3048 8.94201 13.4124 8.80367 13.4025C8.68312 13.3939 8.57224 13.3334 8.49981 13.2366C8.41669 13.1256 8.41669 12.9267 8.41669 12.529V7.47119Z"
        stroke="#3D6874"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
