import * as React from "react";
import { Text } from "react-native";

/**
 * @param {{ h1?: boolean, h2?: boolean, h3?: boolean, h4?: boolean, h5?: boolean, p?: boolean, bold?: boolean, italic?: boolean, children: React.ReactNode, style?: StyleProp<TextStyle> }} props
 */
export default ({ h1, h2, h3, h4, h5, p, bold, italic, children, style, ...rest }) => {
  const s = { fontFamily: "SourceSans3", color: "#111" };
  return (
    <Text style={[s, style]} {...rest}>
      {children}
    </Text>
  );
};
