import Svg, { Path } from "react-native-svg";

export default function TrendUpIcon(props) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.3333 5.83331L11.7761 12.3905C11.4461 12.7205 11.2811 12.8855 11.0908 12.9473C10.9235 13.0017 10.7432 13.0017 10.5758 12.9473C10.3855 12.8855 10.2205 12.7205 9.89051 12.3905L7.60946 10.1095C7.27945 9.77944 7.11444 9.61443 6.92417 9.55261C6.7568 9.49823 6.57651 9.49823 6.40914 9.55261C6.21887 9.61443 6.05386 9.77944 5.72385 10.1095L1.66666 14.1666M18.3333 5.83331H12.5M18.3333 5.83331V11.6666"
        stroke={props.color || "#3D6874"}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
