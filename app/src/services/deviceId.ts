import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

class DeviceIdService {
  private deviceId: string | null = null;
  private initializationPromise: Promise<string> | null = null;

  async getDeviceId(): Promise<string> {
    // If we already have the deviceId in memory, return it immediately
    if (this.deviceId) {
      console.log('DeviceIdService: returning cached deviceId', this.deviceId);
      return this.deviceId;
    }
    
    // If there's already an initialization in progress, wait for it
    if (this.initializationPromise) {
      console.log('DeviceIdService: waiting for existing initialization');
      return this.initializationPromise;
    }
    
    // Start a new initialization
    console.log('DeviceIdService: starting new initialization');
    this.initializationPromise = this.initializeDeviceId();
    
    try {
      // Wait for initialization to complete
      const deviceId = await this.initializationPromise;
      return deviceId;
    } finally {
      // Clear the promise so future calls can re-initialize if needed
      this.initializationPromise = null;
    }
  }
  
  private async initializeDeviceId(): Promise<string> {
    console.log('DeviceIdService: checking AsyncStorage for deviceId');
    let deviceId = await AsyncStorage.getItem('deviceId');
    
    if (!deviceId) {
      console.log('DeviceIdService: no deviceId found, generating new one');
      deviceId = uuid.v4() as string;
      console.log('DeviceIdService: generated new deviceId', deviceId);
      await AsyncStorage.setItem('deviceId', deviceId);
      console.log('DeviceIdService: saved new deviceId to AsyncStorage');
    } else {
      console.log('DeviceIdService: found existing deviceId', deviceId);
    }
    
    // Cache the deviceId in memory
    this.deviceId = deviceId;
    return deviceId;
  }
}

// Create a singleton instance
const deviceIdService = new DeviceIdService();
export default deviceIdService;
