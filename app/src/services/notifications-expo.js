import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {Platform} from 'react-native';
import Constants from 'expo-constants';
import api from './api';

function handleRegistrationError(errorMessage) {
  // alert(errorMessage);
  console.log('✌️  handleRegistrationError', errorMessage);
  // throw new Error(errorMessage);
}

const debug = true;
async function registerForPushNotificationsAsync({userId}) {
  debug && console.log('📱 Starting push notification registration for userId:', userId);

  if (!userId) {
    debug && console.log('❌ No userId provided, aborting registration');
    return;
  }

  if (Platform.OS === 'android') {
    debug && console.log('🤖 Setting up Android notification channel');
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    debug && console.log('📱 Checking notification permissions');
    const {status: existingStatus} = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      debug && console.log('🔄 Requesting notification permissions');
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    debug && console.log('📍 Permission status:', finalStatus);

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    debug && console.log('🆔 Project ID:', projectId);

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      debug && console.log('🎯 Requesting Expo push token');
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      debug && console.log('✅ Push token obtained:', pushTokenString);

      // Removed API call to non-existent endpoint
      debug && console.log('✅ Push token successfully obtained');

      return pushTokenString;
    } catch (e) {
      debug && console.log('❌ Error during push token registration:', e);
      handleRegistrationError(`${e}`);
    }
  } else {
    debug && console.log('❌ Not a physical device, push notifications unavailable');
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export {registerForPushNotificationsAsync};
