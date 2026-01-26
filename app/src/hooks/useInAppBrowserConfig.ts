import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "useInAppBrowser";

export interface InAppBrowserConfig {
  useInAppBrowser: boolean;
  setUseInAppBrowser: (value: boolean) => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook to manage the in-app browser configuration
 * This setting determines whether external links should open in an in-app browser
 * (using expo-web-browser) or in the external system browser
 */
export const useInAppBrowserConfig = (): InAppBrowserConfig => {
  const [useInAppBrowser, setUseInAppBrowserState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load the configuration from AsyncStorage on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          setUseInAppBrowserState(value === "true");
        }
      } catch (error) {
        console.error("Failed to load in-app browser config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  // Save the configuration to AsyncStorage
  const setUseInAppBrowser = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value.toString());
      setUseInAppBrowserState(value);
    } catch (error) {
      console.error("Failed to save in-app browser config:", error);
    }
  };

  return {
    useInAppBrowser,
    setUseInAppBrowser,
    isLoading,
  };
};
