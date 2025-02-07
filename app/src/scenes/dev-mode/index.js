import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Platform} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOST, HMAC_SECRET} from '../../config';
import app from '../../../app.json';

const CollapsibleSection = ({title, children}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.arrow, isExpanded && styles.arrowDown]}>›</Text>
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const DevMode = ({navigation}) => {
  const disableDevMode = async () => {
    await AsyncStorage.setItem('devMode', 'false');
    navigation.navigate('tabs');
  };

  const [deviceId, setDeviceId] = useState(null);

  const fetchDeviceId = async () => {
    const id = await AsyncStorage.getItem('deviceId');
    setDeviceId(id);
  };
  useEffect(() => {
    fetchDeviceId();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <CollapsibleSection title="Environment">
        <Text>Host: {HOST}</Text>
        <Text>HMAC: {HMAC_SECRET ? `...${HMAC_SECRET.slice(-5)}` : 'empty'}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="App Version">
        <Text>Version: {app.expo.version}</Text>
        <Text>Build: {Platform.OS === 'ios' ? app.expo.ios.buildNumber : app.expo.android.versionCode}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="Local Storage">
        <Text>Device ID: {deviceId}</Text>
      </CollapsibleSection>

      <TouchableOpacity style={styles.button} onPress={disableDevMode}>
        <Text style={styles.buttonText}>Disable Dev Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.DARK_BLUE,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.DARK_BLUE,
  },
  button: {
    backgroundColor: colors.DARK_BLUE,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  arrow: {
    fontSize: 24,
    color: colors.DARK_BLUE,
    transform: [{rotate: '-90deg'}],
  },
  arrowDown: {
    transform: [{rotate: '90deg'}],
  },
});

export default DevMode;
