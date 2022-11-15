import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Configuration from "./Configuration";
import AddIndicator from "./AddIndicator";

const Stack = createStackNavigator();

const ConfigurationNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={"CONFIGURATION"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"CONFIGURATION"} component={Configuration} />
      <Stack.Screen name={"ADD_INDICATOR"} component={AddIndicator} />
    </Stack.Navigator>
  );
};

export default ConfigurationNavigator;
