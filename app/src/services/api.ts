import URI from 'urijs';
import { Alert, Linking, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import fetchRetry from 'fetch-retry';

import { SCHEME, HOST } from '../config';
import matomo from './matomo';
import { generateHMAC } from '../utils/generateHmac';
import app from '../../app.json';

export const checkNetwork = async (test = false) => {
  const isConnected = await NetInfo.fetch().then(state => state.isConnected);
  if (!isConnected || test) {
    await new Promise(res => setTimeout(res, 1500));
    Alert.alert('Pas de réseau', 'Veuillez vérifier votre connexion');
    return false;
  }
  return true;
};

class ApiService {
  host = HOST;
  scheme = SCHEME;
  fetch = fetchRetry(fetch);
  getUrl = (path, query) => {
    return new URI().host(this.host).scheme(this.scheme).path(path).setSearch(query).toString();
  };
  execute = async ({method = 'GET', path = '', query = {}, headers = {}, body = null}) => {
    try {
      if (body) {
        const {signature, timestamp} = generateHMAC(body);
        headers = {
          ...headers,
          'x-signature': signature,
          'x-timestamp': timestamp,
        };
      }
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          appversion: Platform.OS === 'ios' ? app.expo.ios.buildNumber : app.expo.android.versionCode,
          appdevice: Platform.OS,
          currentroute: this.navigation?.getCurrentRoute?.()?.name,
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        retries: 3,
        retryDelay: 1000,
      };

      const url = this.getUrl(path, query);
      console.log('HOST', url)
      const canFetch = await checkNetwork();
      if (!canFetch) return;
      const response = await this.fetch(url, config);
      if (response.json) {
        const readableRes = await response.json();
        if (readableRes.sendInApp) this.handleInAppMessage(readableRes.sendInApp);
        return readableRes;
      }

      return response;
    } catch (e) {
      console.error(e)
      return {
        ok: false,
        error:
          "Veuillez nous excuser, cette erreur est inattendue : l'équipe technique a été prévenue. Veuillez retenter dans quelques instants ou nous contacter si l'erreur persiste.",
      };
    }
  };

  needUpdate = false;

  get = async args => this.execute({method: 'GET', ...args});
  post = async args => this.execute({method: 'POST', ...args});
  put = async args => this.execute({method: 'PUT', ...args});
  delete = async args => this.execute({method: 'DELETE', ...args});

  handleInAppMessage = inAppMessage => {
    const [title, subTitle, actions = [], options = {}] = inAppMessage;
    if (!actions || !actions.length) return Alert.alert(title, subTitle);
    const actionsWithNavigation = actions.map(action => {
      if (action.navigate) {
        action.onPress = () => {
          API.navigation.navigate(...action.navigate);
          if (action.event) matomo.logEvent(action.event);
        };
      }
      if (action.link) {
        action.onPress = () => {
          Linking.openURL(action.link);
          if (action.event) matomo.logEvent(action.event);
        };
      }
      return action;
    });
    Alert.alert(title, subTitle, actionsWithNavigation, options);
  };
}

const API = new ApiService();
export default API;
