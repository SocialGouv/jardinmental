import React, { useEffect, useState, useContext, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import localStorage from '../../../utils/localStorage';
import { useSurveyScreens, SurveyScreen } from './hooks/useSurveyScreens';
import { Indicator } from '../../../entities/Indicator';
import { DiaryDataNewEntryInput } from '../../../entities/DiaryData';
import SurveyScreenWrapper from './SurveyScreenWrapper';
import SurveyContext, { SurveyContextType } from './SurveyContext';

const Stack = createStackNavigator();

interface SurveyNavigatorProps {
  navigation: any;
  route: {
    params?: {
      currentSurvey: DiaryDataNewEntryInput;
      editingSurvey: boolean;
      redirect?: boolean;
    };
  };
}


// Main navigator component
const SurveyStackNavigator: React.FC<{ context: SurveyContextType; isLoading: boolean }> = ({ context, isLoading }) => {
  const { screens } = context;

  // Show loading indicator while screens are being prepared
  if (isLoading || screens.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={`screen-${screens[0].id}`}
      screenOptions={{ headerShown: false }}
    >
      {screens.map((screen, index) => (
        <Stack.Screen
          key={screen.id}
          name={`screen-${screen.id}`}
          component={SurveyScreenWrapper}
          initialParams={{
            screenData: screen,
            screenIndex: index,
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export const SurveyNavigator: React.FC<SurveyNavigatorProps> = ({ navigation, route }) => {

  const initEditingSurvey = route?.params?.editingSurvey ?? false;

  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const screens = useSurveyScreens(userIndicateurs);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setIsLoading(true);
          const user_indicateurs = await localStorage.getIndicateurs();
          if (user_indicateurs) {
            setUserIndicateurs(user_indicateurs);
          }
        } catch (error) {
          console.error('Error loading user indicators:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    }, []),
  );

  const contextValue: SurveyContextType = {
    userIndicateurs,
    initEditingSurvey,
    screens,
    parentNavigation: navigation,
    parentRoute: route,
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      <SurveyStackNavigator context={contextValue} isLoading={isLoading} />
    </SurveyContext.Provider>
  );
};

export default SurveyNavigator;
