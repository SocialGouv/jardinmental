import * as React from 'react';
import {Text} from 'react-native';

export default ({
  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  bold,
  italic,
  children,
  style,
  ...rest
}) => {
  return (
    <Text style={[style, {fontFamily: 'System'}]} {...rest}>
      {children}
    </Text>
  );
};
