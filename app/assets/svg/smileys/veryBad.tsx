import { iconColors } from "@/utils/constants";
import Svg, { Path } from "react-native-svg";

export default function SmileyVeryGood() {
    return <Svg width="25" height="26" viewBox="0 0 25 26" fill="none">
        <Path d="M16.5611 17.3826C16.5611 17.3826 14.9176 15.1913 12.1784 15.1913C9.43932 15.1913 7.79584 17.3826 7.79584 17.3826M17.6567 9.976C17.2239 10.5074 16.6323 10.8087 16.0132 10.8087C15.3942 10.8087 14.819 10.5074 14.3698 9.976M9.98714 9.976C9.55436 10.5074 8.96271 10.8087 8.34366 10.8087C7.72462 10.8087 7.1494 10.5074 6.70018 9.976M23.135 13C23.135 19.0511 18.2296 23.9565 12.1784 23.9565C6.12733 23.9565 1.22192 19.0511 1.22192 13C1.22192 6.94888 6.12733 2.04348 12.1784 2.04348C18.2296 2.04348 23.135 6.94888 23.135 13Z"
            stroke={iconColors.veryBad}
            strokeWidth={2.1}
            strokeLinecap="round"
            strokeLinejoin="round" />
    </Svg>

}